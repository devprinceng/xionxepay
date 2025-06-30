import React from 'react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}