'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Zap, Shield, BarChart3, Smartphone, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export function FeaturesSection() {
  const features = [
    {
      icon: QrCode,
      title: 'QR Code Payments',
      description: 'Generate dynamic QR codes for instant payments. Customers simply scan and pay.',
      gradient: 'from-aurora-blue-500 to-aurora-cyan-500'
    },
    {
      icon: Zap,
      title: 'Gasless Transactions',
      description: 'Powered by Xion Protocol. No gas fees, no wallet setup required.',
      gradient: 'from-aurora-cyan-500 to-aurora-teal-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built on blockchain technology with enterprise-grade security.',
      gradient: 'from-aurora-teal-500 to-aurora-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track payments, view analytics, and manage your business in real-time.',
      gradient: 'from-aurora-blue-500 to-aurora-teal-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Perfect for mobile vendors, food stalls, and on-the-go businesses.',
      gradient: 'from-aurora-cyan-500 to-aurora-blue-500'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Accept USDC and USDT from customers worldwide, instantly.',
      gradient: 'from-aurora-teal-500 to-aurora-cyan-500'
    }
  ]

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="web3-gradient-text">Why Choose</span>
            <br />
            <span className="text-white">XionxePay?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built for the future of payments, designed for today&apos;s businesses. 
            Experience the power of Web3 without the complexity.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group-hover:border-aurora-blue-500/50">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
