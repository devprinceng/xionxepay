'use client'

import React from 'react'
import { Navigation } from './navigation'

// Simple navigation wrapper
// The Navigation component handles auth detection via API calls
export function NavigationWrapper(): JSX.Element {
  return <Navigation />
}
