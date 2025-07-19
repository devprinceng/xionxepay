"use client"

import React from 'react'
import { AbstraxionProvider } from '@burnt-labs/abstraxion'

// Configuration for Xion network with clean redirect URL
const XION_CONFIG = {
  rpcUrl: "https://rpc.xion-testnet-2.burnt.com",
  restUrl: "https://api.xion-testnet-2.burnt.com",
  treasury: "xion1aqe90yrtf2dppuqthjp599v93yf80ryzj042ed0x4lnqmdmmldxssll07k",
  // Use a clean redirect URL without query parameters to avoid "unsafe redirect" error
  redirectUrl: typeof window !== 'undefined' ? `${window.location.origin}/auth-success` : 'http://localhost:3000/auth-success'
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
