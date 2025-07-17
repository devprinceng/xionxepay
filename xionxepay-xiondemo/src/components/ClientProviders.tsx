import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import React from "react";

const config = {
  rpcUrl: "https://rpc.xion-testnet-2.burnt.com/",
  restUrl: "https://api.xion-testnet-2.burnt.com/",
  treasury: "xion1l2gp7xpu2f05qmg9egsp4s3xkmyz0z0wgsg3ac6axs56vu0yhvhsulamwx",
};

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AbstraxionProvider config={config}>
      {children}
    </AbstraxionProvider>
  );
}
