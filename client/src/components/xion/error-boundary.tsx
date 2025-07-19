'use client'

import React, { ReactNode, Component, ErrorInfo } from 'react'
import { toast } from 'sonner'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class XionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Xion connection error:', error, errorInfo)
    toast.error('Failed to connect to Xion network. Using offline mode.')
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-amber-900/20 border border-amber-700 rounded-md my-2">
          <p className="text-amber-400">
            Unable to connect to Xion network. Using offline mode.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default XionErrorBoundary
