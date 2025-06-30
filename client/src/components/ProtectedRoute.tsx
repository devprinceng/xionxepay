"use client"

import { Footer } from "./footer"
import { FooterNav } from "./footer-nav"
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
  const isAuthOrVendorOrAdmin =
    authRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/admin')
  return (
    <>
      {!isAuthOrVendorOrAdmin && <Navigation />}
      {children}
      {!isAuthOrVendorOrAdmin && <Footer />}
      {!isAuthOrVendorOrAdmin && <FooterNav />}
    </>
  )
}