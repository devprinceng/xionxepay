"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

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
  verifyEmail: (email: string, otp: string) => Promise<any>
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
  const api = useCallback(async (endpoint: string, options: RequestInit) => {
    setLoading(true)
    setError(null)
    try {
      const url = `${API_BASE_URL}${endpoint}`
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
    return api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }, [api])

  // Login
  const login = useCallback(async (data: { email: string; password: string }) => {
    const res = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (res.vendor) setUser(res.vendor)
    return res
  }, [api])

  // Logout
  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' })
    setUser(null)
  }, [api])

  // Send verify OTP
  const sendVerifyOtp = useCallback(async (vendorID: string) => {
    return api('/auth/sendVerifyOtp', {
      method: 'POST',
      body: JSON.stringify({ vendorID }),
    })
  }, [api])

  // Verify email - Updated to match API doc format
  const verifyEmail = useCallback(async (email: string, otp: string) => {
    return api(`/auth/verify-email?otp=${otp}&email=${email}`, {
      method: 'POST',
    })
  }, [api])

  // Send reset OTP - Updated to match API doc
  const sendResetOTP = useCallback(async (email: string) => {
    return api('/auth/send-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }, [api])

  // Reset password - Updated to match API doc
  const resetPassword = useCallback(async (data: { email: string; otp: string; newPassword: string }) => {
    return api('/auth/reset-password', {
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