"use client"

import { useEffect } from 'react'
import { useXion } from '@/contexts/xion-context'
import { useVendor } from '@/contexts/vendor-context'

/**
 * Custom hook to synchronize the Xion wallet address with the vendor context
 * This hook should be used in a component that has access to both contexts
 */
export function useXionVendorSync() {
  const { xionAddress } = useXion()
  const { updateXionWalletAddress } = useVendor()

  // Sync the Xion address to the vendor context whenever it changes
  useEffect(() => {
    updateXionWalletAddress(xionAddress)
  }, [xionAddress, updateXionWalletAddress])

  // Listen for wallet connection events
  useEffect(() => {
    const handleWalletConnect = (event: CustomEvent<{ address: string }>) => {
      if (event.detail?.address) {
        updateXionWalletAddress(event.detail.address)
      }
    }

    // Listen for wallet disconnect events
    const handleWalletDisconnect = () => {
      updateXionWalletAddress(null)
    }

    window.addEventListener('xion_wallet_connected', handleWalletConnect as EventListener)
    window.addEventListener('xion_logout', handleWalletDisconnect)

    return () => {
      window.removeEventListener('xion_wallet_connected', handleWalletConnect as EventListener)
      window.removeEventListener('xion_logout', handleWalletDisconnect)
    }
  }, [updateXionWalletAddress])

  // No need to return anything as this hook is just for syncing
  return null
}
