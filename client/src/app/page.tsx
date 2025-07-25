import React from 'react'
import { NavigationWrapper } from '@/components/navigation-wrapper'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { HowItWorksSection } from '@/components/sections/how-it-works-section'
import { StatsSection } from '@/components/sections/stats-section'
import { FooterNav } from '@/components/footer-nav'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <NavigationWrapper />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />

      {/* <FooterNav /> */}
    </main>
  )
}
