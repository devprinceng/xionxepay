'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'
import QRCode from 'qrcode'
// Import Xion SDK types but make them optional for use
import type { SigningStargateClient } from '@cosmjs/stargate'
import { useAbstraxionSigningClient } from '@burnt-labs/abstraxion'
import { useXion as useXionWallet } from './xion-context' // Import the XionContext hook with a different name
import { paymentAPI, paymentLinksAPI, PaymentData, PaymentLink as APIPaymentLink } from '@/lib/payment-api'

// Define types for payment links and context
export type PaymentLink = APIPaymentLink

interface PaymentQRContextType {
  paymentLinks: PaymentLink[]
  isGenerating: boolean
  userXionAddress: string | null
  setUserXionAddress: (address: string) => void
  generatePaymentLink: (productId: string, productName: string, amount: string, description: string) => Promise<PaymentLink | null>
  clearPaymentLinks: () => void
  copyPaymentLink: (link: string) => void
  downloadQRCode: (paymentLinkId: string) => void
  deletePaymentLink: (paymentLinkId: string) => void
  getPaymentLinkById: (paymentLinkId: string) => PaymentLink | undefined
  updatePaymentLinkStatus: (paymentLinkId: string, status: PaymentLink['status'], transactionId?: string) => void
}

// Create context with default values
const PaymentQRContext = createContext<PaymentQRContextType>({
  paymentLinks: [],
  isGenerating: false,
  userXionAddress: null,
  setUserXionAddress: () => {},
  generatePaymentLink: async () => null,
  clearPaymentLinks: () => {},
  copyPaymentLink: () => {},
  downloadQRCode: () => {},
  deletePaymentLink: () => {},
  getPaymentLinkById: () => undefined,
  updatePaymentLinkStatus: () => {}
})

// Hook to use the payment QR context
export const useXion = () => useContext(PaymentQRContext)

interface PaymentQRProviderProps {
  children: ReactNode
}

