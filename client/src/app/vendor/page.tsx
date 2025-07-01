'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QRGenerator } from '@/components/ui/qr-generator'
import { DollarSign, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const VendorPage = () => {
  const stats = [
    { label: 'Total Sales', value: '$2,450.00', icon: DollarSign, change: '+12%' },
    { label: 'Transactions', value: '156', icon: TrendingUp, change: '+8%' },
    { label: 'Customers', value: '89', icon: Users, change: '+15%' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back, John!</h2>
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
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-aurora-blue-400 text-sm mt-1">{stat.change} from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            )
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Generator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <QRGenerator onGenerate={(data) => console.log('QR Generated:', data)} />
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
              <div className="space-y-4">
                {[
                  { id: '1', amount: '$25.00', description: 'Coffee & Pastry', time: '2 min ago', status: 'completed' },
                  { id: '2', amount: '$15.50', description: 'Sandwich', time: '15 min ago', status: 'completed' },
                  { id: '3', amount: '$8.75', description: 'Tea', time: '1 hour ago', status: 'completed' },
                ].map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">{transaction.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-aurora-blue-400 font-bold">{transaction.amount}</p>
                      <p className="text-green-400 text-sm capitalize">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </Card>
          </motion.div>
        </div>
    </div>
  )
}

export default VendorPage
