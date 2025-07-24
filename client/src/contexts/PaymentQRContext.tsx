'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'
import QRCode from 'qrcode'
import { useXion as useXionWallet } from './xion-context' // Import the XionContext hook with a different name
import { useVendor, BusinessProfile } from './vendor-context' // Import the VendorContext hook
import { paymentAPI, paymentSessionAPI, PaymentLink as APIPaymentLink } from '@/lib/payment-api'

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
  refreshPaymentStatus: () => Promise<void>
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
  updatePaymentLinkStatus: () => {},
  refreshPaymentStatus: async () => {}
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
  
  // Get vendor business profile and wallet address for payment session (reactive)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(() => {
    // Try to load from localStorage as fallback
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('businessProfile')
      return saved ? JSON.parse(saved) : null
    }
    return null
  })
  const [vendorWallet, setVendorWallet] = useState<string | null>(() => {
    // Try to load from localStorage as fallback
    if (typeof window !== 'undefined') {
      return localStorage.getItem('xionWalletAddress')
    }
    return null
  })

  // Get vendor context (should always be available since VendorProvider is in root layout)
  const vendorContext = useVendor()

  // Also get the xion wallet context directly for better synchronization
  // const xionWallet = useXionWallet()

  // Reactively update vendor data when context changes (prioritize context over localStorage)
  useEffect(() => {
    if (vendorContext?.businessProfile !== businessProfile) {
      setBusinessProfile(vendorContext?.businessProfile || null)
    }

    // Prioritize vendor context wallet address, then xion wallet, then localStorage
    const newWalletAddress = vendorContext?.xionWalletAddress || xionWallet?.xionAddress || null
    if (newWalletAddress !== vendorWallet) {
      setVendorWallet(newWalletAddress)
    }
  }, [vendorContext?.businessProfile, vendorContext?.xionWalletAddress, xionWallet?.xionAddress, businessProfile, vendorWallet])

  // Fallback: Sync with localStorage if no context data is available
  useEffect(() => {
    if (!vendorContext?.businessProfile && !businessProfile) {
      const saved = localStorage.getItem('businessProfile')
      if (saved) {
        try {
          setBusinessProfile(JSON.parse(saved))
        } catch (e) {
          console.warn('Failed to parse businessProfile from localStorage')
        }
      }
    }

    if (!vendorWallet) {
      const savedWallet = localStorage.getItem('xionWalletAddress')
      if (savedWallet) {
        setVendorWallet(savedWallet)
      }
    }
  }, [vendorContext?.businessProfile, businessProfile, vendorWallet])

  // Listen for wallet connection events to update vendor wallet immediately
  useEffect(() => {
    const handleWalletConnect = (event: CustomEvent<{ address: string }>) => {
      if (event.detail?.address) {
        setVendorWallet(event.detail.address)
      }
    }

    const handleWalletDisconnect = () => {
      setVendorWallet(null)
    }

    window.addEventListener('xion_wallet_connected', handleWalletConnect as EventListener)
    window.addEventListener('xion_logout', handleWalletDisconnect)

    return () => {
      window.removeEventListener('xion_wallet_connected', handleWalletConnect as EventListener)
      window.removeEventListener('xion_logout', handleWalletDisconnect)
    }
  }, [])
  
  // Xion client integration is handled through the vendor context
  
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

  // Load payment links from documented APIs on component mount
  useEffect(() => {
    const fetchPaymentLinks = async () => {
      try {
        // Use documented APIs: get recent sessions (all statuses) and transactions
        const [sessions, transactions] = await Promise.all([
          paymentSessionAPI.getRecentSessions(5), // Get top 5 recent sessions regardless of status
          paymentAPI.getAllTransactions()
        ])
        
        // Convert sessions to payment links format for UI compatibility
        const links = await Promise.all(sessions.map(async session => {
          const transaction = transactions.find(tx => tx.transactionId === session.transactionId)
          const paymentLink = `${window.location.origin}/pay/${session.sessionId}`

          // Generate QR code for existing payment links
          let qrCodeData = ''
          try {
            qrCodeData = await QRCode.toDataURL(paymentLink, {
              width: 256,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            })
          } catch (error) {
            console.error('Failed to generate QR code for existing payment link:', error)
          }

          // Session status is properly mapped from API

          return {
            id: session._id,
            productId: session.productId,
            productName: transaction ?
              (typeof transaction.productId === 'object' ? transaction.productId.name : 'Product') :
              'Product',
            amount: session.expectedAmount,
            description: session.memo,
            created: session.createdAt,
            link: paymentLink,
            qrCodeData: qrCodeData,
            status: session.status as 'pending' | 'processing' | 'completed' | 'failed' | 'expired', // Ensure proper typing
            transactionId: session.transactionId,
            transactionHash: session.transactionHash,
            txHash: session.txHash || session.transactionHash || '',
            expiresAt: session.expiresAt // Include expiration timestamp
          }
        }))

        setPaymentLinks(links)
      } catch (error) {
        console.error('Failed to load payment links:', error)
        // Set empty array as fallback
        setPaymentLinks([])
      }
    }
    fetchPaymentLinks()
  }, [])

  // Note: Individual payment links are saved when created/updated
  // No need for bulk save operation with JSON server

  // QR code generation is handled in individual components

  // Get a payment link by ID
  const getPaymentLinkById = (paymentLinkId: string): PaymentLink | undefined => {
    return paymentLinks.find(link => link.id === paymentLinkId)
  }

  // Transaction verification is handled through the payment API

  // Update a payment link status
  const updatePaymentLinkStatus = async (paymentLinkId: string, status: PaymentLink['status'], transactionHash?: string) => {
    try {
      if (status === 'completed' && transactionHash) {
        // Complete the payment session using the new API
        // Complete the payment session using documented API
        await paymentSessionAPI.completeSession(paymentLinkId, transactionHash)
        
        // Create updated link object for local state
        const updatedLink = {
          ...paymentLinks.find(link => link.id === paymentLinkId)!,
          status: 'completed' as const,
          transactionHash
        }
        
        // Update local state
        setPaymentLinks(prevLinks => {
          return prevLinks.map(link => {
            if (link.id === paymentLinkId) {
              return updatedLink
            }
            return link
          })
        })
        
        toast.success('Payment completed successfully!')
      } else {
        // For other status updates, we don't have direct support in the new API
        // Just update local state for now
        setPaymentLinks(prevLinks => {
          return prevLinks.map(link => {
            if (link.id === paymentLinkId) {
              return {
                ...link,
                status,
                transactionHash
              }
            }
            return link
          })
        })
        
        if (status === 'failed') {
          toast.error('Payment failed')
        } else {
          toast.success(`Payment status updated to ${status}`)
        }
      }
    } catch (error) {
      console.error('Failed to update payment link status:', error)
      toast.error('Failed to update payment status')
    }
  }

  // Delete a specific payment link
  const deletePaymentLink = (paymentLinkId: string) => {
    try {
      // Note: The documented APIs don't have a delete endpoint for payment sessions
      // We'll just remove from local state for now
      console.warn('Payment session deletion not supported in documented API, removing from local state only')

      // Update local state
      setPaymentLinks(prevLinks => prevLinks.filter(link => link.id !== paymentLinkId))
      toast.success('Payment link removed from view')
    } catch (error) {
      console.error('Failed to remove payment link:', error)
      toast.error('Failed to remove payment link')
    }
  }

  // Refresh payment status for all payment links
  const refreshPaymentStatus = async () => {
    try {
      console.log('Refreshing payment status...')

      // Fetch updated sessions and transactions
      const [sessions, transactions] = await Promise.all([
        paymentSessionAPI.getRecentSessions(5), // Get recent sessions regardless of status
        paymentAPI.getAllTransactions()
      ])

      console.log('Fetched sessions:', sessions.length, 'transactions:', transactions.length)

      // If we have new sessions, regenerate the entire list to ensure we show all recent ones
      if (sessions.length > 0) {
        const links = await Promise.all(sessions.map(async session => {
          const transaction = transactions.find(tx => tx.transactionId === session.transactionId)
          const paymentLink = `${window.location.origin}/pay/${session.sessionId}`

          // Generate QR code for existing payment links if missing
          let qrCodeData = ''
          try {
            qrCodeData = await QRCode.toDataURL(paymentLink, {
              width: 256,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            })
          } catch (error) {
            console.error('Failed to generate QR code for payment link:', error)
          }

          return {
            id: session._id,
            productId: session.productId,
            productName: transaction ?
              (typeof transaction.productId === 'object' ? transaction.productId.name : 'Product') :
              'Product',
            amount: session.expectedAmount,
            description: session.memo,
            created: session.createdAt,
            link: paymentLink,
            qrCodeData: qrCodeData,
            status: session.status as 'pending' | 'processing' | 'completed' | 'failed' | 'expired',
            transactionId: session.transactionId,
            transactionHash: session.transactionHash,
            txHash: session.txHash || session.transactionHash || '',
            expiresAt: session.expiresAt
          }
        }))

        setPaymentLinks(links)
        console.log('Updated payment links:', links.length)
      } else {
        // If no sessions found, clear the list
        setPaymentLinks([])
        console.log('No sessions found, cleared payment links')
      }

      toast.success('Payment status refreshed')
    } catch (error) {
      console.error('Failed to refresh payment status:', error)
      toast.error(`Failed to refresh payment status: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
  const generatePaymentLink = async (productId: string, productName: string, amount: string, description: string): Promise<PaymentLink | null> => {
    if (isGenerating) return null

    // Check if we have the required vendor data (with fallback to vendor name)
    const effectiveBusinessName = businessProfile?.businessName || vendorContext?.vendorProfile?.name
    if (!effectiveBusinessName) {
      const errorMsg = 'Vendor profile not found. Please complete your profile setup in Settings.'
      console.error('❌', errorMsg)
      toast.error(errorMsg)
      return null
    }

    if (!vendorWallet) {
      const errorMsg = 'Vendor wallet address not found. Please set up your Xion wallet address in Settings.'
      console.error('❌', errorMsg)
      toast.error(errorMsg)
      return null
    }

    setIsGenerating(true)

    // Handle custom payments by creating a temporary product if needed
    let actualProductId = productId
    if (productId === 'custom') {
      try {
        // For custom payments, we'll create a temporary product entry
        // This is a workaround since the backend requires a valid productId
        const customProduct = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: `Custom Payment - ${Date.now()}`, // Make it unique
            price: parseFloat(amount),
          }),
        })

        if (!customProduct.ok) {
          throw new Error('Failed to create custom product')
        }

        const customProductData = await customProduct.json()
        actualProductId = customProductData.product._id
      } catch (error) {
        console.error('Failed to create custom product:', error)
        toast.error('Failed to create custom payment. Please try again.')
        setIsGenerating(false)
        return null
      }
    }
    
    try {
      // Step 1: Generate sessionId and create structured memo first
      const sessionId = `session_${Date.now().toString(36)}`

      // Create structured memo: APP_NAME/VENDOR_BUSINESS_NAME/PRODUCT_NAME/SESSIONID
      const APP_NAME = 'xionxepay-pos'
      // Use business name if available, otherwise fallback to vendor name, then default
      const VENDOR_BUSINESS_NAME = businessProfile?.businessName || vendorContext?.vendorProfile?.name || 'XionxePay'
      const structuredMemo = `${APP_NAME}/${VENDOR_BUSINESS_NAME}/${productName}/${sessionId}`

      // console.log('📝 Creating transaction with structured memo:', structuredMemo)

      // Step 2: Create transaction via /api/payment POST (description = memo)
      const transaction = await paymentAPI.createTransaction({
        amount: parseFloat(amount),
        productId: actualProductId, // Use the actual product ID (either original or newly created)
        description: structuredMemo  // ← Use structured memo as description
      })

      // console.log('✅ Transaction created:', transaction)

      // Step 3: Create payment session using the transactionId from step 1
      const sessionData = {
        transactionId: transaction.transactionId,
        productId: actualProductId, // Use the actual product ID
        expectedAmount: amount,
        sessionId: sessionId,
        memo: structuredMemo,
        vendorWallet: vendorWallet || ''
      }
      
      console.log('🔍 DEBUG: Payment session data being sent to API:', {
        sessionData,
        vendorWallet,
        businessProfile,
        vendorContext: vendorContext?.vendorProfile,
        transaction
      })
      
      const session = await paymentSessionAPI.startPaymentSession(sessionData)
      
      // IMPORTANT: Use the sessionId we generated, not session._id from API
      // Create payment link URL using our generated sessionId for customer payment page
      const baseUrl = process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || window.location.origin
      const paymentLink = `${baseUrl}/pay/${sessionId}`  // Use our generated sessionId
      
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
        created: session.createdAt,
        link: paymentLink,
        qrCodeData,
        status: session.status,
        transactionId: transaction.transactionId,
        transactionHash: session.transactionHash,
        txHash: session.txHash || session.transactionHash || '',
        expiresAt: session.expiresAt // Include expiration timestamp
      }
      
      // Create payment link object for local state - use our generated sessionId as the ID
      const newLink = {
        id: sessionId,  // Use our generated sessionId, not session._id
        ...newLinkData
      }
      
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
    updatePaymentLinkStatus,
    refreshPaymentStatus
  }

  return (
    <PaymentQRContext.Provider value={contextValue}>
      {children}
    </PaymentQRContext.Provider>
  )
}

export default PaymentQRProvider
