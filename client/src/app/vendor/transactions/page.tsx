'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Search, Filter, Download, CheckCircle, Clock, XCircle, Loader2, X, ExternalLink, ChevronRight } from 'lucide-react'
import { paymentAPI, Transaction } from '@/lib/payment-api'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const TransactionsPage = () => {
  const [filter, setFilter] = useState('all')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await paymentAPI.getAllTransactions()
        setTransactions(data)
      } catch (err) {
        console.error('Failed to fetch transactions:', err)
        setError('Failed to load transactions. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  // Function to export transactions as CSV
  const exportTransactionsToCSV = (transactionsToExport: Transaction[]) => {
    if (transactionsToExport.length === 0) {
      alert('No transactions to export')
      return
    }

    // Define CSV headers
    const headers = ['Transaction ID', 'Description', 'Customer', 'Amount', 'Status', 'Time', 'Hash']
    
    // Map transactions to CSV rows
    const rows = transactionsToExport.map(tx => [
      tx._id,
      tx.description,
      tx.customer || 'N/A',
      tx.formattedAmount || `${tx.amount} XION`,
      tx.status,
      (() => {
        const date = new Date((tx as any).createdAt || (tx as any).updatedAt)
        return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString()
      })(),
      tx.transactionHash
    ])
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter and search transactions
  const filteredTransactions = transactions
    .filter(tx => {
      // Apply status filter
      if (filter !== 'all' && tx.status !== filter) {
        return false
      }
      
      // Apply search filter if search term exists
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          tx._id.toLowerCase().includes(searchLower) ||
          tx.description.toLowerCase().includes(searchLower) ||
          (tx.customer && tx.customer.toLowerCase().includes(searchLower)) ||
          (tx.transactionHash && tx.transactionHash.toLowerCase().includes(searchLower)) ||
          tx.amount.toString().toLowerCase().includes(searchLower)
        )
      }
      
      return true
    })

  // Mobile card component for transactions
  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:bg-gray-800/70 cursor-pointer transition-all"
      onClick={() => {
        setSelectedTransaction(transaction)
        setIsModalOpen(true)
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon(transaction.status)}
          <span className={`capitalize text-sm font-medium ${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-white text-sm font-medium truncate">{transaction.description}</p>
            <p className="text-gray-400 text-xs font-mono truncate">
              ID: {transaction._id.substring(0, 12)}...
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-aurora-blue-400 font-bold text-sm">
              {transaction.formattedAmount || `${transaction.amount}`}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>
            {(() => {
              const date = new Date((transaction as any).createdAt || (transaction as any).updatedAt)
              return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString()
            })()}
          </span>
          <span className="font-mono truncate ml-2 max-w-[100px]">
            {transaction.transactionHash ? 
              `${transaction.transactionHash.substring(0, 8)}...` : 
              'No hash'
            }
          </span>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="h-screen flex flex-col space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-0"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Transactions</h2>
        <p className="text-sm sm:text-base text-gray-400">View and manage your payment history</p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-0"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-3 sm:py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter Buttons and Export */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['all', 'completed', 'pending', 'failed'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize whitespace-nowrap flex-shrink-0 text-sm min-w-[80px] py-2"
              >
                {status}
              </Button>
            ))}
          </div>
          
          {/* Export Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportTransactionsToCSV(filteredTransactions)}
            className="text-sm whitespace-nowrap py-2"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 min-h-0 px-4 sm:px-0"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <XCircle className="w-10 h-10 text-red-500 mb-4" />
            <p className="text-gray-300 mb-2">Failed to load transactions</p>
            <p className="text-gray-400 text-sm max-w-md px-4">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setIsLoading(true)
                setError(null)
                paymentAPI.getAllTransactions()
                  .then((data: Transaction[]) => setTransactions(data))
                  .catch((err: any) => {
                    console.error('Failed to fetch transactions:', err)
                    setError('Failed to load transactions. Please try again later.')
                  })
                  .finally(() => setIsLoading(false))
              }}
            >
              Try Again
            </Button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="w-10 h-10 text-gray-500 mb-4" />
            <p className="text-gray-300 mb-2">No transactions found</p>
            <p className="text-gray-400 text-sm max-w-md px-4">
              {searchTerm ? 'Try adjusting your search or filters' : 'Transactions will appear here once payments are processed'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="block sm:hidden h-full">
              <div className="h-full overflow-y-auto space-y-3 pb-4">
                {filteredTransactions.map((transaction) => (
                  <TransactionCard key={transaction._id} transaction={transaction} />
                ))}
              </div>
            </div>

            {/* Desktop View - Table Layout */}
            <Card className="hidden sm:block overflow-hidden h-full flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="text-left p-4 text-gray-400 font-medium text-sm whitespace-nowrap">Transaction ID</th>
                      <th className="text-left p-4 text-gray-400 font-medium text-sm whitespace-nowrap">Description</th>
                      <th className="text-left p-4 text-gray-400 font-medium text-sm whitespace-nowrap">Amount</th>
                      <th className="text-left p-4 text-gray-400 font-medium text-sm whitespace-nowrap">Status</th>
                      <th className="text-left p-4 text-gray-400 font-medium text-sm whitespace-nowrap">Date</th>
                      <th className="text-left p-4 text-gray-400 font-medium text-sm whitespace-nowrap">Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr 
                        key={transaction._id}
                        className="border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedTransaction(transaction)
                          setIsModalOpen(true)
                        }}
                      >
                        <td className="p-4">
                          <span className="text-white font-mono text-sm">
                            {transaction._id.length > 8 ? `${transaction._id.substring(0, 8)}...` : transaction._id}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-white text-sm">
                            {transaction.description.length > 30 ? `${transaction.description.substring(0, 30)}...` : transaction.description}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-aurora-blue-400 font-bold text-sm whitespace-nowrap">
                            {transaction.amount}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(transaction.status)}
                            <span className={`capitalize text-sm whitespace-nowrap ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400 text-sm whitespace-nowrap">
                            {(() => {
                              const date = new Date((transaction as any).createdAt || (transaction as any).updatedAt)
                              return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString()
                            })()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400 font-mono text-sm">
                            {transaction.transactionHash ? 
                              (transaction.transactionHash.length > 12 ? 
                                `${transaction.transactionHash.substring(0, 12)}...` : 
                                transaction.transactionHash
                              ) : 'N/A'
                            }
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </motion.div>

      {/* Transaction Detail Modal */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-3xl mx-4 sm:mx-auto max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Transaction Details</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Complete information about this transaction
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {selectedTransaction && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <p className="text-xs sm:text-sm text-gray-400">Transaction ID</p>
                  <p className="text-white font-mono text-xs sm:text-sm break-all bg-gray-800 p-2 rounded">{selectedTransaction._id}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-400">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className={`capitalize text-sm sm:text-base ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-400">Amount</p>
                  <p className="text-aurora-blue-400 font-bold text-lg sm:text-xl">{selectedTransaction.formattedAmount || `${selectedTransaction.amount}`}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-400">Time</p>
                  <p className="text-white text-sm sm:text-base">
                    {(() => {
                      const date = new Date((selectedTransaction as any).createdAt || (selectedTransaction as any).updatedAt)
                      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString()
                    })()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-400">Product</p>
                  <p className="text-white text-sm sm:text-base break-words">
                    {typeof selectedTransaction.productId === 'object' && selectedTransaction.productId?.name 
                      ? `${selectedTransaction.productId.name}${selectedTransaction.productId.price ? ` (${selectedTransaction.productId.price})` : ''}` 
                      : (typeof selectedTransaction.productId === 'string' ? selectedTransaction.productId : 'N/A')
                    }
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-400">Customer</p>
                  <p className="text-white text-sm sm:text-base break-words">{selectedTransaction.customer || 'N/A'}</p>
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <p className="text-xs sm:text-sm text-gray-400">Description</p>
                  <p className="text-white text-sm sm:text-base break-words bg-gray-800 p-3 rounded">{selectedTransaction.description}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-3 sm:pt-4 border-t border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400">Transaction Hash</p>
                <div className="bg-gray-800 p-2 sm:p-3 rounded-md">
                  <p className="text-gray-300 font-mono text-xs sm:text-sm break-all">{selectedTransaction.transactionHash}</p>
                </div>
              </div>
              
              {selectedTransaction.transactionHash && (
                <div className="flex justify-center pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 text-sm w-full sm:w-auto"
                    onClick={() => window.open(`https://explorer.xion.app/tx/${selectedTransaction.transactionHash}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Xion Explorer
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <AlertDialogFooter className="pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TransactionsPage