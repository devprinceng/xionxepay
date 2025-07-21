'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, RefreshCw, ExternalLink } from 'lucide-react'
import { useXion } from '@/contexts/xion-context'
import { XionConnectButton } from '@/components/xion/xion-connect-button'
import { motion } from 'framer-motion'
import { useVendor } from '@/contexts/vendor-context'
import Skeleton from '@/components/ui/skeleton'
import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion'
import { coins } from '@cosmjs/proto-signing'
import { toast } from 'sonner'

const WalletPage = () => {
  const router = useRouter()
  const { xionAddress, isConnected, disconnectXion } = useXion()
  const { vendorProfile, loading } = useVendor()
  const { data: accountData } = useAbstraxionAccount()
  const { client } = useAbstraxionSigningClient()
  
  // State for wallet balance
  const [walletBalance, setWalletBalance] = useState<string | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)

  // Function to fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    if (!client || !xionAddress) return
    
    setIsLoadingBalance(true)
    setBalanceError(null)
    
    try {
      const balance = await client.getBalance(xionAddress, 'uxion')
      // Convert from microXION (uxion) to XION
      const xionBalance = parseFloat(balance.amount) / 1000000
      setWalletBalance(xionBalance.toString())
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      setBalanceError('Failed to fetch wallet balance')
      setWalletBalance(null)
    } finally {
      setIsLoadingBalance(false)
    }
  }, [client, xionAddress])

  // Fetch balance when client and address are available
  useEffect(() => {
    if (client && xionAddress) {
      fetchWalletBalance()
    } else {
      setWalletBalance(null)
    }
  }, [client, xionAddress, fetchWalletBalance])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Wallet</h2>
        <p className="text-gray-400">Manage your Xion wallet and view your balance</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="overflow-hidden border border-gray-800">
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-gray-800">
              <div className="flex items-center">
                <div className="bg-aurora-blue-500/20 p-3 rounded-full mr-4">
                  <Wallet className="w-6 h-6 text-aurora-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Xion Wallet</h2>
                  {isConnected && (
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <p className="text-xs text-green-400">Connected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton width="60%" height={32} className="mb-2" />
                  <Skeleton width="100%" height={48} className="mb-2" />
                  <Skeleton width="100%" height={48} className="mb-2" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Wallet Status Section */}
                  <div className="rounded-lg overflow-hidden">
                    {isConnected ? (
                      <>
                        <div className="bg-aurora-blue-500/10 p-5 rounded-lg border border-aurora-blue-500/20">
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-1">Connected Address:</p>
                            <div className="flex items-center bg-gray-800/70 p-2 pl-3 pr-3 rounded-md">
                              <p className="font-mono text-white text-sm overflow-hidden overflow-ellipsis">
                                {xionAddress}
                              </p>
                              <div className="ml-2 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                  onClick={() => navigator.clipboard.writeText(xionAddress || '')}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-gray-400 text-sm">Wallet Balance:</p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-gray-400 hover:text-white"
                                onClick={fetchWalletBalance}
                                disabled={isLoadingBalance}
                              >
                                <RefreshCw className={`w-3 h-3 mr-1 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                                Refresh
                              </Button>
                            </div>
                            
                            {isLoadingBalance ? (
                              <Skeleton width="40%" height={28} className="mt-1" />
                            ) : balanceError ? (
                              <p className="text-red-400 text-sm mt-1">{balanceError}</p>
                            ) : walletBalance !== null ? (
                              <div className="bg-gray-800/70 p-4 rounded-lg">
                                <div className="flex items-baseline">
                                  <p className="text-2xl font-bold text-white">{walletBalance}</p>
                                  <p className="ml-2 text-aurora-blue-300">XION</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm mt-1">Connect your wallet to view balance</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                            onClick={() => {
                              disconnectXion()
                              toast.success('Wallet disconnected successfully')
                              router.push('/vendor')
                            }}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Disconnect Wallet
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-aurora-blue-400 hover:text-aurora-blue-300 border-aurora-blue-500/20"
                            onClick={() => window.open('https://explorer.burnt.com/xion-testnet-1', '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View in Explorer
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-aurora-blue-500/10 p-5 rounded-lg border border-aurora-blue-500/20 text-center">
                        <div className="mb-4">
                          <div className="bg-gray-800/70 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <Wallet className="w-8 h-8 text-aurora-blue-400" />
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Connect your Xion wallet to receive payments and manage your vendor account.</p>
                        <div className="flex justify-center">
                          <XionConnectButton />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Preferences Section */}
                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-white font-medium mb-3">Payment Preferences</h3>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Preferred Stablecoin</label>
                      <select className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500">
                        <option>USDC</option>
                        <option>USDT</option>
                        <option>DAI</option>
                      </select>
                      <p className="mt-2 text-xs text-gray-500">
                        Select your preferred stablecoin for receiving payments. This will be the default currency for your payment links.
                      </p>
                    </div>
                  </div>
                  
                  {/* Wallet Tips Section */}
                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-white font-medium mb-3">Wallet Tips</h3>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <ul className="text-sm text-gray-400 space-y-3">
                        <li className="flex items-start">
                          <span className="bg-aurora-blue-500/20 text-aurora-blue-400 w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                          <span>Make sure your wallet has enough XION tokens for transaction fees.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-aurora-blue-500/20 text-aurora-blue-400 w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                          <span>If your balance shows 0 but you have tokens, they might be staked or locked.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-aurora-blue-500/20 text-aurora-blue-400 w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                          <span>For testing, use the Xion testnet faucet to get free tokens.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default WalletPage