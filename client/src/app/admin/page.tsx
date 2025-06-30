'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Users, 
  Building, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react'

const AdminDashboard = () => {
  const stats = [
    { 
      label: 'Total Vendors', 
      value: '1,234', 
      change: '+12.5%', 
      trend: 'up', 
      icon: Building,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Total Users', 
      value: '45,678', 
      change: '+8.2%', 
      trend: 'up', 
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Total Revenue', 
      value: '$2.4M', 
      change: '+15.3%', 
      trend: 'up', 
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Transactions', 
      value: '89,432', 
      change: '-2.1%', 
      trend: 'down', 
      icon: CreditCard,
      color: 'from-orange-500 to-red-500'
    },
  ]

  const recentVendors = [
    { id: '1', name: 'Coffee Corner', email: 'owner@coffeecorner.com', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Pizza Palace', email: 'admin@pizzapalace.com', status: 'pending', joinDate: '2024-01-14' },
    { id: '3', name: 'Book Store', email: 'info@bookstore.com', status: 'active', joinDate: '2024-01-13' },
    { id: '4', name: 'Tech Repair', email: 'contact@techrepair.com', status: 'suspended', joinDate: '2024-01-12' },
  ]

  const recentTransactions = [
    { id: 'TXN001', vendor: 'Coffee Corner', amount: '$25.00', status: 'completed', time: '2 min ago' },
    { id: 'TXN002', vendor: 'Pizza Palace', amount: '$45.50', status: 'pending', time: '15 min ago' },
    { id: 'TXN003', vendor: 'Book Store', amount: '$18.75', status: 'completed', time: '1 hour ago' },
    { id: 'TXN004', vendor: 'Tech Repair', amount: '$120.00', status: 'failed', time: '2 hours ago' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'failed':
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'failed':
      case 'suspended':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-gray-400">Monitor and manage the XionxePay platform</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendIcon className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Vendors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Vendors</h3>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentVendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{vendor.name}</p>
                      <p className="text-gray-400 text-sm">{vendor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(vendor.status)}
                    <span className={`capitalize text-sm ${getStatusColor(vendor.status)}`}>
                      {vendor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{transaction.vendor}</p>
                    <p className="text-gray-400 text-sm">{transaction.id} • {transaction.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-aurora-blue-400 font-bold">{transaction.amount}</p>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span className={`capitalize text-sm ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-medium">API Status</p>
              <p className="text-green-400 text-sm">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-medium">Database</p>
              <p className="text-green-400 text-sm">Healthy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-white font-medium">Payment Gateway</p>
              <p className="text-yellow-400 text-sm">Slow Response</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
