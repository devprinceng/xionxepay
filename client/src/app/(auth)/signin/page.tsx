"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthSplitLayout } from '@/components/sections/auth-split-layout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { z } from 'zod'
import { create } from 'zustand'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

const signinSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

type SigninFormState = {
  values: { email: string; password: string }
  errors: Partial<{ email: string; password: string }>
  loading: boolean
  setValue: (field: string, value: string) => void
  setErrors: (errors: Partial<{ email: string; password: string }>) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

const useSigninForm = create<SigninFormState>((set) => ({
  values: { email: '', password: '' },
  errors: {},
  loading: false,
  setValue: (field, value) => set((state) => ({ values: { ...state.values, [field]: value } })),
  setErrors: (errors) => set(() => ({ errors })),
  setLoading: (loading) => set(() => ({ loading })),
  reset: () => set(() => ({ values: { email: '', password: '' }, errors: {}, loading: false })),
}))

function LoginVisual() {
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
        className="bg-gradient-to-br from-aurora-blue-500 to-aurora-teal-700 p-8 rounded-3xl shadow-2xl border border-aurora-blue-400"
      >
        <Lock className="w-24 h-24 text-white" />
      </motion.div>
      <p className="mt-6 text-lg text-aurora-blue-200 font-semibold">Secure Login</p>
    </motion.div>
  )
}

export default function LoginPage() {
  const { values, errors, loading, setValue, setErrors, setLoading, reset } = useSigninForm()
  const router = useRouter()
  const { login, loading: authLoading, error: authError } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.name, e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const result = signinSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Partial<{ email: string; password: string }> = {}
      for (const err of result.error.errors) {
        if (err.path[0]) fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message
      }
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      await login(values)
      setLoading(false)
      toast.success('Login successful!')
      router.push('/vendor')
      reset()
    } catch (err: any) {
      setLoading(false)
      toast.error(err?.message || 'Login failed')
    }
  }

  return (
    <AuthSplitLayout visual={<LoginVisual />}>
      <div className="bg-transparent backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-2">Sign in to your account</h2>
        <p className="text-gray-400 mb-6">Welcome back! Please login to continue.</p>
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
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
          </div>
          <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" disabled={loading || authLoading}>
            {loading || authLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400 flex flex-col gap-2">
          <Link href="/forgot-password" className="text-aurora-blue-400 hover:underline">Forgot password?</Link>
          <span>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-aurora-blue-400 hover:underline">Register</Link>
          </span>
        </div>
      </div>
    </AuthSplitLayout>
  )
} 