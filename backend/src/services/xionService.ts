// import {
//   xionPublicActions,
//   xionWalletActions
// } from '@abstract-money/actions-xion';
// import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
// import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';

// async function initXionClients() {
//   const rpc = process.env.XION_RPC_URL!;
//   const apiBase = process.env.XION_API_BASE!;
//   const pkHex = process.env.RELAYER_PK!;

//   const cosm = await CosmWasmClient.connect(rpc);
//   const publicClient = xionPublicActions(cosm, apiBase);

//   const wallet = DirectSecp256k1Wallet.fromKey(Uint8Array.from(Buffer.from(pkHex, 'hex')), 'xion');
//   const signer = await SigningCosmWasmClient.connectWithSigner(rpc, await wallet);
//   const address = (await wallet.getAccounts())[0].address;
//   const walletClient = xionWalletActions(signer, address, apiBase);

//   return { publicClient, walletClient, relayerAddr: address };
// }
// export const xionService = {
//   initXionClients,
//   CosmWasmClient,
//   SigningCosmWasmClient,
//   DirectSecp256k1Wallet
// };