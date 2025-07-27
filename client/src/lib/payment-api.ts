// API service for payment data management

// Base URL for API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const PAYMENT_API_URL = `${API_BASE_URL}/payment`
const PAYMENT_SESSION_API_URL = `${API_BASE_URL}/payment-sessions`

// API Response interfaces
interface ApiResponse<T = any> {
  success: boolean
  message?: string
  error?: string
  data?: T
  [key: string]: any
}

// Transaction model based on actual backend implementation
export interface Transaction {
  _id: string
  transactionId: string
  amount: number // Backend now correctly stores as number
  description: string // Backend now correctly uses 'description'
  vendorId: string
  productId?: string
  isCustom: boolean
  status: 'pending' | 'completed' | 'failed' | 'expired'
  transactionHash?: string
  transactionTime?: string
  createdAt: string
  updatedAt: string
  __v?: number
  // Additional fields for UI display
  time?: string
  formattedAmount?: string
  customer?: string
}

// Payment Session model based on actual backend implementation
export interface PaymentSession {
  _id: string
  sessionId: string
  transactionId?: string
  txHash?: string
  productId?: string
  expectedAmount: string
  memo: string
  email?: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  transactionHash?: string
  createdAt: string
  updatedAt?: string
  expiresAt: string
  vendorId: string
  vendorWallet: string
  isCustom?: boolean
  __v?: number
}

// Legacy interfaces for backward compatibility
export interface PaymentData {
  id: string
  txId: string
  productId: string
  productName: string
  amount: string
  description: string
  recipient: string
  created: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  transactionHash?: string
  updatedAt?: string
}

export interface PaymentLink {
  id: string
  productId: string
  productName: string
  amount: string
  description: string
  created: string
  link: string
  qrCodeData: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  transactionId: string
  txHash: string
  transactionHash?: string
  expiresAt?: string // Add expiration timestamp
}

