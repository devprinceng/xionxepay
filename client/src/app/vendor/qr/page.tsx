'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { QrCode, History, Download, Loader2, Plus, Copy, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useProducts } from '@/contexts/ProductContext'
import { useXion } from '@/contexts/PaymentQRContext'
import { PaymentLink } from '@/contexts/PaymentQRContext'
import { toast } from 'sonner'
import QRCode from 'qrcode'

const QRPage = () => {
  const { products, loading: productsLoading, fetchProducts } = useProducts()
  const { 
    paymentLinks, 
    isGenerating, 
    generatePaymentLink, 
    clearPaymentLinks, 
    copyPaymentLink, 
    downloadQRCode,
    deletePaymentLink,
    updatePaymentLinkStatus,
    userXionAddress,
    setUserXionAddress
  } = useXion()
  const [selectedProduct, setSelectedProduct] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [description, setDescription] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [xionAddressInput, setXionAddressInput] = useState('')
  
  // Real-time QR code preview
  const [previewQRCode, setPreviewQRCode] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  useEffect(() => {
    // Load products on component mount
    if (products.length === 0 && !productsLoading) {
      fetchProducts()
    }
  }, [products, productsLoading, fetchProducts])

  // Generate real-time QR code preview
  const generatePreviewQRCode = async (amount: string, description: string) => {
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
  }

  // Update preview QR code when custom form values change
  useEffect(() => {
    if (showCustomForm && customAmount && description) {
      const debounceTimer = setTimeout(() => {
        generatePreviewQRCode(customAmount, description)
      }, 500) // Debounce for 500ms
      
      return () => clearTimeout(debounceTimer)
    } else {
      setPreviewQRCode(null)
    }
  }, [showCustomForm, customAmount, description, userXionAddress])



  useEffect(() => {
    const handlePaymentCompleted = (event: CustomEvent) => {
      const { transactionHash, txId } = event.detail
      console.log('Payment completed event received:', { transactionHash, txId })
      
      // Find the payment link with this txId and update its status
      const paymentLink = paymentLinks.find(link => {
        // Extract txId from the payment link URL
        try {
          const url = new URL(link.link)
          
          // Check if txId is in the path (new format: /pay/{txId})
          const pathSegments = url.pathname.split('/')
          const lastSegment = pathSegments[pathSegments.length - 1]
          
          // Also check if it's in query params (old format) as a fallback
          const queryTxId = url.searchParams.get('txId')
          
          // Match either path or query parameter
          return lastSegment === txId || queryTxId === txId || link.transactionId === txId
        } catch (error) {
          console.error('Invalid URL in payment link:', error)
          return false
        }
      })
      
      if (paymentLink) {
        console.log('Found matching payment link, updating status:', paymentLink)
        updatePaymentLinkStatus(paymentLink.id, 'completed', transactionHash)
      } else {
        console.log('Payment completed but no matching payment link found for txId:', txId)
      }
    }
    
    // Add event listener
    window.addEventListener('xion_payment_completed', handlePaymentCompleted as EventListener)
    
    // Clean up
    return () => {
      window.removeEventListener('xion_payment_completed', handlePaymentCompleted as EventListener)
    }
  }, [paymentLinks, updatePaymentLinkStatus])

  const handleGeneratePaymentLink = async (productId: string, amount: string, description: string) => {
    const product = products.find(p => p._id === productId)
    const productName = product ? product.name : 'Custom Payment'
    
    await generatePaymentLink(productId, productName, amount, description)
    
    // Reset form
    setSelectedProduct('')
    setCustomAmount('')
    setDescription('')
    setShowCustomForm(false)
  }
  
  // No longer needed - real payments will be handled by Xion payment gateway

  // Get product name by ID for display in recent payments
  const getProductName = (productId: string) => {
    if (productId === 'custom') return 'Custom Payment'
    const product = products.find(p => p._id === productId)
    return product ? product.name : 'Product'
  }

  // Handle setting the Xion address
  const handleSetXionAddress = () => {
    const trimmedAddress = xionAddressInput.trim()
    if (trimmedAddress) {
      if (!trimmedAddress.startsWith('xion')) {
        toast.error('Invalid Xion address format. Address should start with "xion"')
        return
      }
      
      setUserXionAddress(trimmedAddress)
      setShowAddressForm(false)
      setXionAddressInput('')
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
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-white">QR Code Generator</h2>
        </div>
        <p className="text-gray-400">Create payment QR codes for your customers</p>
      </motion.div>
      
      {/* Xion Address Form */}
      {showAddressForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 mb-6 border border-blue-500/30">
            <h3 className="text-lg font-medium mb-4">Set Your Xion Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Xion Wallet Address</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                  placeholder="xion..."
                  value={xionAddressInput}
                  onChange={(e) => setXionAddressInput(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">This address will be used as the recipient for all payment links</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowAddressForm(false)
                    setXionAddressInput('')
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSetXionAddress}
                  disabled={!xionAddressInput.trim()}
                >
                  Save Address
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Generator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Generate Payment Link</h3>
            
            {!showCustomForm ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Select a Product</label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    disabled={isGenerating || productsLoading}
                  >
                    <option value="">Select a product</option>
                    {products.slice().reverse().map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ${product.price}
                      </option>
                    ))}
                  </select>
                </div>

                <Button 
                  onClick={() => {
                    const product = products.find(p => p._id === selectedProduct)
                    if (product) {
                      handleGeneratePaymentLink(product._id, product.price.toString(), product.name)
                    } else {
                      setShowCustomForm(true)
                    }
                  }}
                  disabled={!selectedProduct || isGenerating || productsLoading}
                  className="w-full"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <QrCode className="w-4 h-4 mr-2" />
                  )}
                  Generate QR Code
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">OR</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowCustomForm(true)}
                  disabled={isGenerating || productsLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom Payment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Amount (XION)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="What's this payment for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>

                {/* Real-time QR Code Preview */}
                {(customAmount || description) && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-300">Live Preview</h4>
                      {!userXionAddress && (
                        <span className="text-xs text-amber-400">Set Xion address to generate QR</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center">
                      {isGeneratingPreview ? (
                        <div className="flex flex-col items-center space-y-2">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                          <span className="text-xs text-gray-400">Generating preview...</span>
                        </div>
                      ) : previewQRCode ? (
                        <div className="flex flex-col items-center space-y-2">
                          <Image 
                            src={previewQRCode} 
                            alt="QR Code Preview" 
                            width={150}
                            height={150}
                            className="rounded border border-gray-600"
                            unoptimized={true}
                          />
                          <div className="text-center">
                            <p className="text-xs text-gray-400">Preview: {customAmount} XION</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{description}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-gray-500">
                          <QrCode className="w-12 h-12" />
                          <span className="text-xs text-center">
                            {!userXionAddress ? 'Set Xion address first' : 'Enter amount and description'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowCustomForm(false)
                      setCustomAmount('')
                      setDescription('')
                      setPreviewQRCode(null)
                    }}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      if (customAmount && description) {
                        handleGeneratePaymentLink('custom', customAmount, description)
                      }
                    }}
                    disabled={!customAmount || !description || isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <QrCode className="w-4 h-4 mr-2" />
                    )}
                    Generate
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent QR Codes */}
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearPaymentLinks}
                disabled={paymentLinks.length === 0}
              >
                Clear All
              </Button>
            </div>
            
            {paymentLinks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <QrCode className="w-12 h-12 text-gray-600 mb-3" />
                <p className="text-gray-400 mb-4">No payment links generated yet</p>
                <p className="text-sm text-gray-500 max-w-xs">Generate your first payment link and it will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 -mr-2">
                {paymentLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                    {/* QR Code Display */}
                    <div className="flex-shrink-0">
                      {link.qrCodeData ? (
                        <Image 
                          src={link.qrCodeData} 
                          alt="Payment QR Code" 
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded border border-gray-600"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    {/* Payment Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <p className="font-medium truncate">{link.amount} XION</p>
                        
                      </div>
                      <p className="text-sm text-gray-400 truncate">{link.productName || getProductName(link.productId)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(link.created).toLocaleString()}
                      </p>
                      {link.transactionId && (
                        <p className="text-xs text-blue-400 truncate mt-1">TX: {link.transactionId}</p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyPaymentLink(link.link)}
                          className="p-2 h-8 w-8"
                          title="Copy payment link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => downloadQRCode(link.id)}
                          className="p-2 h-8 w-8"
                          title="Download QR code"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex space-x-1">
                        {/* Payment status is now handled by the Xion payment gateway */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deletePaymentLink(link.id)}
                          className="p-2 h-8 w-8 text-red-400 hover:text-red-300"
                          title="Delete payment link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default QRPage
