import React from 'react'
import { AuthProvider } from '../../contexts/auth-context'

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <AuthProvider>

      {children}
      </AuthProvider>
    </div>
  )
} 