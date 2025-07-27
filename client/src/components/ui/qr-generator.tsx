'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './button'
import { Card } from './card'
import { QrCode, Copy, Download, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'

interface QRGeneratorProps {
  onGenerate?: (data: { amount: string; description: string }) => void
  baseUrl?: string
}

export function QRGenerator({ onGenerate, baseUrl = 'https://xionxepay.vercel.app/pay' }: QRGeneratorProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrGenerated, setQrGenerated] = useState(false)
  const [paymentLink, setPaymentLink] = useState('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!amount || !description) return
    
    setIsGenerating(true)
    
    // Generate a unique session ID (in a real app, this would come from the backend)
    const sessionId = `session_${Math.random().toString(36).substring(2, 10)}`
    
    // Create payment link
    const link = `${baseUrl}/${sessionId}?amount=${amount}&description=${encodeURIComponent(description)}`
    setPaymentLink(link)
    
    // Generate QR code
    try {
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeDataUrl(qrDataUrl)
      setIsGenerating(false)
      setQrGenerated(true)
      onGenerate?.({ amount, description })
    } catch (error) {
      console.error('Error generating QR code:', error)
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setAmount('')
    setDescription('')
    setQrGenerated(false)
    setPaymentLink('')
    setQrCodeDataUrl(null)
  }

  const handleCopy = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink)
    }
  }

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;
    
    try {
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = qrCodeDataUrl;
      downloadLink.download = `xionxepay-qr-${new Date().getTime()}.png`;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Generate Payment QR</h2>
        {qrGenerated && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New QR
          </Button>
        )}
      </div>

      {!qrGenerated ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount (USDC)</label>
            <input
              type="number"
              placeholder="25.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <input
              type="text"
              placeholder="Coffee & Pastry"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
            />
          </div>
          <Button 
            variant="gradient" 
            className="w-full" 
            onClick={handleGenerate}
            disabled={!amount || !description || isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </>
            )}
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* QR Code Display */}
          <div className="bg-white rounded-2xl p-6 mb-6 mx-auto w-fit">
            <div className="w-48 h-48 flex items-center justify-center">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code"
                  width={192}
                  height={192}
                  className="rounded"
                />
              ) : (
                <div className="w-48 h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Payment Amount</p>
            <p className="text-2xl font-bold web3-gradient-text mb-2">
              ${amount} USDC
            </p>
            <p className="text-gray-300 text-sm">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-aurora-blue-500/10 border border-aurora-blue-500/20 rounded-lg">
            <p className="text-aurora-blue-300 text-sm">
              Show this QR code to your customer or share the payment link
            </p>
          </div>
        </motion.div>
      )}
    </Card>
  )
}
