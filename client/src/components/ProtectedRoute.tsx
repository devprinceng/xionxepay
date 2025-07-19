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
  
  // Public routes that should not have any authentication logic
  const publicRoutes = ['/pay']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  const isAuthOrVendorOrAdmin =
    authRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/admin')
  return (
    <>
      {!(isAuthOrVendorOrAdmin || isPublicRoute) && <Navigation />}
      {children}
      {!(isAuthOrVendorOrAdmin || isPublicRoute) && <Footer />}
      {!(isAuthOrVendorOrAdmin || isPublicRoute) && <FooterNav />}
    </>
  )
}