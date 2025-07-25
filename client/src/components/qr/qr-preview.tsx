'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Loader2 } from 'lucide-react'
import Image from 'next/image'
import QRCode from 'qrcode'

interface QRPreviewProps {
  amount: string
  description: string
  userXionAddress: string | null
  onShowAddressForm: () => void
}

export function QRPreview({
  amount,
  description,
  userXionAddress,
  onShowAddressForm
}: QRPreviewProps) {
  const [previewQRCode, setPreviewQRCode] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  // Generate real-time QR code preview
  const generatePreviewQRCode = useCallback(async (amount: string, description: string) => {
    if (!amount || !description || !userXionAddress) {
      setPreviewQRCode(null)
      return
    }

    setIsGeneratingPreview(true)
    try {
      // Create a temporary session ID for preview
      const previewSessionId = `preview_${Date.now()}`
      const paymentUrl = `${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || 'http://localhost:3000'}/pay/${previewSessionId}?amount=${encodeURIComponent(amount)}&description=${encodeURIComponent(description)}&recipient=${encodeURIComponent(userXionAddress)}`

      const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      setPreviewQRCode(qrCodeDataUrl)
    } catch (error) {
      console.error('Error generating preview QR code:', error)
      setPreviewQRCode(null)
    } finally {
      setIsGeneratingPreview(false)
    }
  }, [userXionAddress])

  // Update preview QR code when values change
  useEffect(() => {
    if (amount && description) {
      const debounceTimer = setTimeout(() => {
        generatePreviewQRCode(amount, description)
      }, 500) // Debounce for 500ms

      return () => clearTimeout(debounceTimer)
    } else {
      setPreviewQRCode(null)
    }
  }, [amount, description, userXionAddress, generatePreviewQRCode])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-300">Live Preview</h4>
        {!userXionAddress && (
          <button
            onClick={onShowAddressForm}
            className="text-xs text-amber-400 hover:text-amber-300 underline"
          >
            Set Xion address to generate QR
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-center">
        {isGeneratingPreview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-2"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <span className="text-xs text-gray-400">Generating preview...</span>
          </motion.div>
        ) : previewQRCode ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="relative">
              <Image 
                src={previewQRCode} 
                alt="QR Code Preview" 
                width={150}
                height={150}
                className="rounded border border-gray-600"
                unoptimized={true}
              />
              
              {/* Animated pulse border */}
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.05, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-blue-400 rounded"
              />
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">{amount} XION</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">{description}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-2 text-gray-500"
          >
            <QrCode className="w-12 h-12" />
            <span className="text-xs text-center">
              {!userXionAddress ? 'Set Xion address first' : 'Enter amount and description'}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
