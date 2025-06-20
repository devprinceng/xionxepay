"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthSplitLayout } from '@/components/sections/auth-split-layout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { RefreshCcw } from 'lucide-react'
import { z } from 'zod'
import { create } from 'zustand'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
})
const codeSchema = z.object({
  code: z.string().length(6, { message: 'Code must be 6 digits' })
})

type ForgotFormState = {
  step: number
  email: string
  code: string
  errors: Partial<{ email: string; code: string }>
  loading: boolean
  sent: boolean
  setStep: (step: number) => void
  setEmail: (email: string) => void
  setCode: (code: string) => void
  setErrors: (errors: Partial<{ email: string; code: string }>) => void
  setLoading: (loading: boolean) => void
  setSent: (sent: boolean) => void
  reset: () => void
}

const useForgotForm = create<ForgotFormState>((set) => ({
  step: 1,
  email: '',
  code: '',
  errors: {},
  loading: false,
  sent: false,
  setStep: (step) => set(() => ({ step })),
  setEmail: (email) => set(() => ({ email })),
  setCode: (code) => set(() => ({ code })),
  setErrors: (errors) => set(() => ({ errors })),
  setLoading: (loading) => set(() => ({ loading })),
  setSent: (sent) => set(() => ({ sent })),
  reset: () => set(() => ({ step: 1, email: '', code: '', errors: {}, loading: false, sent: false })),
}))

function ForgotPasswordVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ rotate: [0, 360, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="bg-gradient-to-br from-aurora-cyan-500 to-aurora-blue-700 p-8 rounded-3xl shadow-2xl border border-aurora-blue-400"
      >
        <RefreshCcw className="w-24 h-24 text-white" />
      </motion.div>
      <p className="mt-6 text-lg text-aurora-blue-200 font-semibold">Forgot Password?</p>
    </motion.div>
  )
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const {
    step, email, code, errors, loading, sent,
    setStep, setEmail, setCode, setErrors, setLoading, setSent, reset
  } = useForgotForm()
  const { sendResetOTP, loading: authLoading, error: authError } = useAuth()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const result = emailSchema.safeParse({ email })
    if (!result.success) {
      setErrors({ email: result.error.errors[0].message })
      return
    }
    setLoading(true)
    try {
      await sendResetOTP(email)
      setSent(true)
      setLoading(false)
      toast.success('OTP sent to your email!')
      router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setLoading(false)
      toast.error(err?.message || 'Failed to send OTP')
    }
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const result = codeSchema.safeParse({ code })
    if (!result.success) {
      setErrors({ code: result.error.errors[0].message })
      return
    }
    // In a real app, you would verify the code with the backend here or on the reset password page
    setStep(3)
  }

  return (
    <AuthSplitLayout visual={<ForgotPasswordVisual />}>
      <div className="bg-transparent backdrop-blur-md">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold mb-2">Forgot your password?</h2>
            <p className="text-gray-400 mb-6">Enter your email and we&apos;ll send you a reset code.</p>
            {authError && <div className="text-red-400 text-sm mb-4">{authError}</div>}
            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <div>
                <label className="block text-sm mb-1" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {errors.email && <div className="text-red-400 text-sm mt-1">{errors.email}</div>}
              </div>
              <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" disabled={loading || sent || authLoading}>
                {sent ? 'Code Sent!' : loading || authLoading ? 'Sending...' : 'Send Reset Code'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/signin" className="text-aurora-blue-400 hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold mb-2">Enter Verification Code</h2>
            <p className="text-gray-400 mb-6">We&apos;ve sent a 6-digit code to <span className="text-aurora-blue-300">{email}</span>. Enter it below to verify your email.</p>
            <form className="space-y-4" onSubmit={handleCodeSubmit}>
              <div>
                <label className="block text-sm mb-1" htmlFor="code">Verification Code</label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500 tracking-widest text-center text-lg"
                  value={code}
                  onChange={e => {
                    // Only allow digits, max 6
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setCode(val)
                  }}
                  onWheel={e => e.currentTarget.blur()} // Prevent scroll increment/decrement
                  autoComplete="one-time-code"
                />
                {errors.code && <div className="text-red-400 text-sm mt-1">{errors.code}</div>}
              </div>
              <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" disabled={loading || authLoading}>
                {loading || authLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/signin" className="text-aurora-blue-400 hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthSplitLayout>
  )
} 