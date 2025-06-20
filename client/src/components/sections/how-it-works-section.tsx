'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { UserPlus, QrCode, Smartphone, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create your vendor account in minutes. No complex setup required.',
      color: 'text-aurora-blue-400'
    },
    {
      icon: QrCode,
      title: 'Generate QR',
      description: 'Create QR codes for your products or services with custom amounts.',
      color: 'text-aurora-cyan-400'
    },
    {
      icon: Smartphone,
      title: 'Customer Scans',
      description: 'Customers scan your QR code and pay with their email - no wallet needed.',
      color: 'text-aurora-teal-400'
    },
    {
      icon: CheckCircle,
      title: 'Get Paid',
      description: 'Receive instant payment confirmation and track all transactions.',
      color: 'text-aurora-blue-400'
    }
  ]

  return (
    <section className="py-24 relative bg-gray-900/30">
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
            <span className="text-white">How It</span>
            <br />
            <span className="web3-gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started in minutes. Our simple 4-step process makes accepting 
            crypto payments as easy as traditional payments.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-aurora-blue-500/50 to-aurora-cyan-500/50 z-0" />
                )}
                
                <Card className="relative z-10 text-center hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                  <CardContent className="p-8">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className="mb-6 mt-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className={`w-8 h-8 ${step.color}`} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-aurora-blue-500/10 to-aurora-cyan-500/10 rounded-2xl p-8 border border-aurora-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of vendors already using XionxePay to accept 
              crypto payments seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="web3-button">
                Start Free Trial
              </button>
              <button className="px-6 py-3 border border-aurora-blue-500 text-aurora-blue-400 rounded-lg hover:bg-aurora-blue-500/10 transition-colors duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
