'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function StatsSection() {
  const stats = [
    {
      number: '10K+',
      label: 'Active Vendors',
      description: 'Businesses using XionxePay worldwide'
    },
    {
      number: '$2M+',
      label: 'Processed Volume',
      description: 'Total payments processed this month'
    },
    {
      number: '99.9%',
      label: 'Uptime',
      description: 'Reliable service you can count on'
    },
    {
      number: '<1s',
      label: 'Payment Speed',
      description: 'Average transaction confirmation time'
    }
  ]

  return (
    <section className="py-24 pb-32 md:pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-aurora-blue-500/5 to-aurora-cyan-500/5 rounded-3xl" />
        
        <div className="relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Trusted by</span>
              <br />
              <span className="web3-gradient-text">Thousands</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join a growing community of vendors who have chosen XionxePay 
              for their payment needs.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-aurora-blue-500/50 transition-all duration-300 group-hover:scale-105">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold web3-gradient-text mb-2 text-glow"
                  >
                    {stat.number}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-gray-400 mb-8">Powered by industry-leading technology</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-full" />
                <span className="text-lg font-semibold text-gray-300">Xion Protocol</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-aurora-cyan-500 to-aurora-teal-500 rounded-full" />
                <span className="text-lg font-semibold text-gray-300">USDC</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-aurora-teal-500 to-aurora-blue-500 rounded-full" />
                <span className="text-lg font-semibold text-gray-300">USDT</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
