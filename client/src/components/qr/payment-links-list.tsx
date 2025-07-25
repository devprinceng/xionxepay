'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { History, Copy, Download, QrCode, CheckCircle, XCircle, Clock, Loader2, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { QRModal } from '@/components/ui/qr-modal'
import { CountdownTimer } from '@/components/ui/countdown-timer'
import type { PaymentLinkData } from '@/types/payment'

interface PaymentLinksListProps {
  paymentLinks: PaymentLinkData[]
  onCopyLink: (link: string) => void
  onDownloadQR: (paymentLinkId: string) => void
  onClearAll: () => void
  onRefreshStatus?: () => void
  getProductName: (productId: string) => string
}

export function PaymentLinksList({
  paymentLinks,
  onCopyLink,
  onDownloadQR,
  onClearAll,
  onRefreshStatus,
  getProductName
}: PaymentLinksListProps) {
  const [selectedQR, setSelectedQR] = useState<PaymentLinkData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getStatusIcon = (status: PaymentLinkData['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'expired':
        return <Clock className="w-4 h-4 text-orange-400" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: PaymentLinkData['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'processing':
        return 'text-blue-400'
      case 'failed':
        return 'text-red-400'
      case 'expired':
        return 'text-orange-400'
      default:
        return 'text-yellow-400'
    }
  }

  const handleQRClick = (link: PaymentLinkData) => {
    setSelectedQR(link)
  }

  const handleCloseQRModal = () => {
    setSelectedQR(null)
  }

  const handleRefreshStatus = async () => {
    if (!onRefreshStatus) return

    setIsRefreshing(true)
    try {
      await onRefreshStatus()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="h-full"
      >
        <Card className="p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium">Recent Payment Links</h3>
            </div>
            <div className="flex space-x-2">
              {onRefreshStatus && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshStatus}
                  disabled={isRefreshing || paymentLinks.length === 0}
                  className="text-gray-400 hover:text-white"
                  title="Refresh payment status"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                disabled={paymentLinks.length === 0}
                className="text-gray-400 hover:text-white"
              >
                Clear All
              </Button>
            </div>
          </div>
          
          {paymentLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <QrCode className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-400 mb-4">No payment links generated yet</p>
              <p className="text-sm text-gray-500 max-w-xs">
                Generate your first payment link and it will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 -mr-2">
              {paymentLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors group"
                >
                  {/* QR Code Display */}
                  <div className="flex-shrink-0">
                    {link.qrCodeData ? (
                      <button
                        onClick={() => handleQRClick(link)}
                        className="relative group/qr"
                      >
                        <Image 
                          src={link.qrCodeData} 
                          alt="Payment QR Code" 
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded border border-gray-600 transition-transform group-hover/qr:scale-105"
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <QrCode className="w-6 h-6 text-white" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-20 h-20 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-white">{link.amount} XION</p>
                      {getStatusIcon(link.status)}
                      <span className={`text-xs ${getStatusColor(link.status)}`}>
                        {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {link.productName || getProductName(link.productId)}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {new Date(link.created).toLocaleString()}
                      </p>
                      {/* Countdown Timer */}
                      <CountdownTimer
                        expiresAt={link.expiresAt || new Date(new Date(link.created).getTime() + 10 * 60 * 1000)} // Use API expiresAt or fallback to 10 minutes
                        status={link.status}
                        className="ml-2"
                        showIcon={true}
                      />
                    </div>
                    {link.transactionId && (
                      <p className="text-xs text-blue-400 truncate mt-1">
                        TX: {link.transactionId}
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQRClick(link)}
                        className="p-2 h-8 w-8 hover:bg-gray-700"
                        title="View QR code"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopyLink(link.link)}
                        className="p-2 h-8 w-8 hover:bg-gray-700"
                        title="Copy payment link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadQR(link.id)}
                        className="p-2 h-8 w-8 hover:bg-gray-700"
                        title="Download QR code"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* QR Modal */}
      {selectedQR && (
        <QRModal
          isOpen={!!selectedQR}
          onClose={handleCloseQRModal}
          qrCodeData={selectedQR.qrCodeData}
          paymentLink={selectedQR.link}
          amount={selectedQR.amount}
          productName={selectedQR.productName || getProductName(selectedQR.productId)}
          description={selectedQR.description}
          status={selectedQR.status}
          onCopyLink={() => onCopyLink(selectedQR.link)}
          onDownloadQR={() => onDownloadQR(selectedQR.id)}
        />
      )}
    </>
  )
}
