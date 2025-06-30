'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  RefreshCw,
  DollarSign,
  Calendar,
  Building
} from 'lucide-react'

interface Transaction {
  id: string
  vendorId: string
  vendorName: string
  amount: number
  currency: string
  description: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  timestamp: string
  hash: string
  customerEmail?: string
  paymentMethod: string
  fees: number
}

const AdminTransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Mock transactions data
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      vendorId: '1',
      vendorName: 'Coffee Corner',
      amount: 25.00,
      currency: 'USDC',
      description: 'Coffee & Pastry',
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      hash: '0x1234567890abcdef',
      customerEmail: 'customer@example.com',
      paymentMethod: 'QR Code',
      fees: 0.75
    },
    {
      id: 'TXN002',
      vendorId: '2',
      vendorName: 'Pizza Palace',
      amount: 45.50,
      currency: 'USDC',
      description: 'Large Pizza',
      status: 'pending',
      timestamp: '2024-01-15T09:15:00Z',
      hash: '0x2345678901bcdefg',
      paymentMethod: 'QR Code',
      fees: 1.37
    },
    {
      id: 'TXN003',
      vendorId: '3',
      vendorName: 'Book Store',
      amount: 18.75,
      currency: 'USDT',
      description: 'Novel Book',
      status: 'completed',
      timestamp: '2024-01-15T08:45:00Z',
      hash: '0x3456789012cdefgh',
      customerEmail: 'reader@example.com',
      paymentMethod: 'QR Code',
      fees: 0.56
    },
    {
      id: 'TXN004',
      vendorId: '4',
      vendorName: 'Tech Repair',
      amount: 120.00,
      currency: 'USDC',
      description: 'Phone Screen Repair',
      status: 'failed',
      timestamp: '2024-01-15T07:20:00Z',
      hash: '0x456789013defghi',
      paymentMethod: 'QR Code',
      fees: 0.00
    },
    {
      id: 'TXN005',
      vendorId: '1',
      vendorName: 'Coffee Corner',
      amount: 12.25,
      currency: 'USDC',
      description: 'Latte',
      status: 'refunded',
      timestamp: '2024-01-14T16:10:00Z',
      hash: '0x56789014efghijk',
      customerEmail: 'customer2@example.com',
      paymentMethod: 'QR Code',
      fees: -0.37
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'refunded':
        return <RefreshCw className="w-4 h-4 text-blue-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'refunded':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const totalFees = transactions.reduce((sum, tx) => sum + tx.fees, 0)
  const completedTransactions = transactions.filter(tx => tx.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Transaction Management</h2>
          <p className="text-gray-400">Monitor all platform transactions and payments</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Volume</p>
              <p className="text-2xl font-bold text-white">${totalVolume.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{completedTransactions}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Fees</p>
              <p className="text-2xl font-bold text-white">${totalFees.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Transaction ID</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Vendor</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Description</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <span className="text-white font-mono text-sm">{transaction.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Building className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white">{transaction.vendorName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-bold">${transaction.amount.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">{transaction.currency}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{transaction.description}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400 text-sm">{formatDate(transaction.timestamp)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Transaction Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)}>
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Transaction Info</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">ID:</span> <span className="text-white font-mono">{selectedTransaction.id}</span></p>
                  <p><span className="text-gray-400">Amount:</span> <span className="text-white">${selectedTransaction.amount.toFixed(2)} {selectedTransaction.currency}</span></p>
                  <p><span className="text-gray-400">Fees:</span> <span className="text-white">${selectedTransaction.fees.toFixed(2)}</span></p>
                  <p><span className="text-gray-400">Description:</span> <span className="text-white">{selectedTransaction.description}</span></p>
                  <p><span className="text-gray-400">Status:</span> <span className={`capitalize ${getStatusColor(selectedTransaction.status).split(' ')[0]}`}>{selectedTransaction.status}</span></p>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Vendor & Customer</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Vendor:</span> <span className="text-white">{selectedTransaction.vendorName}</span></p>
                  <p><span className="text-gray-400">Vendor ID:</span> <span className="text-white">{selectedTransaction.vendorId}</span></p>
                  <p><span className="text-gray-400">Customer:</span> <span className="text-white">{selectedTransaction.customerEmail || 'Anonymous'}</span></p>
                  <p><span className="text-gray-400">Payment Method:</span> <span className="text-white">{selectedTransaction.paymentMethod}</span></p>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-white font-medium mb-3">Blockchain Info</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Hash:</span> <span className="text-white font-mono break-all">{selectedTransaction.hash}</span></p>
                  <p><span className="text-gray-400">Timestamp:</span> <span className="text-white">{formatDate(selectedTransaction.timestamp)}</span></p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="gradient">View on Explorer</Button>
              <Button variant="outline">Download Receipt</Button>
              {selectedTransaction.status === 'completed' && (
                <Button variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/20">
                  Process Refund
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminTransactionsPage
