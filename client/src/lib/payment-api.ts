// API service for payment data management using JSON server

// Force use of local JSON server for development
const API_BASE_URL = 'http://localhost:3001'
// For production, you can uncomment the line below:
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

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

export interface Transaction {
  id: string
  hash: string
  amount: string
  amountRaw: string
  description: string
  sender: string
  recipient: string
  network: string
  customer: string
  customerWallet: string
  status: string
  timestamp: string
  time: string
  productId: string
  paymentMethod: string
  gasless: boolean
  source: string
  platform: string
}

// Payment Data API
export const paymentAPI = {
  // Create a new payment
  async createPayment(paymentData: Omit<PaymentData, 'id'>): Promise<PaymentData> {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: paymentData.txId,
        ...paymentData,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create payment')
    }
    
    return response.json()
  },

  // Get payment by ID
  async getPayment(paymentId: string): Promise<PaymentData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error('Failed to fetch payment')
      }
      
      return response.json()
    } catch (error) {
      console.error('Error fetching payment:', error)
      return null
    }
  },

  // Update payment status
  async updatePaymentStatus(
    paymentId: string, 
    status: PaymentData['status'], 
    transactionHash?: string
  ): Promise<PaymentData> {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        transactionHash,
        updatedAt: new Date().toISOString(),
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update payment status')
    }
    
    return response.json()
  },

  // Get all payments
  async getAllPayments(): Promise<PaymentData[]> {
    const response = await fetch(`${API_BASE_URL}/payments`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch payments')
    }
    
    return response.json()
  },
}

// Payment Links API
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
