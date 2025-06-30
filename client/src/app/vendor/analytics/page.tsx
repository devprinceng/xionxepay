'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, Calendar } from 'lucide-react'

const AnalyticsPage = () => {
  const stats = [
    { label: 'Total Revenue', value: '$12,450.00', change: '+12.5%', trend: 'up', icon: DollarSign },
    { label: 'Transactions', value: '1,234', change: '+8.2%', trend: 'up', icon: CreditCard },
    { label: 'Customers', value: '456', change: '+15.3%', trend: 'up', icon: Users },
    { label: 'Avg. Transaction', value: '$28.50', change: '-2.1%', trend: 'down', icon: TrendingUp },
  ]

  const revenueData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1398 },
    { month: 'Mar', amount: 9800 },
    { month: 'Apr', amount: 3908 },
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 3800 },
  ]

  const topProducts = [
    { name: 'Coffee & Pastry', sales: 156, revenue: '$3,900.00' },
    { name: 'Sandwich Combo', sales: 89, revenue: '$2,225.00' },
    { name: 'Tea & Cookies', sales: 67, revenue: '$1,675.00' },
    { name: 'Lunch Special', sales: 45, revenue: '$1,440.00' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Analytics</h2>
        <p className="text-gray-400">Track your business performance and insights</p>
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
                <div className="bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="w-5 h-5 text-aurora-blue-400" />
              <h3 className="text-xl font-bold text-white">Revenue Trend</h3>
            </div>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm w-12">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.amount / 10000) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-white font-medium w-20 text-right">
                    ${data.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-aurora-blue-400" />
              <h3 className="text-xl font-bold text-white">Top Products</h3>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-aurora-blue-400 font-bold">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Time Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Today</p>
              <p className="text-2xl font-bold text-white">$245.00</p>
              <p className="text-green-400 text-sm">+5.2%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-white">$1,680.00</p>
              <p className="text-green-400 text-sm">+12.8%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">This Month</p>
              <p className="text-2xl font-bold text-white">$6,420.00</p>
              <p className="text-green-400 text-sm">+18.3%</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AnalyticsPage
