"use client"

import { Footer } from "./footer"
import { Navigation } from "./navigation"
import { usePathname } from "next/navigation"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const authRoutes = [
    '/register',
    '/forgot-password',
    '/reset-password',
    '/signin',
    '/verify-email',
  ]
  const isAuthOrVendor =
    authRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/vendor')
  return (
    <>
      {!isAuthOrVendor && <Navigation />}
      {children}
      {!isAuthOrVendor && <Footer />}
    </>
  )
}