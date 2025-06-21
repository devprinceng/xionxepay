'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingDockProps {
  items: {
    title: string
    icon: React.ReactNode
    href: string
  }[]
  className?: string
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1 }}
      className={cn(
        "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50",
        "bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2",
        "shadow-2xl glow-effect",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        {items.map((item, index) => (
          <motion.a
            key={item.title}
            href={item.href}
            whileHover={{ scale: 1.2, y: -8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-aurora-blue-500/20 to-aurora-cyan-500/20 rounded-xl flex items-center justify-center hover:from-aurora-blue-500 hover:to-aurora-cyan-500 transition-all duration-300">
              {item.icon}
            </div>
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
            >
              {item.title}
            </motion.div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}
