"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import { useAbstraxionSigningClient } from '@burnt-labs/abstraxion'

// Define the context type
export type XionContextType = {
  xionAddress: string | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connectXion: () => Promise<void>
  disconnectXion: () => void
}

// Create the context
const XionContext = createContext<XionContextType | undefined>(undefined)

// Cookie name for storing the Xion address
const XION_ADDRESS_COOKIE = 'xion_address'

export function XionProvider({ children }: { children: React.ReactNode }) {
  const [xionAddress, setXionAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { logout } = useAbstraxionSigningClient()

  // Load the Xion address from cookies on mount and when cookies change
  useEffect(() => {
    // Initial check for cookie
    const checkCookie = () => {
      const savedAddress = Cookies.get(XION_ADDRESS_COOKIE)
      if (savedAddress) {
        setXionAddress(savedAddress)
      }
    }
    
    // Check immediately on mount
    checkCookie()
    
    // Listen for custom events that might indicate wallet connection
    const handleWalletConnect = (event: CustomEvent) => {
      checkCookie()
    }
    
    // Add event listener for wallet connection
    window.addEventListener('xion_wallet_connected', handleWalletConnect as EventListener)
    
    return () => {
      window.removeEventListener('xion_wallet_connected', handleWalletConnect as EventListener)
    }
  }, [])

  // Connect to Xion wallet
  const connectXion = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      // We don't need to do anything here - the actual connection
      // happens in the XionConnectButton component via the Abstraxion modal
      // This function is just to track the connection state
      
      // The address will be set via the Abstraxion component
      // and handled in the XionConnectButton component
    } catch (err: any) {
      console.error('Error connecting to Xion wallet:', err)
      setError(err.message || 'Failed to connect to Xion wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Disconnect from Xion wallet
  const disconnectXion = useCallback(() => {
    // Call Abstraxion logout first
    if (logout) {
      logout()
    }
    
    // Remove the address from state and cookies
    setXionAddress(null)
    Cookies.remove(XION_ADDRESS_COOKIE)
    
    // Clear any other wallet-related cookies or local storage
    try {
      // Clear any Abstraxion-related storage
      localStorage.removeItem('abstraxion-account')
      localStorage.removeItem('abstraxion-client')
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
    
    // Dispatch a custom event to notify components that we've logged out
    window.dispatchEvent(new CustomEvent('xion_logout'))
  }, [logout])

  // Save the Xion address to cookies when it changes
  useEffect(() => {
    if (xionAddress) {
      Cookies.set(XION_ADDRESS_COOKIE, xionAddress, { expires: 7 }) // 7 days expiry
    }
  }, [xionAddress])

  // Context value
  const value: XionContextType = {
    xionAddress,
    isConnected: !!xionAddress,
    isConnecting,
    error,
    connectXion,
    disconnectXion
  }

  return (
    <XionContext.Provider value={value}>
      {children}
    </XionContext.Provider>
  )
}

// Hook to use the Xion context
export function useXion() {
  const context = useContext(XionContext)
  if (!context) {
    throw new Error('useXion must be used within a XionProvider')
  }
  return context
}
