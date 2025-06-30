'use client'

import React from 'react'
import { QRGenerator } from '@/components/ui/qr-generator'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { QrCode, History, Download } from 'lucide-react'

const QRPage = () => {
  const recentQRs = [
    { id: '1', amount: '$25.00', description: 'Coffee & Pastry', created: '2 hours ago' },
    { id: '2', amount: '$15.50', description: 'Sandwich', created: '4 hours ago' },
    { id: '3', amount: '$8.75', description: 'Tea', created: '1 day ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">QR Code Generator</h2>
        <p className="text-gray-400">Create payment QR codes for your customers</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Generator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <QRGenerator onGenerate={(data) => console.log('QR Generated:', data)} />
        </motion.div>

        {/* Recent QR Codes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-5 h-5 text-aurora-blue-400" />
              <h3 className="text-xl font-bold text-white">Recent QR Codes</h3>
            </div>
            <div className="space-y-4">
              {recentQRs.map((qr) => (
                <div key={qr.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-lg flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{qr.description}</p>
                      <p className="text-gray-400 text-sm">{qr.created}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-aurora-blue-400 font-bold">{qr.amount}</span>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default QRPage
