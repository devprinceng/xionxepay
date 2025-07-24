'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Download, CheckCircle, Copy, ExternalLink, Calendar, Hash, Wallet, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export interface EnhancedReceiptProps {
  transactionHash: string
  amount: string
  productName: string
  sessionId: string
  timestamp: string
  recipientAddress: string
  onDownload: () => void
  className?: string
  vendorName?: string
}

export function EnhancedReceipt({
  transactionHash,
  amount,
  productName,
  sessionId,
  timestamp,
  recipientAddress,
  onDownload,
  className,
  vendorName
}: EnhancedReceiptProps) {
  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(transactionHash)
      toast.success('Transaction hash copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy transaction hash')
    }
  }

  const handleViewOnExplorer = () => {
    // Open transaction on Xion explorer (adjust URL as needed)
    const explorerUrl = `https://explorer.xion.burnt.com/tx/${transactionHash}`
    window.open(explorerUrl, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  const truncateAddress = (address: string) => {
    if (address.length <= 16) return address
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`w-full max-w-md mx-auto ${className || ''}`}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        {/* Header with success animation */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
            >
              <CheckCircle className="w-8 h-8" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              Payment Successful!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-green-100"
            >
              Your transaction has been confirmed on the blockchain
            </motion.p>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="p-6 space-y-6">
          {/* Amount Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-green-200 dark:border-green-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount Paid</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{amount} XION</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">for {productName}</p>
          </motion.div>

          {/* Transaction Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Transaction Details
            </h3>
            
            <div className="space-y-3">
              {/* Transaction Hash */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Transaction Hash</p>
                    <p className="text-sm font-mono text-gray-800 dark:text-gray-200 truncate">
                      {truncateAddress(transactionHash)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyHash}
                    className="h-8 w-8 p-0"
                    title="Copy transaction hash"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewOnExplorer}
                    className="h-8 w-8 p-0"
                    title="View on explorer"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Transaction Time</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{formatDate(timestamp)}</p>
                </div>
              </div>

              {/* Recipient */}
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Wallet className="w-4 h-4 text-gray-500 mr-2" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Recipient Address</p>
                  <p className="text-sm font-mono text-gray-800 dark:text-gray-200 truncate">
                    {truncateAddress(recipientAddress)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                <Download className="w-5 h-5" />
                <h4 className="font-semibold">Download Your Receipt</h4>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300"> Get your transaction receipt for future reference.
              </p>
              <Button
                onClick={onDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt (PNG)
              </Button>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                The receipt includes all transaction details and is blockchain-verified
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by <span className="font-semibold text-green-600 dark:text-green-400">
                {vendorName || 'XionxePay'}
              </span> • Secured by Xion Blockchain
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Session ID: {sessionId}
            </p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
