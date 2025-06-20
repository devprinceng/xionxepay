"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

// Types for vendor/user (customize as needed)
export type Vendor = {
  id?: string
  name: string
  email: string
  businessName: string
  businessDescription: string
  category: string
  metaAccountEmail: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zip: string
  verified?: boolean
}

export type AuthContextType = {
  user: Vendor | null
  loading: boolean
  error: string | null
  register: (data: Partial<Vendor> & { password: string }) => Promise<any>
  login: (data: { email: string; password: string }) => Promise<any>
  logout: () => Promise<void>
  sendVerifyOtp: (vendorID: string) => Promise<any>
  verifyEmail: (vendorID: string, otp: string) => Promise<any>
  sendResetOTP: (email: string) => Promise<any>
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => Promise<any>
  setUser: (user: Vendor | null) => void
  setError: (err: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper for API calls
  const api = useCallback(async (url: string, options: RequestInit) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Something went wrong')
      setLoading(false)
      return data
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
      throw err
    }
  }, [])

  // Register
  const register = useCallback(async (data: Partial<Vendor> & { password: string }) => {
    return api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }, [api])

  // Login
  const login = useCallback(async (data: { email: string; password: string }) => {
    const res = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (res.vendor) setUser(res.vendor)
    return res
  }, [api])

  // Logout
  const logout = useCallback(async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [api])

  // Send verify OTP
  const sendVerifyOtp = useCallback(async (vendorID: string) => {
    return api('/api/auth/sendVerifyOtp', {
      method: 'POST',
      body: JSON.stringify({ vendorID }),
    })
  }, [api])

  // Verify email
  const verifyEmail = useCallback(async (vendorID: string, otp: string) => {
    return api('/api/auth/verifyEmail', {
      method: 'POST',
      body: JSON.stringify({ vendorID, otp }),
    })
  }, [api])

  // Send reset OTP
  const sendResetOTP = useCallback(async (email: string) => {
    return api('/api/auth/sendResetOTP', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }, [api])

  // Reset password
  const resetPassword = useCallback(async (data: { email: string; otp: string; newPassword: string }) => {
    return api('/api/auth/resetPassword', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }, [api])

  const value: AuthContextType = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    sendResetOTP,
    resetPassword,
    setUser,
    setError,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
} 