// Payment API
export const paymentAPI = {
  // Create a new transaction - DISABLED: Backend creates transactions automatically via payment sessions
  /*
  async createTransaction(transactionData: { amount: number, productId: string, description: string }): Promise<Transaction> {
    // console.log('Creating transaction with data:', transactionData)
    // console.log('API URL:', PAYMENT_API_URL)

    const response = await fetch(PAYMENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
      credentials: 'include' // Include auth cookies
    })

    // console.log('Response status:', response.status)
    // console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error('🚨 API Request Failed - Starting detailed error analysis...')

      // Clone the response to read it multiple times if needed
      const responseClone = response.clone()

      try {
        // console.log('📝 Attempting to parse error response as JSON...')
        const errorData = await response.json()
        console.error('✅ JSON Error Response Parsed:')
        console.error('- Status:', response.status, response.statusText)
        console.error('- URL:', PAYMENT_API_URL)
        console.error('- Request Data:', transactionData)
        console.error('- Full Error Response:', errorData)
        console.error('- Error Message:', errorData.message || 'No message field')
        console.error('- Error Field:', errorData.error || 'No error field')

        // If the error response has a message, use it
        const errorMessage = errorData.message || errorData.error || JSON.stringify(errorData)
        throw new Error(`API Error: ${errorMessage}`)
      } catch (parseError) {
        // console.log('❌ JSON parsing failed, trying text response...')
        console.error('Parse error:', parseError)

        try {
          const errorText = await responseClone.text()
          console.error('📄 Text Error Response:')
          console.error('- Status:', response.status, response.statusText)
          console.error('- URL:', PAYMENT_API_URL)
          console.error('- Request Data:', transactionData)
          console.error('- Response Text:', errorText)
          throw new Error(`API Error (${response.status}): ${errorText}`)
        } catch (textError) {
          console.error('💥 Failed to read response as text:', textError)
          throw new Error(`API Error (${response.status}): Unable to read error response`)
        }
      }
    }

    const data: ApiResponse<{ transaction: Transaction }> = await response.json()

    // Handle API response format as documented
    if (data.success === false) {
      throw new Error(data.message || 'Failed to create transaction')
    }

    // Return the transaction from the documented response format
    return data.transaction
  },
  */

  // Get a single transaction by ID
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const response = await fetch(`${PAYMENT_API_URL}/${transactionId}`, {
      method: 'GET',
      credentials: 'include'
    })
    
    if (response.status === 404) {
      return null
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Get Transaction API Error:', response.status, errorText)
      throw new Error(`Failed to fetch transaction: ${response.status} ${response.statusText}`)
    }
    
    const data: ApiResponse<{ transaction: Transaction }> = await response.json()
    
    if (data.success === false) {
      throw new Error(data.message || 'Failed to fetch transaction')
    }
    
    return data.transaction
  },

  // Get all transactions for vendor
  async getAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(PAYMENT_API_URL, {
      method: 'GET',
      credentials: 'include'
    })

    // Handle 404 case (no transactions found) - return empty array
    if (response.status === 404) {
      console.log('No transactions found for vendor')
      return []
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Get Transactions API Error:', response.status, errorText)
      throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`)
    }

    const data: ApiResponse<{ transactions: Transaction[] }> = await response.json()

    if (data.success === false) {
      throw new Error(data.message || 'Failed to fetch transactions')
    }

    // Handle case where transactions field might not exist
    const transactions = data.transactions || []

    return transactions.map((tx: any) => ({
      ...tx,
      // Backend now returns correct format, just add computed fields
      time: new Date(tx.createdAt || tx.transactionTime || Date.now()).toLocaleString(),
      formattedAmount: `${(tx.amount || 0).toFixed(6)} XION`
    }))
  },

  // Update transaction (system only, typically not called from frontend)
  async updateTransaction(
    transactionId: string, 
    status: Transaction['status'], 
    transactionHash: string
  ): Promise<Transaction> {
    const response = await fetch(PAYMENT_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionId,
        status,
        transactionHash
      })
    })
    
    const data: ApiResponse<{ transaction: Transaction }> = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update transaction')
    }
    
    return data.transaction
  },
}

// Payment Session API
export const paymentSessionAPI = {
  // Start a new payment session
  async startPaymentSession(sessionData: {
    productId?: string, // Optional for custom payments
    expectedAmount: string,
    sessionId: string,
    memo: string,
    vendorWallet: string
  }): Promise<PaymentSession> {
    console.log('🔧 PAYMENT SESSION DEBUG:')
    console.log('- API URL:', PAYMENT_SESSION_API_URL)
    console.log('- Session Data:', JSON.stringify(sessionData, null, 2))
    console.log('- Headers:', { 'Content-Type': 'application/json' })
    
    const response = await fetch(PAYMENT_SESSION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
      credentials: 'include' // Include auth cookies for vendor authentication //TODO check back
    })
    
    // console.log('- Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      let errorText = ''
      let errorData = null
      try {
        errorText = await response.text()
        errorData = JSON.parse(errorText)
      } catch (e) {
        // If JSON parsing fails, use the text as is
      }

      console.error('🚨 Payment Session API Error:')
      console.error('- Status:', response.status, response.statusText)
      console.error('- URL:', PAYMENT_SESSION_API_URL)
      console.error('- Request Data:', JSON.stringify(sessionData, null, 2))
      console.error('- Error Response Text:', errorText)
      console.error('- Error Response Data:', errorData)

      const errorMessage = errorData?.message || errorData?.error || errorText || `${response.status} ${response.statusText}`
      throw new Error(`Failed to start payment session: ${errorMessage}`)
    }
    
    const data = await response.json()
    console.log('📝 Payment Session API Response:', JSON.stringify(data, null, 2))
    
    // Handle the new API response format with success field
    if (data.success === false) {
      console.error('❌ Payment session creation failed:', data.message)
      throw new Error(data.message || 'Failed to start payment session')
    }
    
    // Check if we have session data - handle different response formats
    if (data.session) {
      // Response format: { session: PaymentSession }
      return data.session
    } else if (data._id) {
      // Response format: PaymentSession directly
      return data
    } else if (data.sessionId) {
      // Response format: { sessionId: string, message: string }
      // Create a minimal session object for compatibility
      return {
        _id: data.sessionId,
        sessionId: data.sessionId,
        transactionId: data.sessionId, // Use sessionId as fallback
        txHash: data.transactionHash || '',
        productId: sessionData.productId || '',
        expectedAmount: sessionData.expectedAmount,
        memo: sessionData.memo,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
        vendorId: 'unknown', // Will be populated when fetched later
        vendorWallet: sessionData.vendorWallet
      }
    } else {
      console.error('❌ Invalid API response structure:', data)
      throw new Error('Invalid API response: missing session data')
    }
  },

  // Get payment session status (public endpoint for customer payment pages)
  async getSessionStatus(sessionId: string): Promise<PaymentSession> {
    // console.log('🔍 SESSION STATUS DEBUG:')
    // console.log('- Session ID:', sessionId)
    // console.log('- API URL:', `${PAYMENT_SESSION_API_URL}/status/${sessionId}`)
    
    const response = await fetch(`${PAYMENT_SESSION_API_URL}/status/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // NOTE: No credentials for public customer access
    })
    
    // console.log('- Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('🚨 Session Status API Error:')
      console.error('- Status:', response.status, response.statusText)
      console.error('- URL:', `${PAYMENT_SESSION_API_URL}/status/${sessionId}`)
      console.error('- Session ID:', sessionId)
      console.error('- Error Response:', errorText)
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Session access denied. This payment session may have expired or be invalid.')
      } else if (response.status === 404) {
        throw new Error('Payment session not found. Please check the payment link.')
      }
      
      throw new Error(`Failed to get session status: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    // console.log('- Session Data:', data)
    
    if (data.success === false) {
      throw new Error(data.message || 'Failed to get session status')
    }
    
    return data.session || data
  },



  // Update payment session with customer email
  async updateSession(sessionId: string, email: string): Promise<PaymentSession> {
    const response = await fetch(`${PAYMENT_SESSION_API_URL}/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update session')
    }
    
    return data.session
  },

  // Complete payment session
  async completeSession(sessionId: string, transactionHash: string, status: string = 'completed'): Promise<PaymentSession> {
    const response = await fetch(`${PAYMENT_SESSION_API_URL}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, transactionHash, status })
    })
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to complete session')
    }
    
    return data.session
  },

  // Get all active sessions for vendor
  async getActiveSessions(): Promise<PaymentSession[]> {
    const response = await fetch(`${PAYMENT_SESSION_API_URL}/active`, {
      credentials: 'include' // Include auth cookies
    })

    // Handle 404 case (no active sessions found) - return empty array
    if (response.status === 404) {
      console.log('No active sessions found for vendor')
      return []
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Get Active Sessions API Error:', response.status, errorText)
      throw new Error(`Failed to fetch active sessions: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Failed to get active sessions')
    }

    // Backend returns 'activeSessions' field for active sessions
    return data.activeSessions || []
  },

  // Get recent sessions for vendor (all statuses, limited to recent ones)
  async getRecentSessions(limit: number = 5): Promise<PaymentSession[]> {
    try {
      // First try the recent endpoint
      const response = await fetch(`${PAYMENT_SESSION_API_URL}/recent?limit=${limit}`, {
        credentials: 'include' // Include auth cookies
      })

      const data = await response.json()

      if (data.success && data.sessions) {
        return data.sessions
      }
    } catch (error) {
      console.warn('Recent sessions endpoint not available, trying alternative approach')
    }

    try {
      // Fallback: Get all sessions and filter/sort on frontend
      const response = await fetch(`${PAYMENT_SESSION_API_URL}`, {
        credentials: 'include' // Include auth cookies
      })

      // Handle 404 case (no sessions found) - return empty array
      if (response.status === 404) {
        console.log('No payment sessions found for vendor')
        return []
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.sessions) {
        // Sort by creation date (newest first) and limit to recent ones
        const sortedSessions = data.sessions
          .sort((a: PaymentSession, b: PaymentSession) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, limit)

        return sortedSessions
      }
    } catch (error) {
      console.warn('All sessions endpoint failed, falling back to active sessions')
    }

    // Final fallback to active sessions
    try {
      return await this.getActiveSessions()
    } catch (error) {
      console.warn('Active sessions also failed, returning empty array')
      return []
    }
  },
}
