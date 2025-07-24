'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, ExternalLink, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { toast } from 'sonner'

export interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  qrCodeData: string
  paymentLink: string
  amount: string
  productName: string
  description?: string
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  onCopyLink?: () => void
  onDownloadQR?: () => void
}

export function QRModal({
  isOpen,
  onClose,
  qrCodeData,
  paymentLink,
  amount,
  productName,
  description,
  status = 'pending',
  onCopyLink,
  onDownloadQR
}: QRModalProps) {
  const [copied, setCopied] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Reset copied state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCopied(false)
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      toast.success('Payment link copied to clipboard!')
      onCopyLink?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleDownloadQR = () => {
    if (!qrCodeData) return
    
    const link = document.createElement('a')
    link.href = qrCodeData
    link.download = `payment-qr-${productName.replace(/\s+/g, '-').toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR code downloaded!')
    onDownloadQR?.()
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      case 'failed':
        return <X className="w-5 h-5 text-red-400" />
      case 'expired':
        return <Clock className="w-5 h-5 text-orange-400" />
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Payment Completed'
      case 'processing':
        return 'Processing Payment...'
      case 'failed':
        return 'Payment Failed'
      case 'expired':
        return 'Payment Expired'
      default:
        return 'Awaiting Payment'
    }
  }

  const getStatusColor = () => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-6 bg-gray-900 border-gray-700 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <h2 className={`text-lg font-semibold ${getStatusColor()}`}>
                    {getStatusText()}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4 mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
                  className="relative"
                >
                  <div className="relative p-4 bg-white rounded-xl shadow-lg">
                    <Image
                      src={qrCodeData}
                      alt="Payment QR Code"
                      width={200}
                      height={200}
                      className="w-48 h-48"
                      unoptimized={true}
                    />

                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-500"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-500"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blue-500"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blue-500"></div>
                  </div>

                  {/* Animated border */}
                  {isAnimating && (
                    <motion.div
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 1.1, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-blue-400 rounded-xl"
                    />
                  )}

                  {/* Scanning animation */}
                  {status === 'pending' && (
                    <motion.div
                      initial={{ y: -200 }}
                      animate={{ y: 200 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"
                    />
                  )}
                </motion.div>

                {/* Payment Details */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center space-y-2"
                >
                  <h3 className="text-xl font-bold text-white">{amount} XION</h3>
                  <p className="text-gray-300 font-medium">{productName}</p>
                  {description && (
                    <p className="text-sm text-gray-400">{description}</p>
                  )}
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="flex items-center space-x-2"
                    disabled={copied}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleDownloadQR}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => window.open(paymentLink, '_blank')}
                  className="w-full flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Payment Page</span>
                </Button>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <p className="text-xs text-gray-400 text-center">
                  Scan the QR code with your Xion wallet or share the payment link with your customer
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
