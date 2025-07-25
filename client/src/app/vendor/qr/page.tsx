'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useXion } from '@/contexts/PaymentQRContext'
import { QRGenerationForm } from '@/components/qr/qr-generation-form'
import { PaymentLinksList } from '@/components/qr/payment-links-list'
import { WalletAddressForm } from '@/components/qr/wallet-address-form'
import type { CustomPaymentData, ProductPaymentData } from '@/types/payment'

const QRPage = () => {
  const {
    paymentLinks,
    isGenerating,
    generatePaymentLink,
    clearPaymentLinks,
    copyPaymentLink,
    downloadQRCode,
    updatePaymentLinkStatus,
    refreshPaymentStatus,
    userXionAddress,
    setUserXionAddress
  } = useXion()
  const [showAddressForm, setShowAddressForm] = useState(false)

  // Handle payment generation for both product and custom payments
  const handleGeneratePayment = async (data: ProductPaymentData | CustomPaymentData) => {
    if ('productId' in data) {
      // Product payment
      await generatePaymentLink(data.productId, data.productName, data.amount, data.productName)
    } else {
      // Custom payment
      await generatePaymentLink('custom', 'Custom Payment', data.amount, data.description)
    }
  }


  // Listen for payment completion events
  useEffect(() => {
    const handlePaymentCompleted = (event: CustomEvent) => {
      const { transactionHash, txId } = event.detail

      // Find the payment link with this txId and update its status
      const paymentLink = paymentLinks.find(link => {
        try {
          const url = new URL(link.link)
          const pathSegments = url.pathname.split('/')
          const lastSegment = pathSegments[pathSegments.length - 1]
          const queryTxId = url.searchParams.get('txId')

          return lastSegment === txId || queryTxId === txId || link.transactionId === txId
        } catch (error) {
          console.error('Invalid URL in payment link:', error)
          return false
        }
      })

      if (paymentLink) {
        updatePaymentLinkStatus(paymentLink.id, 'completed', transactionHash)
      }
    }

    window.addEventListener('xion_payment_completed', handlePaymentCompleted as EventListener)

    return () => {
      window.removeEventListener('xion_payment_completed', handlePaymentCompleted as EventListener)
    }
  }, [paymentLinks, updatePaymentLinkStatus])

  // Get product name by ID for display in recent payments
  const getProductName = (productId: string) => {
    if (productId === 'custom') return 'Custom Payment'
    return 'Product' // Simplified since we don't have products context here
  }

  // Handle wallet address setup
  const handleSetXionAddress = (address: string) => {
    setUserXionAddress(address)
    setShowAddressForm(false)
  }

  const handleShowAddressForm = () => {
    setShowAddressForm(true)
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

      {/* Wallet Address Setup Form */}
      <WalletAddressForm
        isVisible={showAddressForm}
        onSave={handleSetXionAddress}
        onCancel={() => setShowAddressForm(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Generator */}
        <QRGenerationForm
          isGenerating={isGenerating}
          userXionAddress={userXionAddress}
          onGeneratePayment={handleGeneratePayment}
          onShowAddressForm={handleShowAddressForm}
        />

        {/* Recent Payment Links */}
        <PaymentLinksList
          paymentLinks={paymentLinks}
          onCopyLink={copyPaymentLink}
          onDownloadQR={downloadQRCode}
          onClearAll={clearPaymentLinks}
          onRefreshStatus={refreshPaymentStatus}
          getProductName={getProductName}
        />
      </div>
    </div>
  )
}

export default QRPage
