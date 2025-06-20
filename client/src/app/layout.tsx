import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { usePathname } from 'next/navigation'
import React from 'react'
import { AuthProvider } from '../contexts/auth-context'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XionxePay - Scan-to-Pay Web3 POS System',
  description: 'Smart, Web3-powered Point-of-Sale system that allows vendors to accept stablecoin payments through QR codes — no crypto wallets or blockchain knowledge required.',
  keywords: ['Web3', 'POS', 'Payment', 'QR Code', 'Stablecoin', 'USDC', 'Xion Protocol'],
  authors: [{ name: 'XionxePay Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const authRoutes = [
    '/register',
    '/forgot-password',
    '/reset-password',
    '/signin',
    '/verify-email',
  ]
  const isAuthOrVendor =
    authRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/vendor')
  return (
    <>
      {isAuthOrVendor && <Navigation />}
      {children}
      {isAuthOrVendor && <Footer />}
    </>
  )
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
            <ProtectedRoute>{children}</ProtectedRoute>
            </AuthProvider>
          </div>
        </div>
      </body>
    </html>
  )
}
