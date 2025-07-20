'use client'

import React from 'react'
import Link from 'next/link'
import { Home, BarChart3, Wallet, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function FooterNav() {
  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
    },
    {
      href: '/wallet',
      label: 'Wallet',
      icon: Wallet,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ]

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="fixed bottom-6 left-0 right-0 z-50 md:bottom-8 flex justify-center md:hidden hidden"
    >
      <div className="bg-gray-900/20 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.href}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 1.2 + (index * 0.1),
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex flex-col items-center justify-center",
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-xl",
                    "bg-gradient-to-r from-aurora-blue-500/20 to-aurora-cyan-500/20",
                    "hover:from-aurora-blue-500 hover:to-aurora-cyan-500",
                    "transition-all duration-300 ease-out",
                    "hover:scale-110 hover:shadow-lg"
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                      {item.label}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                  
                  {/* Active indicator */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-aurora-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-aurora-blue-500/10 to-aurora-cyan-500/10 rounded-2xl blur-xl -z-10"></div>
    </motion.nav>
  )
}
