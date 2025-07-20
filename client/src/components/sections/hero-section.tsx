'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { QrCode, Zap, Shield, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { Spotlight } from '@/components/ui/spotlight'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Meteors } from '@/components/ui/meteors'
import Link from 'next/link'

export function HeroSection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 md:pt-16 overflow-hidden">
      {/* Enhanced Background Effects */}
      <Spotlight className="absolute -top-40 left-0 md:left-60 md:-top-20" fill="#3b82f6" />
      <BackgroundBeams className="absolute inset-0 opacity-30" />
      <Meteors number={15} className="absolute inset-0" />

      {/* Additional animated elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-aurora-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-aurora-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-aurora-teal-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-aurora-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid xl:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-aurora-blue-500/20 to-aurora-cyan-500/20 border border-aurora-blue-500/30 mb-6"
            >
              <Zap className="w-4 h-4 text-aurora-blue-400 mr-2" />
              <span className="text-sm font-medium text-aurora-blue-300">
                Powered by Xion Protocol
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="web3-gradient-text text-glow">
                Scan to Pay
              </span>
              <br />
              <span className="text-white">
                Web3 Made Simple
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
            >
              Accept stablecoin payments through QR codes. No crypto wallets, 
              no blockchain knowledge required. Just scan, pay, and go.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {[
                { icon: Shield, text: 'Gasless Payments' },
                { icon: Smartphone, text: 'Mobile First' },
                { icon: QrCode, text: 'QR Code Simple' },
              ].map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.text}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50"
                  >
                    <Icon className="w-4 h-4 text-aurora-blue-400" />
                    <span className="text-sm text-gray-300">{feature.text}</span>
                  </div>
                )
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col gap-4"
            >
              <Link href="/register">
                <Button variant="gradient" size="xl" className="glow-effect">
                  Start Accepting Payments
                </Button>
              </Link>
              {/* <Link href="/vendor">
                <Button variant="outline" size="xl">
                  View Demo Dashboard
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="xl" className="border-red-500/30 text-red-400 hover:bg-red-500/20">
                  Admin Panel
                </Button>
              </Link> */}
              
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 pt-8 border-t border-gray-700/50"
            >
              <p className="text-sm text-gray-400 mb-4">Trusted by vendors worldwide</p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-2xl font-bold web3-gradient-text">USDC</div>
                <div className="text-2xl font-bold web3-gradient-text">USDT</div>
                <div className="text-2xl font-bold web3-gradient-text">Xion</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main QR Code Mockup */}
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-gray-700/50 shadow-2xl glow-effect"
              >
                {/* Mock QR Code */}
                <div className="w-64 h-64 bg-white rounded-2xl p-4 mb-6 mx-auto">
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                </div>
                
                {/* Payment Info */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Payment Amount</p>
                  <p className="text-3xl font-bold web3-gradient-text mb-4">
                    $25.00 USDC
                  </p>
                  <p className="text-gray-300 text-sm">
                    Coffee & Pastry
                  </p>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-20 -top-4 -right-4 w-12 h-12 xl:w-16 xl:h-16 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Zap className="w-6 h-6 xl:w-8 xl:h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute z-20 -bottom-4 -left-4 w-12 h-12 xl:w-16 xl:h-16 bg-gradient-to-r from-aurora-teal-500 to-aurora-blue-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Shield className="w-6 h-6 xl:w-8 xl:h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
