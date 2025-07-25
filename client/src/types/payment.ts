// Payment-related TypeScript interfaces and types

export interface PaymentLinkData {
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
  txHash?: string
  expiresAt?: string // Add expiration timestamp
}

export interface QRGenerationData {
  amount: string
  description: string
  productId?: string
  productName?: string
}

export interface CustomPaymentData {
  amount: string
  description: string
}

export interface ProductPaymentData {
  productId: string
  productName: string
  amount: string
}

export interface PaymentFormData {
  selectedProduct: string
  customAmount: string
  description: string
  showCustomForm: boolean
}

export interface QRPreviewData {
  qrCodeData: string | null
  isGenerating: boolean
}

export interface PaymentContextState {
  paymentLinks: PaymentLinkData[]
  isGenerating: boolean
  userXionAddress: string | null
}

export interface VendorWalletInfo {
  address: string | null
  isConnected: boolean
  businessName?: string
}

export interface PaymentSessionData {
  sessionId: string
  transactionId: string
  productId: string
  expectedAmount: string
  memo: string
  vendorWallet: string
}

export interface TransactionData {
  amount: number
  productId: string
  description: string
}

// Form validation types
export interface PaymentFormErrors {
  amount?: string
  description?: string
  product?: string
  wallet?: string
}

export interface PaymentFormValidation {
  isValid: boolean
  errors: PaymentFormErrors
}

// QR Modal specific types
export interface QRModalData {
  isOpen: boolean
  qrCodeData: string
  paymentLink: string
  amount: string
  productName: string
  description?: string
  status?: PaymentLinkData['status']
}

// Payment status update types
export interface PaymentStatusUpdate {
  paymentLinkId: string
  status: PaymentLinkData['status']
  transactionHash?: string
}

// Wallet connection event types
export interface WalletConnectionEvent {
  address: string
  isConnected: boolean
}

export interface PaymentCompletionEvent {
  transactionHash: string
  txId: string
  amount: string
  recipient: string
}

// API response types
export interface CreateTransactionResponse {
  success: boolean
  transaction: {
    transactionId: string
    amount: number
    productId: string
    description: string
    vendorId: string
    status: string
    createdAt: string
    updatedAt: string
  }
  message?: string
}

export interface CreatePaymentSessionResponse {
  success: boolean
  sessionId: string
  message: string
  session?: {
    _id: string
    sessionId: string
    transactionId: string
    productId: string
    expectedAmount: string
    memo: string
    status: string
    createdAt: string
    updatedAt: string
    expiresAt: string
    vendorWallet: string
    transactionHash?: string
    txHash?: string
  }
}

export interface CreateProductResponse {
  success: boolean
  product: {
    _id: string
    name: string
    price: number
    vendorId: string
    createdAt: string
    updatedAt: string
  }
  message?: string
}

// Error types
export interface PaymentError {
  code: string
  message: string
  details?: any
}

export interface APIError {
  success: false
  message: string
  error?: string
}

// Utility types
export type PaymentStatus = PaymentLinkData['status']
export type PaymentMethod = 'product' | 'custom'
export type QRCodeSize = 'small' | 'medium' | 'large'

// Countdown timer types
export interface CountdownTimerProps {
  expiresAt: string | Date
  status: PaymentStatus
  onExpired?: () => void
  className?: string
  showIcon?: boolean
}

export interface CountdownResult {
  timeLeft: {
    minutes: number
    seconds: number
    totalSeconds: number
  }
  isExpired: boolean
  formattedTime: string
}

// Session data types for pay page
export interface PaymentSessionData {
  _id: string
  sessionId: string
  transactionId: string
  productId: string
  expectedAmount: string
  memo: string
  status: PaymentStatus
  createdAt: string
  updatedAt: string
  expiresAt: string
  vendorWallet: string
  txHash?: string
  transactionHash?: string
}

// Constants
export const PAYMENT_STATUSES = {
  PENDING: 'pending' as const,
  PROCESSING: 'processing' as const,
  COMPLETED: 'completed' as const,
  FAILED: 'failed' as const,
  EXPIRED: 'expired' as const,
}

export const QR_CODE_SIZES = {
  SMALL: 150,
  MEDIUM: 200,
  LARGE: 300,
} as const

export const PAYMENT_EXPIRY_TIME = 10 * 60 * 1000 // 10 minutes in milliseconds
