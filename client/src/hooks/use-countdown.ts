import { useState, useEffect, useCallback } from 'react'

export interface CountdownResult {
  timeLeft: {
    minutes: number
    seconds: number
    totalSeconds: number
  }
  isExpired: boolean
  formattedTime: string
}

export function useCountdown(expiresAt: string | Date): CountdownResult {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime()
    const expiry = new Date(expiresAt).getTime()
    const difference = expiry - now

    if (difference <= 0) {
      setIsExpired(true)
      return {
        minutes: 0,
        seconds: 0,
        totalSeconds: 0
      }
    }

    const totalSeconds = Math.floor(difference / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return {
      minutes,
      seconds,
      totalSeconds
    }
  }, [expiresAt])

  useEffect(() => {
    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
      
      if (newTimeLeft.totalSeconds <= 0) {
        setIsExpired(true)
      }
    }

    // Update immediately
    updateTimer()

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [calculateTimeLeft])

  const formattedTime = `${timeLeft.minutes}:${timeLeft.seconds.toString().padStart(2, '0')}`

  return {
    timeLeft,
    isExpired,
    formattedTime
  }
}

export function useCountdownFromCreated(createdAt: string | Date, durationMinutes: number = 10): CountdownResult {
  const expiresAt = new Date(new Date(createdAt).getTime() + durationMinutes * 60 * 1000)
  return useCountdown(expiresAt)
}
