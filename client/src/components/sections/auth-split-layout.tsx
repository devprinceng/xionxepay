import React from "react";
import { motion } from "framer-motion";
import { QrCode, Zap, Shield } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Meteors } from "@/components/ui/meteors";
import Link from "next/link";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  visual?: React.ReactNode;
}

export function AuthSplitLayout({ children, visual }: AuthSplitLayoutProps) {
  return (
    <section className="relative min-h-screen flex items-center py-10 justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <Spotlight
        className="absolute -top-40 left-0 md:left-60 md:-top-20"
        fill="#3b82f6"
      />
      <BackgroundBeams className="absolute inset-0 opacity-30" />
      <Meteors number={10} className="absolute inset-0" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-aurora-blue-400 rounded-full animate-pulse" />
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-aurora-cyan-400 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-3 h-3 bg-aurora-teal-400 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-2 h-2 bg-aurora-blue-300 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <Link href="/" className="flex justify-center items-center space-x-2 mb-10 md:mb-0">
          <div className="w-8 h-8 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-lg flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold web3-gradient-text">
            XionxePay
          </span>
        </Link>
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[600px]">
          {/* Left: Form */}
          <div className="bg-transparent rounded-2xl p-8 shadow-xl border border-gray-700 backdrop-blur-md">
            {children}
          </div>
          {/* Right: Visual */}
          <div className="hidden md:flex items-center justify-center">
            {visual ? visual : <DefaultAuthVisual />}
          </div>
        </div>
      </div>
    </section>
  );
}

function DefaultAuthVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-gray-700/50 shadow-2xl glow-effect"
      >
        <div className="w-56 h-56 bg-white rounded-2xl p-4 mb-6 mx-auto">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
            <QrCode className="w-28 h-28 text-white" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Web3 POS</p>
          <p className="text-2xl font-bold web3-gradient-text mb-2">
            Scan to Pay
          </p>
          <p className="text-gray-300 text-sm">Fast, Secure, Simple</p>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-full flex items-center justify-center shadow-lg"
      >
        <Zap className="w-6 h-6 text-white" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-aurora-teal-500 to-aurora-blue-500 rounded-full flex items-center justify-center shadow-lg"
      >
        <Shield className="w-4 h-4 text-white" />
      </motion.div>
    </motion.div>
  );
}
