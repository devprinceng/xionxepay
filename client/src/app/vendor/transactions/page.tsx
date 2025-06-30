'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Search, Filter, Download, CheckCircle, Clock, XCircle } from 'lucide-react'

const TransactionsPage = () => {
  const [filter, setFilter] = useState('all')

  const transactions = [
    { id: 'TXN001', amount: '$25.00', description: 'Coffee & Pastry', customer: 'John D.', time: '2 min ago', status: 'completed', hash: '0x1234...5678' },
    { id: 'TXN002', amount: '$15.50', description: 'Sandwich', customer: 'Sarah M.', time: '15 min ago', status: 'completed', hash: '0x2345...6789' },
    { id: 'TXN003', amount: '$8.75', description: 'Tea', customer: 'Mike R.', time: '1 hour ago', status: 'pending', hash: '0x3456...7890' },
    { id: 'TXN004', amount: '$32.00', description: 'Lunch Combo', customer: 'Emma L.', time: '2 hours ago', status: 'completed', hash: '0x4567...8901' },
    { id: 'TXN005', amount: '$12.25', description: 'Coffee', customer: 'Alex K.', time: '3 hours ago', status: 'failed', hash: '0x5678...9012' },
  ]

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

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.status === filter)

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
        <Button variant="outline" size="sm">
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
                  <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
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
                      <span className="text-gray-400 font-mono text-sm">{transaction.hash}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default TransactionsPage
