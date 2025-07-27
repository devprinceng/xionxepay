'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QrCode, BarChart3, Menu, X, LogOut } from 'lucide-react'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

// Navigation component that handles authentication via API calls

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status using the same logic as vendor dashboard
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check token cookie and verify with API (same as AuthProvider)
        const Cookies = (await import('js-cookie')).default
        const token = Cookies.get('token')

        if (token) {
          // Verify token with API call (same as vendor dashboard)
          const res = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (res.ok) {
            const data = await res.json()
            if (data.vendor) {
              console.log('🔍 Navbar Auth Check (API):', {
                vendor: data.vendor.name,
                isAuthenticated: true
              })
              setIsAuthenticated(true)
              return
            }
          }
        }

        // No valid authentication found
        console.log('🔍 Navbar Auth Check:', {
          token: token ? 'present' : 'missing',
          isAuthenticated: false
        })
        setIsAuthenticated(false)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    // Check auth periodically to catch changes
    const interval = setInterval(checkAuth, 3000) // Check every 3 seconds

    // Listen for auth changes
    const handleAuthChange = () => {
      console.log('🔄 Auth change event received')
      checkAuth()
    }
    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Clear cookies manually
      const Cookies = (await import('js-cookie')).default
      Cookies.remove('token')
      Cookies.remove('xionWalletAddress')
      Cookies.remove('xion_address')

      // Update state
      setIsAuthenticated(false)

      // Dispatch auth change event
      window.dispatchEvent(new CustomEvent('auth-change'))

      // Redirect to signin
      window.location.href = '/signin'

      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  // Navigation items (currently unused but kept for future use)
  // const navItems = [
  //   { href: '/', label: 'Home', icon: QrCode },
  //   { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  // ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/20 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold web3-gradient-text">
              XionxePay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })} */}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <span className="text-xs text-gray-400">
                {/* Auth: {isAuthenticated ? 'Yes' : 'No'} */}
              </span>
            )}

            {isAuthenticated ? (
              <>
                <Link href="/vendor">
                  <Button variant="gradient" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="gradient" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/20 backdrop-blur-2xl border-t border-white/10">
            {/* {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })} */}
            <div className="pt-4 pb-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/vendor">
                    <Button variant="gradient" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsOpen(false)
                      handleLogout()
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signin">
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="gradient" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
