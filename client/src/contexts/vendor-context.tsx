"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export type VendorProfile = {
  name: string
  email: string
  phone: string
}

export type BusinessProfile = {
  businessName: string
  businessDescription: string
  category: string
  address: string
  city: string
  state: string
  country: string
  zip: string
  logo?: string
  logoPublicId?: string
}

export type VendorContextType = {
  vendorProfile: VendorProfile | null
  businessProfile: BusinessProfile | null
  xionWalletAddress: string | null
  loading: boolean
  error: string | null
  fetchVendorProfile: () => Promise<void>
  updateVendorProfile: (data: Partial<VendorProfile>) => Promise<void>
  fetchBusinessProfile: () => Promise<void>
  updateBusinessProfile: (data: { [key: string]: any }) => Promise<void>
  updateXionWalletAddress: (address: string | null) => void
}

const VendorContext = createContext<VendorContextType | undefined>(undefined)

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vendorProfile')
      return saved ? JSON.parse(saved) : null
    }
    return null
  })
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('businessProfile')
      return saved ? JSON.parse(saved) : null
    }
    return null
  })
  const [xionWalletAddress, setXionWalletAddress] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('xionWalletAddress')
    }
    return null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Helper for API calls
  const api = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true)
    setError(null)
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        credentials: 'include',
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401) {
          // Clear any existing user data
          setVendorProfile(null)
          setBusinessProfile(null)
          // Redirect to login if we're not already there
          if (!window.location.pathname.startsWith('/signin')) {
            window.location.href = '/signin?session=expired'
          }
        }
        throw new Error(data.message || 'Something went wrong')
      }
      
      setLoading(false)
      return data
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong'
      setError(errorMessage)
      setLoading(false)
      
      // Only throw non-auth errors to prevent infinite loops
      if (!errorMessage.toLowerCase().includes('authorized') && 
          !errorMessage.toLowerCase().includes('unauthorized')) {
        throw err
      }
    }
  }, [])

  // Fetch vendor profile
  const fetchVendorProfile = useCallback(async () => {
    const data = await api('/vendor/profile', { method: 'GET' })
    setVendorProfile(data.vendorProfile)
  }, [api])

  // Update vendor profile
  const updateVendorProfile = useCallback(async (profile: Partial<VendorProfile>) => {
    const data = await api('/vendor/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    setVendorProfile(data.vendor)
  }, [api])

  // Fetch business profile
  const fetchBusinessProfile = useCallback(async () => {
    const data = await api('/vendor/business', { method: 'GET' })
    setBusinessProfile(data.businessProfile)
  }, [api])

  // Update business profile (with logo upload)
  const updateBusinessProfile = useCallback(async (profile: Partial<BusinessProfile>) => {
    const formData = new FormData()
    Object.entries(profile).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any)
      }
    })
    
    setLoading(true)
    setError(null)
    try {
      const url = `${API_BASE_URL}/vendor/business`
      const res = await fetch(url, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401) {
          setVendorProfile(null)
          setBusinessProfile(null)
          if (!window.location.pathname.startsWith('/signin')) {
            window.location.href = '/signin?session=expired'
          }
        }
        throw new Error(data.message || 'Something went wrong')
      }
      
      setLoading(false)
      setBusinessProfile(data.vendor)
      return data
    } catch (err: any) {
      setLoading(false)
      setError(err.message || 'Failed to update business profile')
      throw err
    }
  }, [])

  // On mount, check login status
  React.useEffect(() => {
    fetchVendorProfile().catch((err) => {
      // Error is handled in api, nothing to do here
    })
  }, [fetchVendorProfile])

  // Function to update Xion wallet address
  const updateXionWalletAddress = useCallback((address: string | null) => {
    setXionWalletAddress(address)
  }, [])

  // Save to localStorage whenever data changes
  React.useEffect(() => {
    if (vendorProfile) {
      localStorage.setItem('vendorProfile', JSON.stringify(vendorProfile))
    } else {
      localStorage.removeItem('vendorProfile')
    }
  }, [vendorProfile])

  React.useEffect(() => {
    if (businessProfile) {
      localStorage.setItem('businessProfile', JSON.stringify(businessProfile))
    } else {
      localStorage.removeItem('businessProfile')
    }
  }, [businessProfile])

  React.useEffect(() => {
    if (xionWalletAddress) {
      localStorage.setItem('xionWalletAddress', xionWalletAddress)
    } else {
      localStorage.removeItem('xionWalletAddress')
    }
  }, [xionWalletAddress])

  // console.log(
  //   vendorProfile,
  //   businessProfile,
  //   xionWalletAddress
  // )

  const value: VendorContextType = {
    vendorProfile,
    businessProfile,
    xionWalletAddress,
    loading,
    error,
    fetchVendorProfile,
    updateVendorProfile,
    fetchBusinessProfile,
    updateBusinessProfile,
    updateXionWalletAddress,
  }

  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  )
}

export function useVendor() {
  const ctx = useContext(VendorContext)
  if (!ctx) throw new Error('useVendor must be used within VendorProvider')
  return ctx
} 