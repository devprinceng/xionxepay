"use client"

import React, { useState, Suspense } from 'react'
import { AuthSplitLayout } from '@/components/sections/auth-split-layout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Loader2, MailCheck } from 'lucide-react'
import { z } from 'zod'
import { create } from 'zustand'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' })
})

type VerifyEmailState = {
  otp: string
  errors: Partial<{ otp: string }>
  setOtp: (otp: string) => void
  setErrors: (errors: Partial<{ otp: string }>) => void
  reset: () => void
}

const useVerifyEmailForm = create<VerifyEmailState>((set) => ({
  otp: '',
  errors: {},
  setOtp: (otp) => set(() => ({ otp })),
  setErrors: (errors) => set(() => ({ errors })),
  reset: () => set(() => ({ otp: '', errors: {} })),
}))

function VerifyEmailVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-gradient-to-br from-aurora-cyan-500 to-aurora-blue-700 p-8 rounded-3xl shadow-2xl border border-aurora-blue-400"
      >
        <MailCheck className="w-24 h-24 text-white" />
      </motion.div>
      <p className="mt-6 text-lg text-aurora-blue-200 font-semibold">Email Verification</p>
    </motion.div>
  )
}

function VerifyEmailPageContent() {
  const { otp, errors, setOtp, setErrors, reset } = useVerifyEmailForm()
  const { sendResetOTP, verifyEmail, loading: authLoading, error } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get('email') || ''
  const otpFromQuery = searchParams.get('otp') || ''
  const [email, setEmail] = useState(emailFromQuery)
  const [success, setSuccess] = useState(false)
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)

  // Prefill OTP and email from query params
  React.useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery)
    if (otpFromQuery) setOtp(otpFromQuery)
  }, [emailFromQuery, otpFromQuery, setOtp])

  const handleResend = async () => {
    setResent(false)
    setLoading(true)
    try {
      await sendResetOTP(email)
      setResent(true)
      toast.success('Verification code resent! Check your email.')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to resend verification code')
    }
    setLoading(false)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const result = otpSchema.safeParse({ otp })
    if (!result.success) {
      setErrors({ otp: result.error.errors[0].message })
      return
    }
    setLoading(true)
    try {
      await verifyEmail(email, otp)
      setLoading(false)
      toast.success('Email verified! You can now sign in.')
      router.push('/signin')
      reset()
    } catch (err: any) {
      setLoading(false)
      toast.error(err?.message || 'Verification failed')
    }
  }

  return (
    <AuthSplitLayout visual={<VerifyEmailVisual />}>
      <div className="bg-transparent backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-2">Verify your email</h2>
        <p className="text-gray-400 mb-6">Check your inbox and enter the 6-digit code we sent to your email address.</p>
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        {success ? (
          <div className="text-green-400 text-center mb-4">Email verified! You can now log in.</div>
        ) : (
          <form className="space-y-4" onSubmit={handleVerify}>
            <div>
              <label className="block text-sm mb-1" htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500 tracking-widest text-center text-lg"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                autoComplete="one-time-code"
              />
              {errors.otp && <div className="text-red-400 text-sm mt-1">{errors.otp}</div>}
            </div>
            <input type="hidden" name="email" value={email} />
            <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" disabled={loading || authLoading}>
              {loading || authLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
        )}
        <Button onClick={handleResend} variant="link" size="sm" className="w-full mt-4" disabled={loading || authLoading}>
          {resent ? 'Verification Link Sent!' : 'Resend Verification Code'}
        </Button>
      </div>
    </AuthSplitLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-aurora-blue-300"><Loader2 className='animate-spin'/></div>}>
      <VerifyEmailPageContent />
    </Suspense>
  )
} 