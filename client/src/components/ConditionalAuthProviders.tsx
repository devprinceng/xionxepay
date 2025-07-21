'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/auth-context'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import PaymentQRProvider from '@/contexts/PaymentQRContext'
import { VendorProvider } from '@/contexts/vendor-context'
import { ClientConditionalProviders } from '@/components/ClientConditionalProviders'

interface ConditionalAuthProvidersProps {
  children: React.ReactNode
}

export function ConditionalAuthProviders({ children }: ConditionalAuthProvidersProps) {
  const pathname = usePathname()
  
  // Check if we're on a pay page (customer-facing, no auth required)
  const isPayPage = pathname?.startsWith('/pay/')
  
  if (isPayPage) {
    // For pay pages: No vendor authentication providers, no protected route
    // Only basic functionality needed for customer payments
    return <>{children}</>
  }
  
  // For all other pages: Include full vendor authentication stack
  return (
    <AuthProvider>
      <VendorProvider>
        <PaymentQRProvider>
          <ClientConditionalProviders>
            <ProtectedRoute>{children}</ProtectedRoute>
          </ClientConditionalProviders>
        </PaymentQRProvider>
      </VendorProvider>
    </AuthProvider>
  )
}
