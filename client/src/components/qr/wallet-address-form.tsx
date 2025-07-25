'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface WalletAddressFormProps {
  isVisible: boolean
  onSave: (address: string) => void
  onCancel: () => void
}

export function WalletAddressForm({
  isVisible,
  onSave,
  onCancel
}: WalletAddressFormProps) {
  const [xionAddressInput, setXionAddressInput] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const validateXionAddress = (address: string): boolean => {
    // Basic validation for Xion address format
    const trimmedAddress = address.trim()
    return trimmedAddress.startsWith('xion') && trimmedAddress.length > 10
  }

  const handleSave = async () => {
    const trimmedAddress = xionAddressInput.trim()
    
    if (!trimmedAddress) {
      toast.error('Please enter a Xion wallet address')
      return
    }

    if (!validateXionAddress(trimmedAddress)) {
      toast.error('Invalid Xion address format. Address should start with "xion"')
      return
    }

    setIsValidating(true)
    
    try {
      // Here you could add additional validation like checking if the address exists on-chain
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate validation
      
      onSave(trimmedAddress)
      setXionAddressInput('')
      toast.success('Xion wallet address saved successfully!')
    } catch (error) {
      toast.error('Failed to validate address. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleCancel = () => {
    setXionAddressInput('')
    onCancel()
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 mb-6 border border-blue-500/30 bg-gray-900/95 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Set Your Xion Wallet Address</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Xion Wallet Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="xion1..."
              value={xionAddressInput}
              onChange={(e) => setXionAddressInput(e.target.value)}
              disabled={isValidating}
            />
            
            {/* Validation feedback */}
            {xionAddressInput && (
              <div className="mt-2 flex items-center space-x-2">
                {validateXionAddress(xionAddressInput) ? (
                  <div className="flex items-center space-x-1 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs">Valid address format</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-xs">Invalid address format</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300">
                <strong>Important:</strong> This address will be used as the recipient for all payment links. 
                Make sure you have access to this wallet.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCancel}
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={!validateXionAddress(xionAddressInput) || isValidating}
            >
              {isValidating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Validating...</span>
                </div>
              ) : (
                'Save Address'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
