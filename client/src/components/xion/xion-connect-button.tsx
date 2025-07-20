"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useXion } from '@/contexts/xion-context'
import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion'
import { useModal } from '@burnt-labs/abstraxion'
import '@burnt-labs/ui/dist/index.css'
import Cookies from 'js-cookie'

export function XionConnectButton() {
  const { xionAddress, isConnected, isConnecting, connectXion, disconnectXion } = useXion()
  const [showModal, setShowModal] = useModal()
  const { data: account } = useAbstraxionAccount()
  const { logout } = useAbstraxionSigningClient()
  
  // Update the xion address in cookies when the account changes
  useEffect(() => {
    if (account?.bech32Address) {
      // Store the address in a cookie
      Cookies.set('xion_address', account.bech32Address, { expires: 7 })
      
      // Dispatch a custom event to notify components that wallet is connected
      window.dispatchEvent(new CustomEvent('xion_wallet_connected', {
        detail: { address: account.bech32Address }
      }))
    }
  }, [account?.bech32Address])
  
  // Listen for logout events from the context
  useEffect(() => {
    const handleLogout = () => {
      if (logout) {
        logout()
      }
    }
    
    window.addEventListener('xion_logout', handleLogout)
    return () => {
      window.removeEventListener('xion_logout', handleLogout)
    }
  }, [logout])

  const handleConnect = () => {
    setShowModal(true)
    connectXion()
  }
  
  const handleDisconnect = () => {
    if (logout) {
      logout()
    }
    disconnectXion()
  }

  return (
    <>
      <Button 
        onClick={isConnected ? handleDisconnect : handleConnect}
        variant="outline"
        className="bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 text-white border-none hover:opacity-90"
        disabled={isConnecting}
      >
        {isConnecting ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </div>
        ) : isConnected ? (
          <div className="flex items-center">
            <span className="mr-2">✓</span>
            {xionAddress ? `${xionAddress.substring(0, 6)}...${xionAddress.substring(xionAddress.length - 4)}` : 'Connected'}
          </div>
        ) : (
          'Connect Xion Wallet'
        )}
      </Button>
      
      {/* Abstraxion modal */}
      <Abstraxion onClose={() => setShowModal(false)} />
    </>
  )
}
