'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useXion } from '@/contexts/xion-context'
import { useAbstraxionSigningClient, useAbstraxionAccount } from '@burnt-labs/abstraxion'
import { XionConnectButton } from '@/components/xion/xion-connect-button'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle, XCircle, Loader2, Clock, Wallet, Download } from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { coins } from '@cosmjs/proto-signing'
import { paymentSessionAPI, paymentAPI } from '@/lib/payment-api'
import { EnhancedReceipt } from '@/components/ui/enhanced-receipt'
import { EnhancedReceiptGenerator } from '@/utils/receipt-generator'

function PaymentPageContent() {
  const params = useParams()
  const { xionAddress, isConnected } = useXion()
  
  // Get session ID from URL (the productId param is actually the sessionId)
  const sessionId = params.productId as string
  
  // Load payment session data (customer-facing)
  const [sessionData, setSessionData] = useState<any>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  
  useEffect(() => {
    // Load payment session data using the sessionId directly
    const fetchSessionData = async () => {
      try {
        const sessionResponse = await paymentSessionAPI.getSessionStatus(sessionId)
        if (sessionResponse) {
          setSessionData(sessionResponse)
          
          // Check if the session is already expired on the server
          if (sessionResponse.status === 'expired') {
            setPaymentStatus('expired')
            setTimeRemaining(0)
            setTimerProgress(0)
          } else if (sessionResponse.status === 'completed') {
            setPaymentStatus('completed')
            // If there's a transaction hash, set it (check both possible field names)
            if (sessionResponse.txHash) {
              setTransactionHash(sessionResponse.txHash)
            } else if (sessionResponse.transactionHash) {
              setTransactionHash(sessionResponse.transactionHash)
            }
          } else {
            // Calculate session duration and remaining time based on server timestamps
            const createdAt = new Date(sessionResponse.createdAt).getTime()
            const expiresAt = new Date(sessionResponse.expiresAt).getTime()
            const now = Date.now()
            

            // Calculate total session duration from server timestamps
            const totalDurationMs = expiresAt - createdAt
            const totalDurationSeconds = Math.floor(totalDurationMs / 1000)
            setSessionDuration(totalDurationSeconds)
            
            // Calculate remaining time
            const remainingMs = expiresAt - now
            
            if (remainingMs <= 0) {
              setPaymentStatus('expired')
              setTimeRemaining(0)
              setTimerProgress(0)
            } else {
              const remainingSeconds = Math.floor(remainingMs / 1000)
              setTimeRemaining(remainingSeconds)
              setTimerProgress((remainingSeconds / totalDurationSeconds) * 100)
            }
          }
        } else {
          toast.error('Payment session not found')
        }
      } catch (error) {
        console.error('Error fetching payment session data:', error)
        toast.error('Failed to load payment session data')
      } finally {
        setDataLoaded(true)
      }
    }
    
    fetchSessionData()
  }, [sessionId])
  
  // Extract payment details from loaded session data
  const productId = sessionData?.productId || sessionId
  const amount = sessionData?.expectedAmount || '0'
  const description = sessionData?.memo || 'Payment' // Simple description for customer page
  const recipient = sessionData?.vendorWallet || '' // Recipient will be determined by the vendor's wallet
  const txId = sessionData?.transactionId || sessionId
  const currentSessionId = sessionData?.sessionId || sessionId
  
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed' | 'expired'>('pending')
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  
  // Session timer state - will be calculated from server timestamps
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timerProgress, setTimerProgress] = useState(100)
  const [sessionDuration, setSessionDuration] = useState(10 * 60) // Default 10 minutes
  
  // Format time remaining as MM:SS
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  // Initialize and run the timer with periodic server sync
  useEffect(() => {
    // Only run the timer if payment is pending
    if (paymentStatus !== 'pending' || !sessionData) return

    const timer = setInterval(() => {
      // Calculate remaining time based on server expiresAt timestamp
      const expiresAt = new Date(sessionData.expiresAt).getTime()
      const now = Date.now()
      const remainingMs = expiresAt - now

      if (remainingMs <= 0) {
        clearInterval(timer)
        setPaymentStatus('expired')
        setTimeRemaining(0)
        setTimerProgress(0)
      } else {
        const remainingSeconds = Math.floor(remainingMs / 1000)
        setTimeRemaining(remainingSeconds)
      }
    }, 1000)

    // Also periodically check server status to handle edge cases
    const statusChecker = setInterval(async () => {
      try {
        const sessionResponse = await paymentSessionAPI.getSessionStatus(sessionId)
        if (sessionResponse && sessionResponse.status !== paymentStatus) {
          if (sessionResponse.status === 'expired') {
            setPaymentStatus('expired')
            setTimeRemaining(0)
            setTimerProgress(0)
          } else if (sessionResponse.status === 'completed') {
            setPaymentStatus('completed')
            if (sessionResponse.txHash) {
              setTransactionHash(sessionResponse.txHash)
            } else if (sessionResponse.transactionHash) {
              setTransactionHash(sessionResponse.transactionHash)
            }
          }
        }
      } catch (error) {
        console.error('Error checking session status:', error)
      }
    }, 30000) // Check every 30 seconds

    // Clean up the timers
    return () => {
      clearInterval(timer)
      clearInterval(statusChecker)
    }
  }, [paymentStatus, sessionData, sessionId])
  
  // Update progress bar
  useEffect(() => {
    if (sessionDuration > 0) {
      setTimerProgress((timeRemaining / sessionDuration) * 100)
    }
  }, [timeRemaining, sessionDuration])
  
  // Get Xion client and account - only when connected to prevent authentication errors
  const { client: xionClient } = useAbstraxionSigningClient()
  const { data: account, isConnected: accountConnected } = useAbstraxionAccount()
  const walletAddress = account?.bech32Address
  
  // State for wallet balance debugging
  const [walletBalance, setWalletBalance] = useState<string>('Loading...')
  
  // Fetch wallet balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (xionClient && walletAddress) {
        try {
          const balance = await xionClient.getBalance(walletAddress, 'uxion')
          const xionBalance = (parseInt(balance.amount) / 1000000).toFixed(6)
          setWalletBalance(`${xionBalance} XION`)
        } catch (error) {
          console.error('Error fetching balance:', error)
          setWalletBalance('Error fetching balance')
        }
      } else {
        setWalletBalance('Wallet not connected')
      }
    }
    
    fetchBalance()
  }, [xionClient, walletAddress])
  
  // Check if wallet is properly authenticated
  // We use the XionContext isConnected state and verify we have all required components
  const isWalletAuthenticated = isConnected && accountConnected && walletAddress && xionClient
  
  // Download transaction receipt using enhanced receipt generator
  const downloadReceipt = async () => {
    if (!transactionHash || !sessionData) {
      toast.error('Transaction data not available')
      return
    }

    try {
      const receiptGenerator = new EnhancedReceiptGenerator()
      await receiptGenerator.downloadReceipt({
        transactionHash,
        amount,
        productName: description,
        sessionId: currentSessionId,
        timestamp: new Date().toISOString(),
        recipientAddress: recipient,
        vendorName: 'XionxePay Vendor'
      })
    } catch (error) {
      console.error('Failed to download receipt:', error)
      toast.error('Failed to generate receipt')
    }
  }
  
  // Process payment
  const handlePayment = async () => {
    // Don't allow payment if session expired
    if (paymentStatus === 'expired') {
      toast.error('Payment session expired. Please restart the session.')
      return
    }
    // Check authentication status
    if (!isWalletAuthenticated) {
      toast.error('Please connect your Xion wallet first')
      return
    }
    
    if (!xionClient) {
      toast.error('Xion client not available. Please try reconnecting your wallet.')
      return
    }
    
    if (!recipient) {
      toast.error('No recipient address provided')
      return
    }
    
    try {
      setPaymentStatus('processing')
      
      // Convert amount to uxion (1 XION = 1,000,000 uxion)
      const amountInUxion = (parseFloat(amount) * 1000000).toString()
      
      // Create the gasless payment transaction using the Xion API
      // The Xion testnet API endpoint is https://api.xion-testnet-2.burnt.com/
      const result = await xionClient.sendTokens(
        walletAddress,
        recipient,
        coins(amountInUxion, "uxion"),
        "auto", // Use auto for gasless transactions on Xion
        description || "Payment via XionxePay"
      )
      
      // Get the transaction hash from the result
      console.log(result)
      const transactionHash = result.transactionHash
      setTransactionHash(transactionHash)
      setPaymentStatus('completed')
      
      // Complete the payment session using the Payment Session API
      try {
        if (currentSessionId) {
          console.log('Completing payment session with:', { 
            sessionId: currentSessionId, 
            transactionHash, 
            status: 'completed' 
          })
          
          // Send sessionId, transactionHash, and status in the request body
          const sessionResponse = await paymentSessionAPI.completeSession(
            currentSessionId, 
            transactionHash, 
            'completed'
          )
          
          console.log('Session completion response:', sessionResponse)
          
          // Update the transaction with the transaction ID from the session response
          if (sessionResponse && sessionResponse.transactionId) {
            try {
              const transactionUpdateData = {
                status: 'completed',
                transactionId: sessionResponse.transactionId,
                transactionHash
              }
              
              console.log('Updating transaction with:', transactionUpdateData)
              
              // Send PUT request to update the transaction
              await paymentAPI.updateTransaction(
                sessionResponse.transactionId,
                'completed',
                transactionHash
              )
              console.log('Transaction updated successfully')
            } catch (txError) {
              console.error('Failed to update transaction:', txError)
              // Continue anyway as the blockchain transaction and session were successful
            }
          } else {
            console.error('Missing transactionId in session response:', sessionResponse)
          }
        }
      } catch (error) {
        console.error('Failed to complete payment session:', error)
        // Continue anyway as the blockchain transaction was successful
      }
      
      toast.success('Payment completed successfully!')
      
      // Notify any listeners about the successful payment
      window.dispatchEvent(new CustomEvent('xion_payment_completed', { 
        detail: { transactionHash, txId }
      }))
    } catch (error: any) {
      console.error('Payment failed:', error)
      setPaymentStatus('failed')
      toast.error(`Payment failed: ${error.message || 'Unknown error'}`)
    }
  }
  
  // Show loading state while data is being loaded
  if (!dataLoaded) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading payment session...</span>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Show error state if session data not found
  if (!sessionData) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Session Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This payment link is invalid or has expired.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show full-width success page when payment is completed
  if (paymentStatus === 'completed' && transactionHash) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-center">
          <EnhancedReceipt
            transactionHash={transactionHash}
            amount={amount}
            productName={description}
            sessionId={currentSessionId}
            timestamp={new Date().toISOString()}
            recipientAddress={recipient}
            onDownload={downloadReceipt}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">

      <Card>
        <CardHeader>
          <CardTitle>Payment Request</CardTitle>
          <CardDescription>Complete your payment using Xion</CardDescription>
          {paymentStatus === 'pending' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Session expires in:</span>
                </div>
                <span className="font-mono font-medium">{formatTimeRemaining(timeRemaining)}</span>
              </div>
              <Progress value={timerProgress} className="h-1" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{amount} XION</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span>{description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="text-xs truncate max-w-[200px]">{recipient}</span>
            </div>
            
            {/* Wallet Debug Info */}
            {accountConnected && walletAddress && (
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Wallet className="w-4 h-4" />
                  <span>Wallet Info</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-mono truncate max-w-[200px]">{walletAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="font-mono">{walletBalance}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className=''>
            {/* Success state is now handled separately above */}
            
            {paymentStatus === 'failed' && (
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md flex items-center space-x-2 text-red-600 dark:text-red-400">
                <XCircle className="w-5 h-5" />
                <p className="font-medium">Payment Failed</p>
              </div>
            )}
            
            {paymentStatus === 'processing' && (
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="font-medium">Processing Payment...</p>
              </div>
            )}
            
            {paymentStatus === 'expired' && (
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-medium">Payment Session Expired</p>
                  <p className="text-xs mt-1">This payment session has timed out</p>
                </div>
              </div>
            )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {paymentStatus === 'pending' && (
            <>
              {isWalletAuthenticated ? (
                <Button 
                  onClick={handlePayment} 
                  className="w-full"
                  disabled={!xionClient}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Pay {amount} XION
                </Button>
              ) : isConnected ? (
                <div className="space-y-2 w-full">
                  <Button disabled className="w-full">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating Wallet...
                  </Button>
                  <p className="text-xs text-center text-amber-600 dark:text-amber-400">
                    Please wait while we authenticate your wallet connection
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <XionConnectButton />
                  <p className="text-xs text-center text-muted-foreground">
                    Connect your Xion wallet to complete this payment
                  </p>
                </div>
              )}
            </>
          )}
          
          {paymentStatus === 'completed' && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          )}
          
          {paymentStatus === 'failed' && (
            <Button 
              onClick={handlePayment}
              className="w-full"
              disabled={!isWalletAuthenticated}
            >
              Try Again
            </Button>
          )}
          
          {paymentStatus === 'expired' && (
            <div className="space-y-2 w-full">
              <Button 
                onClick={async () => {
                  // For server-side expired sessions, we need to create a new session
                  // For now, just show a message that they need to generate a new QR code
                  toast.info('This payment session has expired. Please ask the vendor to generate a new QR code.')
                }}
                className="w-full"
                variant="outline"
              >
                Session Expired
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Cancel</Link>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-aurora-blue-400" />
            <span className="ml-2">Loading payment page...</span>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}
