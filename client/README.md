# XionxePay Frontend

A modern, Web3-powered Point-of-Sale (POS) system frontend built for the Xion Protocol hackathon. This application provides a seamless QR code-based payment system with a beautiful, animated interface optimized for both merchants and customers.

## 🚀 Features

- **Next.js 14** with App Router and TypeScript
- **Responsive Design** with mobile-first approach
- **Dark Mode** with custom blue gradient color scheme
- **Animated UI** with Framer Motion and custom effects
- **Glass Morphism** design with backdrop blur effects
- **QR Code Payment Flow** mockup interface
- **Floating Navigation** with responsive footer dock
- **Web3 Aesthetic** with animated backgrounds and particle effects
- **Accessibility** focused with proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack & Package Usage

### Core Framework
- **Next.js 14.2.5** - React framework with App Router for modern web development
- **React 18.3.1** - UI library for component-based architecture
- **TypeScript 5.5.3** - Type safety and enhanced developer experience

### Styling & Design
- **Tailwind CSS 3.4.4** - Utility-first CSS framework with custom design system
- **PostCSS 8.4.39** - CSS processing and optimization
- **Autoprefixer 10.4.19** - Automatic vendor prefixing for cross-browser compatibility
- **@tailwindcss/typography 0.5.13** - Beautiful typography defaults

### Animations & Interactions
- **Framer Motion 11.2.12** - Production-ready motion library for React
  - Used for: Page transitions, hover effects, scroll animations, floating elements
- **Custom CSS Animations** - Tailwind-based animations for particles and backgrounds

### UI Components & Utilities
- **Lucide React 0.400.0** - Beautiful, customizable SVG icons
- **@radix-ui/react-slot 1.1.0** - Primitive for building flexible component APIs
- **Class Variance Authority 0.7.0** - Type-safe variant API for component styling
- **clsx 2.1.1** - Utility for constructing className strings conditionally
- **tailwind-merge 2.4.0** - Merge Tailwind CSS classes without style conflicts

### Development Tools
- **ESLint 8.57.0** - Code linting and quality assurance
- **eslint-config-next 14.2.5** - Next.js specific ESLint configuration

## 📦 Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System

### Color Palette (Aurora Theme)
- **Primary Blues**: `#3b82f6` to `#1e40af` - Main brand colors
- **Aurora Cyan**: `#06b6d4` to `#0891b2` - Accent and highlights
- **Aurora Teal**: `#14b8a6` to `#0f766e` - Secondary accents
- **Gradients**: Multi-stop gradients combining blue, cyan, and teal
- **Glass Effects**: Semi-transparent backgrounds with backdrop blur

### Typography
- **Headings**: Bold, gradient text with glow effects
- **Body**: Clean, readable text in gray-300/400
- **Interactive**: Hover states with color transitions

