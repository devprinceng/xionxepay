'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  User,
  Wallet,
  X,
  ChevronLeft,
  ChevronUp,
  CreditCard,
  BarChart3,
  Users,
  FileText,
  Building,
  LayoutDashboard,
  QrCode
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useVendor } from '@/contexts/vendor-context'
import { useAuth } from '@/contexts/auth-context'
import { useXion } from '@/contexts/xion-context'
import { useXionVendorSync } from '@/hooks/use-xion-vendor-sync'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hasCheckedCookie, setHasCheckedCookie] = useState(false)
  const [hasCookie, setHasCookie] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { vendorProfile, businessProfile, xionWalletAddress } = useVendor()
  const { logout } = useAuth()
  const { isConnected, xionAddress } = useXion()
  
  // Sync the Xion wallet address with the vendor context
  useXionVendorSync()
  
  // Check for xion_address cookie on mount
  useEffect(() => {
    const checkCookie = async () => {
      const Cookies = (await import('js-cookie')).default
      const xionAddressCookie = Cookies.get('xion_address')
      setHasCookie(!!xionAddressCookie)
      setHasCheckedCookie(true)
    }
    
    checkCookie()
  }, [])

  const handleLogout = async () => {
    logout();
    router.push('/signin');
  }

  const navigation = [
    { name: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
    { name: 'Products', href: '/vendor/products', icon: Package },
    { name: 'QR Generator', href: '/vendor/qr', icon: QrCode },
    { name: 'Wallet', href: '/vendor/wallet', icon: Wallet },
    { name: 'Transactions', href: '/vendor/transactions', icon: CreditCard },
    { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/vendor/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {(isConnected || hasCookie) ? (
        <>
          {/* Mobile sidebar backdrop */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-700/50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700/50">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-lg flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold web3-gradient-text">
                    XionxePay
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* User Profile */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-full flex items-center justify-center text-white font-medium">
                    {vendorProfile?.name ? (
                      vendorProfile.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{vendorProfile?.name || 'User'}</p>
                    {/* <p className="text-gray-400 text-sm">{businessProfile?.businessName || 'Vendor'}</p> */}
                    <p className="text-gray-400 text-xs">{xionWalletAddress?.slice(0, 6) + '...' + xionWalletAddress?.slice(-4) || 'Not connected'}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-aurora-blue-500/20 text-aurora-blue-400 border border-aurora-blue-500/30"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-gray-700/50 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top Header */}
            <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 h-16 flex-shrink-0">
              <div className="flex items-center justify-between h-full px-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <h1 className="text-xl font-semibold text-white">
                    {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  {/* User Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800/50 px-2 py-1 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-full flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                          {vendorProfile?.name ? (
                            vendorProfile.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm text-white">{vendorProfile?.name || 'User'}</p>
                          <p className="text-xs text-gray-400">{xionWalletAddress?.slice(0, 6) + '...' + xionWalletAddress?.slice(-4) || 'Not connected'}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-gray-900 border border-gray-700/50 text-white">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm">{vendorProfile?.name || 'User'}</p>
                          <p className="text-xs text-gray-400">{vendorProfile?.email || 'No email'}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700/50" />
                      <DropdownMenuItem className="text-sm hover:bg-gray-800 cursor-pointer" onClick={() => router.push('/vendor/settings?tab=profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm hover:bg-gray-800 cursor-pointer" onClick={() => router.push('/vendor/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm hover:bg-gray-800 cursor-pointer" onClick={() => router.push('/vendor/settings?tab=business')}>
                        <Building className="mr-2 h-4 w-4" />
                        <span>Business</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm hover:bg-gray-800 cursor-pointer" onClick={() => router.push('/vendor/wallet')}>
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Wallet: {xionWalletAddress?.slice(0, 6) + '...' + xionWalletAddress?.slice(-4) || 'Not connected'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700/50" />
                      <DropdownMenuItem className="text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
            
            {/* Page Content when connected */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </>
      ) : (
        // Show only the content without sidebar/header when not connected
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      )}
    </div>
  )
}
