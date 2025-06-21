import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USDC'): string {
  return `${amount.toFixed(2)} ${currency}`
}

export function truncateAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function generateQRData(paymentId: string, amount: number, description: string): string {
  return JSON.stringify({
    paymentId,
    amount,
    description,
    timestamp: Date.now()
  })
}
