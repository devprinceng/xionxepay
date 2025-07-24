'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { QrCode, Plus, Loader2 } from 'lucide-react'
import { useProducts } from '@/contexts/ProductContext'
import { toast } from 'sonner'
import { QRPreview } from './qr-preview'
import type { PaymentFormData, CustomPaymentData, ProductPaymentData } from '@/types/payment'

interface QRGenerationFormProps {
  isGenerating: boolean
  userXionAddress: string | null
  onGeneratePayment: (data: ProductPaymentData | CustomPaymentData) => Promise<void>
  onShowAddressForm: () => void
}

export function QRGenerationForm({
  isGenerating,
  userXionAddress,
  onGeneratePayment,
  onShowAddressForm
}: QRGenerationFormProps) {
  const { products, loading: productsLoading, fetchProducts } = useProducts()
  const [formData, setFormData] = useState<PaymentFormData>({
    selectedProduct: '',
    customAmount: '',
    description: '',
    showCustomForm: false
  })

  useEffect(() => {
    if (products.length === 0 && !productsLoading) {
      fetchProducts()
    }
  }, [products, productsLoading, fetchProducts])

  const handleProductSelect = (productId: string) => {
    setFormData(prev => ({ ...prev, selectedProduct: productId }))
  }

  const handleCustomAmountChange = (amount: string) => {
    setFormData(prev => ({ ...prev, customAmount: amount }))
  }

  const handleDescriptionChange = (description: string) => {
    setFormData(prev => ({ ...prev, description }))
  }

  const toggleCustomForm = () => {
    setFormData(prev => ({
      ...prev,
      showCustomForm: !prev.showCustomForm,
      selectedProduct: '',
      customAmount: '',
      description: ''
    }))
  }

  const handleGenerateProduct = async () => {
    const product = products.find(p => p._id === formData.selectedProduct)
    if (!product) {
      toast.error('Please select a valid product')
      return
    }

    try {
      await onGeneratePayment({
        productId: product._id,
        productName: product.name,
        amount: product.price.toString()
      })

      // Reset form
      setFormData(prev => ({ ...prev, selectedProduct: '' }))
    } catch (error) {
      console.error('Failed to generate product payment:', error)
      toast.error('Failed to generate payment QR code. Please try again.')
    }
  }

  const handleGenerateCustom = async () => {
    if (!formData.customAmount || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const amount = parseFloat(formData.customAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0')
      return
    }

    try {
      await onGeneratePayment({
        amount: formData.customAmount,
        description: formData.description
      })

      // Reset form
      setFormData(prev => ({
        ...prev,
        customAmount: '',
        description: '',
        showCustomForm: false
      }))
    } catch (error) {
      console.error('Failed to generate custom payment:', error)
      toast.error('Failed to generate payment QR code. Please try again.')
    }
  }

  const validateCustomForm = () => {
    const amount = parseFloat(formData.customAmount)
    return formData.customAmount &&
           formData.description &&
           !isNaN(amount) &&
           amount > 0 &&
           formData.description.trim().length > 0
  }

  const getAmountError = () => {
    if (!formData.customAmount) return null
    const amount = parseFloat(formData.customAmount)
    if (isNaN(amount)) return 'Please enter a valid number'
    if (amount <= 0) return 'Amount must be greater than 0'
    if (amount > 1000000) return 'Amount is too large'
    return null
  }

  const getDescriptionError = () => {
    if (!formData.description) return null
    if (formData.description.trim().length === 0) return 'Description cannot be empty'
    if (formData.description.length > 100) return 'Description is too long (max 100 characters)'
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Generate Payment Link</h3>
        
        {!formData.showCustomForm ? (
          <div className="space-y-4">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Select a Product
              </label>
              <select
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.selectedProduct}
                onChange={(e) => handleProductSelect(e.target.value)}
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

            {/* Generate Product Button */}
            <Button 
              onClick={handleGenerateProduct}
              disabled={!formData.selectedProduct || isGenerating || productsLoading}
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <QrCode className="w-4 h-4 mr-2" />
              )}
              Generate QR Code
            </Button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">OR</span>
              </div>
            </div>

            {/* Custom Payment Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={toggleCustomForm}
              disabled={isGenerating || productsLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Payment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Custom Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Amount (XION) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1000000"
                className={`w-full p-2 rounded-md bg-gray-800 border text-white focus:outline-none focus:ring-2 transition-colors ${
                  getAmountError()
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-700 focus:ring-blue-500'
                }`}
                placeholder="0.00"
                value={formData.customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                disabled={isGenerating}
              />
              {getAmountError() && (
                <p className="mt-1 text-xs text-red-400">{getAmountError()}</p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                maxLength={100}
                className={`w-full p-2 rounded-md bg-gray-800 border text-white focus:outline-none focus:ring-2 transition-colors ${
                  getDescriptionError()
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-700 focus:ring-blue-500'
                }`}
                placeholder="What's this payment for?"
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                disabled={isGenerating}
              />
              {getDescriptionError() && (
                <p className="mt-1 text-xs text-red-400">{getDescriptionError()}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/100 characters
              </p>
            </div>

            {/* QR Preview */}
            {(formData.customAmount || formData.description) && (
              <QRPreview
                amount={formData.customAmount}
                description={formData.description}
                userXionAddress={userXionAddress}
                onShowAddressForm={onShowAddressForm}
              />
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={toggleCustomForm}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleGenerateCustom}
                disabled={!validateCustomForm() || isGenerating}
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
  )
}