### Component Design Principles
- **Glass Morphism**: Translucent cards with blur effects
- **Floating Elements**: Elevated components with subtle shadows
- **Responsive**: Mobile-first design with breakpoint-specific layouts
- **Accessibility**: High contrast ratios and keyboard navigation

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── layout.tsx               # Root layout with metadata
│   │   ├── page.tsx                 # Homepage with all sections
│   │   └── globals.css              # Global styles and Tailwind imports
│   ├── components/                   # React components
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── background-beams.tsx # Animated beam background effect
│   │   │   ├── button.tsx           # Custom button with variants
│   │   │   ├── card.tsx             # Glass morphism card component
│   │   │   ├── floating-dock.tsx    # Animated navigation dock
│   │   │   ├── meteors.tsx          # Falling meteor animation
│   │   │   └── spotlight.tsx        # Animated spotlight effect
│   │   ├── sections/                # Page sections
│   │   │   ├── hero-section.tsx     # Main hero with QR mockup
│   │   │   ├── features-section.tsx # Feature grid with animations
│   │   │   ├── how-it-works-section.tsx # Step-by-step process
│   │   │   └── stats-section.tsx    # Statistics and trust indicators
│   │   ├── navigation.tsx           # Top navigation bar
│   │   ├── footer.tsx               # Main footer component
│   │   └── footer-nav.tsx           # Mobile floating navigation
│   ├── lib/                         # Utility functions
│   │   └── utils.ts                 # Tailwind merge utilities
│   └── styles/                      # Additional styles
├── public/                          # Static assets (favicon, etc.)
├── package.json                     # Dependencies and scripts
├── tailwind.config.js              # Custom Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
└── postcss.config.js               # PostCSS configuration
```

## 🎯 Key Components Built

### Page Sections

#### Hero Section (`hero-section.tsx`)
- **Animated QR Code Mockup**: Floating, rotating payment interface
- **Gradient Text Effects**: "Scan to Pay" with glow animations
- **Interactive CTAs**: Gradient buttons with hover effects
- **Feature Pills**: Gasless Payments, Mobile First, QR Code Simple
- **Trust Indicators**: USDC, USDT, Xion protocol badges
- **Responsive Layout**: Two-column grid that stacks on mobile
- **Background Effects**: Spotlight, meteors, and animated particles

#### Features Section (`features-section.tsx`)
- **Grid Layout**: 3-column responsive grid with hover animations
- **Glass Cards**: Semi-transparent cards with backdrop blur
- **Icon Integration**: Lucide React icons with gradient styling
- **Hover Effects**: Scale and glow transitions on interaction

#### How It Works Section (`how-it-works-section.tsx`)
- **Step Flow**: Visual process from scan to payment completion
- **Connected Design**: Animated connecting lines between steps
- **Interactive Cards**: Hover states with elevation changes
- **Mobile Optimization**: Stacked layout for smaller screens

#### Stats Section (`stats-section.tsx`)
- **Trust Metrics**: Transaction volume, user count, success rate
- **Animated Counters**: Number animations on scroll/load
- **Social Proof**: Vendor testimonials and usage statistics
- **Gradient Backgrounds**: Subtle background patterns

### UI Components

#### Navigation (`navigation.tsx`)
- **Glass Morphism**: Translucent header with backdrop blur
- **Mobile Menu**: Hamburger menu with smooth transitions
- **Brand Identity**: XionxePay logo with consistent styling
- **Responsive**: Adapts to different screen sizes

#### Footer Navigation (`footer-nav.tsx`)
- **Floating Dock**: Bottom-positioned navigation for mobile
- **Glass Effect**: Semi-transparent background with blur
- **Icon Navigation**: Home, Analytics, QR Code, Profile icons
- **Centered Positioning**: Perfectly centered across all devices

#### Animated UI Components
- **Spotlight** (`spotlight.tsx`): Dynamic light effect following cursor
- **Background Beams** (`background-beams.tsx`): Animated beam patterns
- **Meteors** (`meteors.tsx`): Falling particle animation
- **Floating Dock** (`floating-dock.tsx`): Animated navigation with tooltips

#### Base Components
- **Button** (`button.tsx`): Multiple variants (default, gradient, outline)
- **Card** (`card.tsx`): Glass morphism container with consistent styling

## 🚀 Scripts

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript compiler for type checking

## 🎨 Customization Guide

### Custom Color System
The project uses a custom "Aurora" color palette defined in `tailwind.config.js`:

```js
colors: {
  'aurora-blue': {
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb'
  },
  'aurora-cyan': {
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2'
  },
  'aurora-teal': {
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0f766e'
  }
}
```

### Component Patterns
- **Glass Morphism**: `bg-gray-800/50 backdrop-blur-sm border border-gray-700/50`
- **Gradient Text**: `bg-gradient-to-r from-aurora-blue-400 to-aurora-cyan-400 bg-clip-text text-transparent`
- **Glow Effects**: Custom CSS classes with box-shadow and filter effects
- **Responsive Design**: Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints

### Animation Patterns
- **Framer Motion**: Used for page transitions, hover effects, and complex animations
- **CSS Animations**: Tailwind utilities for simple animations like `animate-pulse`, `animate-bounce`
- **Custom Keyframes**: Defined in globals.css for specialized effects

## 📱 Responsive Design Strategy

### Breakpoint System
- **Mobile First**: Base styles target mobile devices (< 640px)
- **Small**: `sm:` - 640px and up (large phones, small tablets)
- **Medium**: `md:` - 768px and up (tablets)
- **Large**: `lg:` - 1024px and up (laptops, desktops)
- **Extra Large**: `xl:` - 1280px and up (large desktops)

### Mobile Optimizations
- **Touch Targets**: Minimum 44px for interactive elements
- **Navigation**: Floating footer dock for easy thumb access
- **Typography**: Responsive text scaling with `text-4xl md:text-6xl lg:text-7xl`
- **Spacing**: Increased padding on mobile (`pt-24 md:pt-16`)
- **Layout**: Grid columns stack on mobile (`lg:grid-cols-2`)

## 🔧 Development Standards

### Code Architecture
- **TypeScript**: Strict typing for all components and props
- **Component Structure**: Separation of UI components and page sections
- **Utility Functions**: Centralized in `lib/utils.ts`
- **Consistent Naming**: PascalCase for components, camelCase for functions

### Performance Optimizations
- **Next.js 14**: App Router for optimal performance and SEO
- **Framer Motion**: Optimized animations with `transform` and `opacity`
- **Tailwind CSS**: Purged CSS for minimal bundle size
- **TypeScript**: Compile-time optimizations and tree shaking

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Tab order and focus management
- **Color Contrast**: WCAG AA compliant color combinations
- **Motion Preferences**: Respects `prefers-reduced-motion`

## 🚀 Deployment Ready

### Production Build
- Optimized bundle with automatic code splitting
- Static generation for improved performance
- Image optimization with Next.js Image component
- CSS purging and minification

### Environment Setup
- TypeScript configuration for strict type checking
- ESLint configuration for code quality
- PostCSS setup for CSS processing
- Tailwind CSS with custom configuration

## 📄 Project Context

This frontend application was built for the **Xion Protocol Hackathon** as part of the XionxePay project. It demonstrates a modern approach to Web3 payment interfaces with a focus on user experience and accessibility.

### Key Achievements
- ✅ Complete responsive design system
- ✅ Animated UI with performance optimization
- ✅ TypeScript implementation with strict typing
- ✅ Mobile-first responsive design
- ✅ Accessibility compliance
- ✅ Modern React patterns with Next.js 14
