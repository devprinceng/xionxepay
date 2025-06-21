"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthSplitLayout } from '@/components/sections/auth-split-layout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { z } from 'zod'
import { create } from 'zustand'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

const step1Schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

const step2Schema = z.object({
  businessName: z.string().min(2, { message: 'Business name is required' }),
  businessDescription: z.string().min(10, { message: 'Business description is required' }),
  category: z.string().min(2, { message: 'Category is required' }),
  metaAccountEmail: z.string().email({ message: 'Meta account email is invalid' })
})

const step3Schema = z.object({
  phone: z.string().min(6, { message: 'Phone is required' }),
  address: z.string().min(2, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
  zip: z.string().min(2, { message: 'Zip is required' })
})

type RegisterFormState = {
  values: {
    name: string
    email: string
    password: string
    confirm: string
    businessName: string
    businessDescription: string
    category: string
    metaAccountEmail: string
    phone: string
    address: string
    city: string
    state: string
    country: string
    zip: string
  }
  errors: Partial<Record<keyof RegisterFormState['values'], string>>
  loading: boolean
  setValue: (field: string, value: string) => void
  setErrors: (errors: Partial<Record<keyof RegisterFormState['values'], string>>) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

const useRegisterForm = create<RegisterFormState>((set) => ({
  values: {
    name: '',
    email: '',
    password: '',
    confirm: '',
    businessName: '',
    businessDescription: '',
    category: '',
    metaAccountEmail: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
  },
  errors: {},
  loading: false,
  setValue: (field, value) => set((state) => ({ values: { ...state.values, [field]: value } })),
  setErrors: (errors) => set(() => ({ errors })),
  setLoading: (loading) => set(() => ({ loading })),
  reset: () => set(() => ({
    values: {
      name: '',
      email: '',
      password: '',
      confirm: '',
      businessName: '',
      businessDescription: '',
      category: '',
      metaAccountEmail: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    },
    errors: {},
    loading: false
  })),
}))

function RegisterVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-gradient-to-br from-aurora-blue-500 to-aurora-cyan-700 p-8 rounded-3xl shadow-2xl border border-aurora-blue-400"
      >
        <UserPlus className="w-24 h-24 text-white" />
      </motion.div>
      <p className="mt-6 text-lg text-aurora-blue-200 font-semibold">Create Account</p>
    </motion.div>
  )
}

export default function RegisterPage() {
  const { values, errors, loading, setValue, setErrors, setLoading, reset } = useRegisterForm()
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { register, loading: authLoading, error: authError } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.name, e.target.value)
  }

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const result = step1Schema.safeParse({
      name: values.name,
      email: values.email,
      password: values.password,
      confirm: values.confirm,
    })
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormState['values'], string>> = {}
      for (const err of result.error.errors) {
        if (err.path[0]) fieldErrors[err.path[0] as keyof RegisterFormState['values']] = err.message
      }
      setErrors(fieldErrors)
      return
    }
    setStep(2)
  }

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const result = step2Schema.safeParse({
      businessName: values.businessName,
      businessDescription: values.businessDescription,
      category: values.category,
      metaAccountEmail: values.metaAccountEmail,
    })
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormState['values'], string>> = {}
      for (const err of result.error.errors) {
        if (err.path[0]) fieldErrors[err.path[0] as keyof RegisterFormState['values']] = err.message
      }
      setErrors(fieldErrors)
      return
    }
    setStep(3)
  }

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const result = step3Schema.safeParse({
      phone: values.phone,
      address: values.address,
      city: values.city,
      state: values.state,
      country: values.country,
      zip: values.zip,
    })
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormState['values'], string>> = {}
      for (const err of result.error.errors) {
        if (err.path[0]) fieldErrors[err.path[0] as keyof RegisterFormState['values']] = err.message
      }
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      await register({
        ...values,
        // Remove confirm field for backend
        confirm: undefined,
      } as any)
      setLoading(false)
      toast.success('Registration successful! Please verify your email.')
      router.push('/verify-email')
      reset()
      setStep(1)
    } catch (err: any) {
      setLoading(false)
      toast.error(err?.message || 'Registration failed')
    }
  }

  return (
    <AuthSplitLayout visual={<RegisterVisual />}>
      <div className='bg-transparent backdrop-blur-md'>
        <h2 className="text-3xl font-bold mb-2">Create your account</h2>
        <p className="text-gray-400 mb-6">Start accepting Web3 payments in minutes.</p>
        {authError && <div className="text-red-400 text-sm mb-4">{authError}</div>}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleStep1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="text-red-400 text-sm mt-1">{errors.name}</div>}
              </div>
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
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="confirm">Confirm Password</label>
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
            </div>
            <Button type="submit" variant="gradient" size="lg" className="w-full mt-4" disabled={loading || authLoading}>
              Continue
            </Button>
          </form>
        )}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleStep2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" htmlFor="businessName">Business Name</label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  autoComplete="organization"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.businessName}
                  onChange={handleChange}
                />
                {errors.businessName && <div className="text-red-400 text-sm mt-1">{errors.businessName}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="businessDescription">Business Description</label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  required
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.businessDescription}
                  onChange={handleChange}
                />
                {errors.businessDescription && <div className="text-red-400 text-sm mt-1">{errors.businessDescription}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.category}
                  onChange={handleChange}
                />
                {errors.category && <div className="text-red-400 text-sm mt-1">{errors.category}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="metaAccountEmail">Meta Account Email</label>
                <input
                  id="metaAccountEmail"
                  name="metaAccountEmail"
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.metaAccountEmail}
                  onChange={handleChange}
                />
                {errors.metaAccountEmail && <div className="text-red-400 text-sm mt-1">{errors.metaAccountEmail}</div>}
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="secondary" className="w-1/2" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" variant="gradient" size="lg" className="w-1/2" disabled={loading || authLoading}>
                Continue
              </Button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form className="space-y-4" onSubmit={handleStep3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="text-red-400 text-sm mt-1">{errors.phone}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="text-red-400 text-sm mt-1">{errors.address}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.city}
                  onChange={handleChange}
                />
                {errors.city && <div className="text-red-400 text-sm mt-1">{errors.city}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  autoComplete="address-level1"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.state}
                  onChange={handleChange}
                />
                {errors.state && <div className="text-red-400 text-sm mt-1">{errors.state}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="country">Country</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  autoComplete="country"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.country}
                  onChange={handleChange}
                />
                {errors.country && <div className="text-red-400 text-sm mt-1">{errors.country}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="zip">Zip</label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  autoComplete="postal-code"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                  value={values.zip}
                  onChange={handleChange}
                />
                {errors.zip && <div className="text-red-400 text-sm mt-1">{errors.zip}</div>}
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="secondary" className="w-1/2" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit" variant="gradient" size="lg" className="w-1/2" disabled={loading || authLoading}>
                {loading || authLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="text-aurora-blue-400 hover:underline">Login</Link>
        </div>
      </div>
    </AuthSplitLayout>
  )
} 