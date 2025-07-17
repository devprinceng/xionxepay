import React, { useState, useEffect } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useAbstraxionClient,
  useModal,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import "@burnt-labs/ui/dist/index.css";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import type { Contract } from "@cosmjs/cosmwasm-stargate";

const contractAddress = "xion1sl72unfnm4n7jvapwpjs8ygft3n34ew0y0fkl9gajtkdmn45e8cs5cmms7";

type ExecuteResultOrUndefined = ExecuteResult | undefined;

export default function MetaAccountPage() {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client, logout } = useAbstraxionSigningClient();
  const { client: queryClient } = useAbstraxionClient();

  // State variables
  const [count, setCount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<ExecuteResultOrUndefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [contractInfo, setContractInfo] = useState<Contract | null>(null);
  const [, setShowModal]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useModal();

  const blockExplorerUrl = `https://www.mintscan.io/xion-testnet/tx/${executeResult?.transactionHash}`;

  // Check if contract address is valid
  const isContractAddressValid = contractAddress && contractAddress.startsWith("xion");

  // Get contract info to see what methods are available
  const getContractInfo = async () => {
    if (!isContractAddressValid) {
      setError("Please set a valid contract address");
      return;
    }

    if (!queryClient) {
      setError("Query client not available");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Try to get contract info first
      const contractInfo = await queryClient.getContract(contractAddress);
      setContractInfo(contractInfo);
      console.log("Contract Info:", contractInfo);
      
      // Try different query methods to see what's available
      try {
        const response = await queryClient.queryContractSmart(contractAddress, { get_count: {} });
        setCount(response.count);
        console.log("Get Count:", response);
      } catch {
        console.log("get_count not available, trying other methods...");
        
        // Try authenticator methods
        try {
          const authResponse = await queryClient.queryContractSmart(contractAddress, { authenticator_i_ds: {} });
          console.log("Authenticator IDs:", authResponse);
          setError("This contract doesn't have counter methods. It appears to be an account contract.");
        } catch {
          console.log("No known methods found");
          setError("Contract found but no known query methods available. This might not be a counter contract.");
        }
      }
    } catch (error) {
      console.error("Error querying contract:", error);
      setError("Failed to query contract. Please check if the contract is deployed and the address is correct.");
    } finally {
      setLoading(false);
    }
  };

  // Increment the count in the smart contract
  const increment = async () => {
    if (!isContractAddressValid) {
      setError("Please set a valid contract address");
      return;
    }

    if (!account?.bech32Address) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError(null);
    const msg = { increment: {} };

    try {
      const res = await client?.execute(account.bech32Address, contractAddress, msg, "auto");
      setExecuteResult(res);
      console.log("Transaction successful:", res);
      await getContractInfo(); // Refresh info after successful transaction
    } catch (error) {
      console.error("Error executing transaction:", error);
      setError("Failed to execute transaction. This contract might not support increment operations.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch contract info on page load
  useEffect(() => {
    if (queryClient && isContractAddressValid) {
      getContractInfo();
    }
  }, [queryClient, isContractAddressValid]);

  return (
    <main className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter text-white">ABSTRAXION</h1>

      <Button fullWidth onClick={() => setShowModal(true)} structure="base">
        {account?.bech32Address ? <div className="flex items-center justify-center">VIEW ACCOUNT</div> : "CONNECT"}
      </Button>

      {client && (
        <>
          <Button disabled={loading} fullWidth onClick={getContractInfo} structure="base">
            {loading ? "LOADING..." : "Query Contract"}
          </Button>
          <Button disabled={loading} fullWidth onClick={increment} structure="base">
            {loading ? "LOADING..." : "INCREMENT"}
          </Button>
          {logout && (
            <Button disabled={loading} fullWidth onClick={logout} structure="base">
              LOGOUT
            </Button>
          )}
        </>
      )}

      <Abstraxion onClose={() => setShowModal(false)} />

      {error && (
        <div className="border-2 border-red-500 rounded-md p-4 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {!isContractAddressValid && (
        <div className="border-2 border-yellow-500 rounded-md p-4 bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            Contract address not configured properly.
          </p>
        </div>
      )}

      {contractInfo && (
        <div className="border-2 border-blue-500 rounded-md p-4 bg-blue-50 dark:bg-blue-900/20">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <strong>Contract Found:</strong> {contractAddress}
          </p>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <strong>Admin:</strong> {contractInfo.admin}
          </p>
        </div>
      )}

      {count !== null && (
        <div className="border-2 border-primary rounded-md p-4 flex flex-row gap-4">
          <div className="flex flex-row gap-6">
            <div>Count:</div>
            <div>{count}</div>
          </div>
        </div>
      )}

      {executeResult && (
        <div className="flex flex-col rounded border-2 border-black p-2 dark:border-white">
          <div className="mt-2">
            <p className="text-zinc-500"><span className="font-bold">Transaction Hash</span></p>
            <p className="text-sm">{executeResult.transactionHash}</p>
          </div>
          <div className="mt-2">
            <p className=" text-zinc-500"><span className="font-bold">Block Height:</span></p>
            <p className="text-sm">{executeResult.height}</p>
          </div>
          <div className="mt-2">
            <a className="text-black underline visited:text-purple-600 dark:text-white" href={blockExplorerUrl} target="_blank" rel="noopener noreferrer">
              View in Block Explorer
            </a>
          </div>
        </div>
      )}
    </main>
  );
} 