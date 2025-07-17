import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'
import React from 'react'
import { AuthProvider } from '../contexts/auth-context'
import { Toaster } from 'sonner'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { VendorProvider } from '@/contexts/vendor-context'
import { XionProvider } from '@/contexts/xion-context'
import { XionAbstraxionProvider } from '@/components/xion/abstraxion-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XionxePay - Scan-to-Pay Web3 POS System',
  description: 'Smart, Web3-powered Point-of-Sale system that allows vendors to accept stablecoin payments through QR codes — no crypto wallets or blockchain knowledge required.',
  keywords: ['Web3', 'POS', 'Payment', 'QR Code', 'Stablecoin', 'USDC', 'Xion Protocol'],
  authors: [{ name: 'XionxePay Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white antialiased"
      )}>
        <div className="relative min-h-screen">
          {/* Animated background orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="floating-orb floating-orb-1" />
            <div className="floating-orb floating-orb-2" />
            <div className="floating-orb floating-orb-3" />
          </div>
          
          {/* Grid pattern overlay */}
          <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
          
          {/* Main content */}
          <div className="relative z-10">
            <Toaster position="top-center" richColors closeButton />
            <AuthProvider>
              <VendorProvider>
                <XionAbstraxionProvider>
                  <XionProvider>
                    <ProtectedRoute>{children}</ProtectedRoute>
                  </XionProvider>
                </XionAbstraxionProvider>
              </VendorProvider>
            </AuthProvider>
          </div>
        </div>
      </body>
    </html>
  )
}
