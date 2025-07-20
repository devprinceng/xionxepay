// API service for payment data management

// Base URL for API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const PAYMENT_API_URL = `${API_BASE_URL}/payment`
const PAYMENT_SESSION_API_URL = `${API_BASE_URL}/payment-session`

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  message?: string
  error?: string
  [key: string]: any
}

// Transaction model based on API docs
export interface Transaction {
  _id: string
  amount: number
  vendorId: string
  productId: string | { name: string, price: number }
  description: string
  transactionId: string
  transactionHash: string
  transactionTime: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  customer?: string
  customerEmail?: string
  // Additional fields for UI display
  time?: string
  formattedAmount?: string
}

// Payment Session model based on API docs
export interface PaymentSession {
  _id: string
  sessionId: string
  transactionId: string
  productId: string
  expectedAmount: string
  memo: string
  email?: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  transactionHash?: string
  createdAt: string
  updatedAt: string
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
  transactionHash?: string
}

// Payment API
export const paymentAPI = {
  // Create a new transaction
  async createTransaction(transactionData: { amount: number, productId: string, description: string }): Promise<Transaction> {
    const response = await fetch(PAYMENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
      credentials: 'include' // Include auth cookies
    })
    
    const data: ApiResponse<{ transaction: Transaction }> = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create transaction')
    }
    
    return data.transaction
  },

  // Get a single transaction by ID
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${PAYMENT_API_URL}/${transactionId}`, {
        credentials: 'include' // Include auth cookies
      })
      
      const data: ApiResponse<{ transaction: Transaction }> = await response.json()
      
      if (!data.success) {
        if (response.status === 404) {
          return null
        }
        throw new Error(data.message || 'Failed to fetch transaction')
      }
      
      return data.transaction
    } catch (error) {
      console.error('Error fetching transaction:', error)
      return null
    }
  },

  // Get all transactions for vendor
  async getAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(PAYMENT_API_URL, {
      credentials: 'include' // Include auth cookies
    })
    
    const data: ApiResponse<{ transactions: Transaction[] }> = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch transactions')
    }
    
    return data.transactions.map((tx: { transactionTime: string | number | Date; amount: any }) => ({
      ...tx,
      // Format for UI display
      time: new Date(tx.transactionTime).toLocaleString(),
      formattedAmount: `${tx.amount} XION`
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
    transactionId: string,
    productId: string,
    expectedAmount: string,
    sessionId: string,
    memo: string
  }): Promise<PaymentSession> {
    const response = await fetch(PAYMENT_SESSION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
      credentials: 'include' // Include auth cookies
    })
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to start payment session')
    }
    
    return data.session
  },

  // Get payment session status
  async getSessionStatus(sessionId: string): Promise<PaymentSession> {
    const response = await fetch(`${PAYMENT_SESSION_API_URL}/status/${sessionId}`)
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get session status')
    }
    
    return data.session
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
  async completeSession(sessionId: string, transactionHash: string): Promise<PaymentSession> {
    const response = await fetch(`${PAYMENT_SESSION_API_URL}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, transactionHash })
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
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get active sessions')
    }
    
    return data.sessions
  },
}

// Legacy Payment Links API for backward compatibility
export const paymentLinksAPI = {
  // Create a new payment link
  async createPaymentLink(paymentLink: Omit<PaymentLink, 'id'>): Promise<PaymentLink> {
    const response = await fetch(`${API_BASE_URL}/paymentLinks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: paymentLink.transactionId,
        ...paymentLink,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create payment link')
    }
    
    return response.json()
  },

  // Get all payment links
  async getAllPaymentLinks(): Promise<PaymentLink[]> {
    const response = await fetch(`${API_BASE_URL}/paymentLinks`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment links')
    }
    
    return response.json()
  },

  // Update payment link status
  async updatePaymentLinkStatus(
    linkId: string, 
    status: PaymentLink['status'], 
    transactionHash?: string
  ): Promise<PaymentLink> {
    const response = await fetch(`${API_BASE_URL}/paymentLinks/${linkId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        transactionHash,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update payment link status')
    }
    
    return response.json()
  },

  // Delete payment link
  async deletePaymentLink(linkId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/paymentLinks/${linkId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete payment link')
    }
  },
}

// Transactions API
export const transactionsAPI = {
  // Create a new transaction record
  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `TXN${Date.now()}`,
        ...transaction,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create transaction')
    }
    
    return response.json()
  },

  // Get all transactions
  async getAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }
    
    return response.json()
  },

  // Get transactions by product ID
  async getTransactionsByProduct(productId: string): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions?productId=${productId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }
    
    return response.json()
  },
}
