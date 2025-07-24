'use client'

import React, { useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'
import { useCountdown } from '@/hooks/use-countdown'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  expiresAt: string | Date
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  onExpired?: () => void
  className?: string
  showIcon?: boolean
}

export function CountdownTimer({
  expiresAt,
  status,
  onExpired,
  className = '',
  showIcon = true
}: CountdownTimerProps) {
  const { timeLeft, isExpired, formattedTime } = useCountdown(expiresAt)

  // Call onExpired callback when timer expires
  useEffect(() => {
    if (isExpired && status === 'pending' && onExpired) {
      onExpired()
    }
  }, [isExpired, status, onExpired])

  // Don't show timer for completed or failed payments
  if (status === 'completed' || status === 'failed') {
    return null
  }

  // Show expired state
  if (isExpired || status === 'expired') {
    return (
      <div className={`flex items-center space-x-1 text-orange-400 ${className}`}>
        {showIcon && <AlertTriangle className="w-3 h-3" />}
        <span className="text-xs font-medium">Expired</span>
      </div>
    )
  }

  // Show countdown for pending/processing payments
  const isUrgent = timeLeft.totalSeconds <= 120 // Less than 2 minutes
  const isCritical = timeLeft.totalSeconds <= 60 // Less than 1 minute

  return (
    <motion.div
      className={`flex items-center space-x-1 ${className}`}
      animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
      transition={isCritical ? { duration: 1, repeat: Infinity } : {}}
    >
      {showIcon && (
        <Clock 
          className={`w-3 h-3 ${
            isCritical 
              ? 'text-red-400' 
              : isUrgent 
                ? 'text-orange-400' 
                : 'text-yellow-400'
          }`} 
        />
      )}
      <span 
        className={`text-xs font-medium ${
          isCritical 
            ? 'text-red-400' 
            : isUrgent 
              ? 'text-orange-400' 
              : 'text-yellow-400'
        }`}
      >
        {formattedTime}
      </span>
    </motion.div>
  )
}

// Alternative component that calculates expiry from createdAt + duration
interface CountdownFromCreatedProps {
  createdAt: string | Date
  durationMinutes?: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  onExpired?: () => void
  className?: string
  showIcon?: boolean
}

export function CountdownFromCreated({
  createdAt,
  durationMinutes = 10,
  status,
  onExpired,
  className = '',
  showIcon = true
}: CountdownFromCreatedProps) {
  const expiresAt = new Date(new Date(createdAt).getTime() + durationMinutes * 60 * 1000)
  
  return (
    <CountdownTimer
      expiresAt={expiresAt}
      status={status}
      onExpired={onExpired}
      className={className}
      showIcon={showIcon}
    />
  )
}
