"use client"

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthSplitLayout } from '@/components/sections/auth-split-layout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { KeyRound } from 'lucide-react'
import { z } from 'zod'
import { create } from 'zustand'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

const resetSchema = z.object({
  email: z.string().email({ message: 'Valid email required' }),
  otp: z.string().min(4, { message: 'OTP required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

type ResetFormState = {
  values: { email: string; otp: string; password: string; confirm: string }
  errors: Partial<{ email: string; otp: string; password: string; confirm: string }>
  loading: boolean
  success: boolean
  setValue: (field: string, value: string) => void
  setErrors: (errors: Partial<{ email: string; otp: string; password: string; confirm: string }>) => void
  setLoading: (loading: boolean) => void
  setSuccess: (success: boolean) => void
  reset: () => void
}

const useResetForm = create<ResetFormState>((set) => ({
  values: { email: '', otp: '', password: '', confirm: '' },
  errors: {},
  loading: false,
  success: false,
  setValue: (field, value) => set((state) => ({ values: { ...state.values, [field]: value } })),
  setErrors: (errors) => set(() => ({ errors })),
  setLoading: (loading) => set(() => ({ loading })),
  setSuccess: (success) => set(() => ({ success })),
  reset: () => set(() => ({ values: { email: '', otp: '', password: '', confirm: '' }, errors: {}, loading: false, success: false })),
}))

function ResetPasswordVisual() {
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
        className="bg-gradient-to-br from-aurora-blue-500 to-aurora-cyan-700 p-8 rounded-3xl shadow-2xl border border-aurora-blue-400"
      >
        <KeyRound className="w-24 h-24 text-white" />
      </motion.div>
      <p className="mt-6 text-lg text-aurora-blue-200 font-semibold">Reset Password</p>
    </motion.div>
  )
}

export default function ResetPasswordPage() {
  const { values, errors, loading, success, setValue, setErrors, setLoading, setSuccess, reset } = useResetForm()
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get('email')
  const { resetPassword, loading: authLoading, error: authError } = useAuth()

  useEffect(() => {
    if (emailFromQuery) {
      setValue('email', emailFromQuery)
    }
  }, [emailFromQuery, setValue])

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.push('/signin')
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [success, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.name, e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const result = resetSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Partial<typeof values> = {}
      for (const err of result.error.errors) {
        if (err.path[0]) fieldErrors[err.path[0] as keyof typeof values] = err.message
      }
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      await resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.password,
      })
      setLoading(false)
      toast.success('Password reset successful! Please login.')
      router.push('/signin')
      reset()
    } catch (err: any) {
      setLoading(false)
      toast.error(err?.message || 'Password reset failed')
    }
  }

  return (
    <AuthSplitLayout visual={<ResetPasswordVisual />}>
      <div className="bg-transparent backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-2">Reset your password</h2>
        <p className="text-gray-400 mb-6">Enter your new password below.</p>
        {authError && <div className="text-red-400 text-sm mb-4">{authError}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <div className="text-red-400 text-sm mt-1">{errors.email}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="otp">OTP</label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
              value={values.otp}
              onChange={handleChange}
            />
            {errors.otp && <div className="text-red-400 text-sm mt-1">{errors.otp}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="confirm">Confirm New Password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
              value={values.confirm}
              onChange={handleChange}
            />
            {errors.confirm && <div className="text-red-400 text-sm mt-1">{errors.confirm}</div>}
          </div>
          <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" disabled={loading || success || authLoading}>
            {success ? 'Password Updated!' : loading || authLoading ? 'Updating...' : 'Update Password'}
          </Button>
          {success && (
            <div className="text-green-400 text-center mt-4">Password updated! Redirecting to login...</div>
          )}
        </form>
      </div>
    </AuthSplitLayout>
  )
} 