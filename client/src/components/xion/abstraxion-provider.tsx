"use client"

import React from 'react'
import { AbstraxionProvider } from '@burnt-labs/abstraxion'

// Configuration for the Xion network
const XION_CONFIG = {
//   appName: 'XionxePay',
//   chainId: 'xion-testnet-1',
//   chainName: 'Xion Testnet',
  rpcUrl: "https://rpc.xion-testnet-2.burnt.com/",
  restUrl: "https://api.xion-testnet-2.burnt.com/",
  treasury: "xion1l2gp7xpu2f05qmg9egsp4s3xkmyz0z0wgsg3ac6axs56vu0yhvhsulamwx",
//   nativeDenom: 'uxion',
//   nativeDecimals: 6,
//   addressPrefix: 'xion',
//   gasPrice: '0.025',
}

export function XionAbstraxionProvider({ children }: { children: React.ReactNode }) {
  return (
    <AbstraxionProvider
      config={XION_CONFIG}
    >
      {children}
    </AbstraxionProvider>
  )
}
