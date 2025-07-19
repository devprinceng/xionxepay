"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { VendorProvider } from '@/contexts/vendor-context'
import { ProductProvider } from '@/contexts/ProductContext'

interface ClientConditionalProvidersProps {
  children: React.ReactNode
}

export function ClientConditionalProviders({ children }: ClientConditionalProvidersProps) {
  const pathname = usePathname()
  
  // Routes that should NOT have vendor authentication
  const publicRoutes = ['/pay']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // If it's a public route (like /pay), don't wrap with vendor providers
  if (isPublicRoute) {
    return <>{children}</>
  }
  
  // For all other routes, wrap with vendor providers as usual
  return (
    <VendorProvider>
      <ProductProvider>
        {children}
      </ProductProvider>
    </VendorProvider>
  )
}