export const PaymentQRProvider: React.FC<PaymentQRProviderProps> = ({ children }) => {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [userXionAddress, setUserXionAddress] = useState<string | null>(null)
  
  // Get the Xion wallet address from XionContext if available
  const xionWallet = useXionWallet()
  
  // We'll make the Xion client integration optional
  // This way the app can work without an active wallet connection
  let xionClientAvailable = false
  try {
    // We'll check if the Abstraxion client is available but won't require it
    const abstraxion = useAbstraxionSigningClient()
    xionClientAvailable = !!abstraxion.client
  } catch (error) {
    console.log('Abstraxion client not available, continuing in offline mode')
  }
  
  // Use the Xion wallet address if available
  useEffect(() => {
    if (xionWallet?.xionAddress && !userXionAddress) {
      setUserXionAddress(xionWallet.xionAddress)
    }
  }, [xionWallet?.xionAddress, userXionAddress])
  
  // Load user's Xion address from localStorage on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('userXionAddress')
    if (savedAddress) {
      setUserXionAddress(savedAddress)
    }
  }, [])

  // Load saved payment links from JSON server on component mount
  useEffect(() => {
    const fetchPaymentLinks = async () => {
      try {
        const links = await paymentLinksAPI.getAllPaymentLinks()
        setPaymentLinks(links)
      } catch (error) {
        console.error('Failed to load payment links:', error)
      }
    }
    fetchPaymentLinks()
  }, [])

  // Note: Individual payment links are saved when created/updated
  // No need for bulk save operation with JSON server

  // Generate a QR code data URL from a string using the qrcode library
  const generateQRCodeData = async (text: string): Promise<string> => {
    try {
      // Generate QR code as data URL
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw error
    }
  }

  // Get a payment link by ID
  const getPaymentLinkById = (paymentLinkId: string): PaymentLink | undefined => {
    return paymentLinks.find(link => link.id === paymentLinkId)
  }

  // Get the Abstraxion client for transaction verification
  const { client: xionClient } = useAbstraxionSigningClient()

  // Update a payment link status
  const updatePaymentLinkStatus = async (paymentLinkId: string, status: PaymentLink['status'], transactionId?: string) => {
    // If we're marking as completed and have a transaction ID, try to verify the transaction
    if (status === 'completed' && transactionId) {
      try {
        // Only verify if we have a client available
        if (xionClient) {
          // Verify the transaction on-chain using the Xion API
          // The Xion testnet API endpoint is https://api.xion-testnet-2.burnt.com/
          const txResult = await xionClient.getTx(transactionId)
          
          // Check if transaction was successful
          if (txResult && txResult.code === 0) {
            // Transaction was successful, update the status
            try {
              // Update payment link status in JSON server
              const updatedLink = await paymentLinksAPI.updatePaymentLinkStatus(paymentLinkId, status, transactionId)
              
              // Update local state
              setPaymentLinks(prevLinks => {
                return prevLinks.map(link => {
                  if (link.id === paymentLinkId) {
                    return updatedLink
                  }
                  return link
                })
              })
              
              toast.success('Payment verified and completed successfully!')
              return
            } catch (error) {
              console.error('Failed to update payment link status:', error)
              toast.error('Failed to update payment status')
            }
          } else {
            // Transaction failed or was not found
            throw new Error('Transaction verification failed')
          }
        } else {
          // No client available, just update status without verification
          console.log('Xion client not available for verification, updating status directly')
          try {
            // Update payment link status in JSON server
            const updatedLink = await paymentLinksAPI.updatePaymentLinkStatus(paymentLinkId, status, transactionId)
            
            // Update local state
            setPaymentLinks(prevLinks => {
              return prevLinks.map(link => {
                if (link.id === paymentLinkId) {
                  return updatedLink
                }
                return link
              })
            })
            
            toast.success('Payment marked as completed')
            return
          } catch (error) {
            console.error('Failed to update payment link status:', error)
            toast.error('Failed to update payment status')
          }
        }
      } catch (error) {
        console.error('Failed to verify transaction:', error)
        toast.error('Failed to verify transaction')
        
        // Mark as failed if verification fails
        try {
          // Update payment link status in JSON server
          const updatedLink = await paymentLinksAPI.updatePaymentLinkStatus(paymentLinkId, 'failed')
          
          // Update local state
          setPaymentLinks(prevLinks => {
            return prevLinks.map(link => {
              if (link.id === paymentLinkId) {
                return updatedLink
              }
              return link
            })
          })
          return
        } catch (error) {
          console.error('Failed to update payment link status:', error)
          toast.error('Failed to update payment status')
        }
      }
    }
    
    try {
      // Update payment link status in JSON server
      const updatedLink = await paymentLinksAPI.updatePaymentLinkStatus(paymentLinkId, status, transactionId)
      
      // Update local state
      setPaymentLinks(prevLinks => {
        return prevLinks.map(link => {
          if (link.id === paymentLinkId) {
            return updatedLink
          }
          return link
        })
      })
      
      if (status === 'completed') {
        toast.success('Payment completed successfully!')
      } else if (status === 'failed') {
        toast.error('Payment failed')
      }
    } catch (error) {
      console.error('Failed to update payment link status:', error)
      toast.error('Failed to update payment status')
    }
  }

  // Delete a specific payment link
  const deletePaymentLink = (paymentLinkId: string) => {
    try {
      // Delete payment link from JSON server
      paymentLinksAPI.deletePaymentLink(paymentLinkId)
      
      // Update local state
      setPaymentLinks(prevLinks => prevLinks.filter(link => link.id !== paymentLinkId))
      toast.success('Payment link deleted')
    } catch (error) {
      console.error('Failed to delete payment link:', error)
      toast.error('Failed to delete payment link')
    }
  }

  // Set user's Xion address and save it to localStorage
  const handleSetUserXionAddress = (address: string) => {
    // Validate the address format (basic check for Xion address)
    if (!address.startsWith('xion')) {
      toast.error('Invalid Xion address format')
      return
    }
    
    setUserXionAddress(address)
    localStorage.setItem('userXionAddress', address)
    toast.success('Xion address set successfully')
  }

  // Generate a payment link for a product or custom amount
  const generatePaymentLink = async (
    productId: string,
    productName: string,
    amount: string,
    description: string
  ): Promise<PaymentLink | null> => {
    try {
      setIsGenerating(true)
      
      // Create a unique transaction ID
      const txId = `tx_${Date.now().toString(36)}`
      
      // Create simplified payment link URL - just /pay/{txId}
      const baseUrl = process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || window.location.origin
      const paymentLink = `${baseUrl}/pay/${txId}`
      
      // Create payment data for JSON server
      const paymentData: Omit<PaymentData, 'id'> = {
        txId: txId,
        productId: productId,
        productName: productName,
        amount: amount,
        description: description,
        recipient: userXionAddress || '',
        created: new Date().toISOString(),
        status: 'pending'
      }
      
      // Store payment data in JSON server
      await paymentAPI.createPayment(paymentData)
      
      // Generate QR code for the simplified payment link
      const qrCodeData = await QRCode.toDataURL(paymentLink, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      const newLinkData: Omit<PaymentLink, 'id'> = {
        productId,
        productName,
        amount,
        description,
        created: new Date().toISOString(),
        link: paymentLink,
        qrCodeData,
        status: 'pending',
        transactionId: txId
      }
      
      // Store payment link in JSON server
      const newLink = await paymentLinksAPI.createPaymentLink(newLinkData)
      
      // Update state with the new payment link
      setPaymentLinks(prevLinks => [newLink, ...prevLinks])
      
      toast.success('Payment link generated successfully!')
      return newLink
    } catch (error) {
      console.error('Failed to generate payment link:', error)
      toast.error('Failed to generate payment link')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  // Clear all payment links
  const clearPaymentLinks = () => {
    setPaymentLinks([])
    localStorage.removeItem('xionPaymentLinks')
    toast.success('Payment links cleared')
  }

  // Copy a payment link to clipboard
  const copyPaymentLink = (link: string) => {
    navigator.clipboard.writeText(link)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'))
  }

  // Download a QR code as an image
  const downloadQRCode = (paymentLinkId: string) => {
    const paymentLink = paymentLinks.find(link => link.id === paymentLinkId)
    
    if (!paymentLink || !paymentLink.qrCodeData) {
      toast.error('QR code not available')
      return
    }
    
    // Create a temporary anchor element
    const link = document.createElement('a')
    link.href = paymentLink.qrCodeData
    link.download = `payment-qr-${paymentLinkId}.png`
    
    // Append to the document
    document.body.appendChild(link)
    
    // Trigger the download
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    
    toast.success('QR code downloaded')
  }

  // Context value
  const contextValue: PaymentQRContextType = {
    paymentLinks,
    isGenerating,
    userXionAddress,
    setUserXionAddress: handleSetUserXionAddress,
    generatePaymentLink,
    clearPaymentLinks,
    copyPaymentLink,
    downloadQRCode,
    deletePaymentLink,
    getPaymentLinkById,
    updatePaymentLinkStatus
  }

  return (
    <PaymentQRContext.Provider value={contextValue}>
      {children}
    </PaymentQRContext.Provider>
  )
}

export default PaymentQRProvider
