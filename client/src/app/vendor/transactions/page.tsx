'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Search, Filter, Download, CheckCircle, Clock, XCircle, Loader2, X, ExternalLink } from 'lucide-react'
import { transactionsAPI, Transaction } from '@/lib/payment-api'
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
        const data = await transactionsAPI.getAllTransactions()
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
      tx.id,
      tx.description,
      tx.customer,
      tx.amount,
      tx.status,
      tx.time,
      tx.hash
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
          tx.id.toLowerCase().includes(searchLower) ||
          tx.description.toLowerCase().includes(searchLower) ||
          tx.customer.toLowerCase().includes(searchLower) ||
          tx.hash.toLowerCase().includes(searchLower) ||
          tx.amount.toLowerCase().includes(searchLower)
        )
      }
      
      return true
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Transactions</h2>
        <p className="text-gray-400">View and manage your payment history</p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'completed', 'pending', 'failed'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => exportTransactionsToCSV(filteredTransactions)}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <XCircle className="w-10 h-10 text-red-500 mb-4" />
              <p className="text-gray-300 mb-2">Failed to load transactions</p>
              <p className="text-gray-400 text-sm max-w-md">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setIsLoading(true)
                  setError(null)
                  transactionsAPI.getAllTransactions()
                    .then(data => setTransactions(data))
                    .catch(err => {
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
              <p className="text-gray-400 text-sm max-w-md">
                {searchTerm ? 'Try adjusting your search or filters' : 'Transactions will appear here once payments are processed'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Transaction ID</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Description</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Time</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors cursor-pointer" 
                      onClick={() => {
                        setSelectedTransaction(transaction)
                        setIsModalOpen(true)
                      }}
                    >
                      <td className="p-4">
                        <span className="text-white font-mono text-sm">{transaction.id}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white">{transaction.description}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">{transaction.customer}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-aurora-blue-400 font-bold">{transaction.amount}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`capitalize ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-400 text-sm">{transaction.time}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-400 font-mono text-sm truncate max-w-[120px] inline-block">{transaction.hash}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
      {/* Transaction Detail Modal */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Transaction Details</AlertDialogTitle>
            <AlertDialogDescription>
              Complete information about this transaction
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {selectedTransaction && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Transaction ID</p>
                  <p className="text-white font-mono break-all">{selectedTransaction.id}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className={`capitalize ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-aurora-blue-400 font-bold text-xl">{selectedTransaction.amount}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="text-white">{selectedTransaction.time}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="text-white">{selectedTransaction.customer}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-white">{selectedTransaction.description}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">Transaction Hash</p>
                <div className="bg-gray-800 p-3 rounded-md">
                  <p className="text-gray-300 font-mono text-sm break-all">{selectedTransaction.hash}</p>
                </div>
              </div>
              
              {selectedTransaction.hash && (
                <div className="flex justify-center pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open(`https://explorer.xion.app/tx/${selectedTransaction.hash}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Xion Explorer
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TransactionsPage
