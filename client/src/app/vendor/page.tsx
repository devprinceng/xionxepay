'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Users, Wallet, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { XionConnectButton } from '@/components/xion/xion-connect-button'
import { useXion } from '@/contexts/xion-context'
import Cookies from 'js-cookie'
import { useVendor } from '@/contexts/vendor-context'
import { paymentAPI, Transaction } from '@/lib/payment-api'
import { toast } from 'sonner'
import { MarketTrendWidget } from '@/components/dashboard/market-trend-widget'

const VendorPage = () => {
  const router = useRouter()
  const { isConnected } = useXion()
  const { vendorProfile } = useVendor()
  
  // State for API data
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: 'Total Sales', value: '$0.00', icon: DollarSign, change: '+0%' },
    { label: 'Transactions', value: '0', icon: TrendingUp, change: '+0%' },
    // { label: 'Customers', value: '0', icon: Users, change: '+0%' },
  ])

  // Fetch transactions and calculate stats
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected) return
      
      try {
        setLoading(true)
        const allTransactions = await paymentAPI.getAllTransactions()
        // console.log('🔍 DEBUG: Transaction data structure:', allTransactions[0])
        setTransactions(allTransactions)
        
        // Calculate stats from real data
        const completedTransactions = allTransactions.filter(t => t.status === 'completed')
        const totalSales = completedTransactions.reduce((sum, t) => sum + t.amount, 0)
        const totalTransactions = allTransactions.length
        
        // Get unique customers (basic count based on customerEmail if available)
        const uniqueCustomers = new Set(
          allTransactions
            .filter(t => t.customerEmail)
            .map(t => t.customerEmail)
        ).size
        
        setStats([
          { 
            label: 'Total Sales', 
            value: `${totalSales.toFixed(6)}`, 
            icon: DollarSign, 
            change: '+0%' // TODO: Calculate month-over-month change
          },
          { 
            label: 'Transactions', 
            value: totalTransactions.toString(), 
            icon: TrendingUp, 
            change: '+0%' // TODO: Calculate month-over-month change
          },
          // { 
          //   label: 'Customers', 
          //   value: uniqueCustomers.toString(), 
          //   icon: Users, 
          //   change: '+0%' // TODO: Calculate month-over-month change
          // },
        ])
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        toast.error('Failed to load transaction data')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [isConnected])

  return (
    <div className="space-y-6">
      {/* Xion Wallet Connection - Show only this when not connected */}
      {!isConnected ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            <Card className="p-8 border-dashed border-2 border-aurora-blue-400">
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 p-4 rounded-full">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-white mb-2">Connect Your Xion Wallet</h3>
                  <p className="text-gray-400 mb-4">
                    To access your vendor dashboard and enable crypto payments, please connect your Xion wallet.
                  </p>
                </div>
                <XionConnectButton />
              </div>
            </Card>
          </motion.div>
        </div>
      ) : (
        /* Show dashboard content only when connected */
        <>
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {vendorProfile?.name}!</h2>
            <p className="text-gray-400">Here&apos;s what&apos;s happening with your business today.</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      {loading ? (
                        <div className="flex items-center mt-1">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                          <p className="text-xl font-bold text-gray-400">Loading...</p>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      )}
                      {/* <p className="text-aurora-blue-400 text-sm mt-1">{stat.change} from last month</p> */}
                    </div>
                    <div className="bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </motion.div>

          {/* Recent Transactions and Market Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
           
            
            {/* Market Trend Widget - Takes 1/3 of the space */}
            <div className="lg:col-span-1">
              <MarketTrendWidget />
            </div>

             {/* Recent Transactions - Takes 2/3 of the space */}
             <div className="lg:col-span-2 max-w-lg">
              <Card className="bg-gray-800/50 p-6 rounded-xl overflow-hidden h-full">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-aurora-blue-500 animate-spin" />
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 text-sm">
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.slice(0, 5).map((transaction, index) => (
                          <tr key={transaction._id || index} className="border-t border-gray-700/50">
                            <td className="py-3 text-white">
                              {new Date((transaction as any).createdAt || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-white">
                              {transaction.amount.toFixed(6)} XION
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                transaction.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                                transaction.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                                'bg-red-900/30 text-red-400'
                              }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="mt-4 text-center">
                      <Button 
                        variant="ghost" 
                        className="text-aurora-blue-400 hover:text-aurora-blue-300"
                        onClick={() => router.push('/vendor/transactions')}
                      >
                        View All Transactions
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No transactions yet</p>
                    <Button 
                      variant="outline" 
                      className="border-aurora-blue-500 text-aurora-blue-400 hover:bg-aurora-blue-500/10"
                      onClick={() => router.push('/vendor/qr')}
                    >
                      Create Payment QR
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

export default VendorPage
