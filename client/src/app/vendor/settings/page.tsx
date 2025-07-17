'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, User, Building, Wallet, Bell, BellRing, LogOut } from 'lucide-react'
import { useXion } from '@/contexts/xion-context'
import { XionConnectButton } from '@/components/xion/xion-connect-button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useVendor } from '@/contexts/vendor-context'
import Skeleton from '@/components/ui/skeleton'
import { useSearchParams, useRouter } from 'next/navigation'

const SettingsPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || 'profile')
  const { xionAddress, isConnected, disconnectXion } = useXion()
  const {
    vendorProfile,
    businessProfile,
    loading,
    error,
    fetchVendorProfile,
    updateVendorProfile,
    fetchBusinessProfile,
    updateBusinessProfile,
  } = useVendor()

  // Local state for forms
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' })
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    businessDescription: '',
    category: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    logo: undefined as File | undefined,
  })
  
  // State for logo preview
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Define tabs before using them in useEffect
  const tabs = useMemo(() => [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ], [])

  useEffect(() => {
    fetchVendorProfile()
    fetchBusinessProfile()
    // eslint-disable-next-line
  }, [])
  
  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam, tabs])

  useEffect(() => {
    if (vendorProfile) {
      setProfileForm({
        name: vendorProfile.name || '',
        phone: vendorProfile.phone || '',
      })
    }
  }, [vendorProfile])

  useEffect(() => {
    if (businessProfile) {
      setBusinessForm((prev) => ({
        ...prev,
        businessName: businessProfile.businessName || '',
        businessDescription: businessProfile.businessDescription || '',
        category: businessProfile.category || '',
        address: businessProfile.address || '',
        city: businessProfile.city || '',
        state: businessProfile.state || '',
        country: businessProfile.country || '',
        zip: businessProfile.zip || '',
      }))
    }
  }, [businessProfile])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBusinessForm({ ...businessForm, [e.target.name]: e.target.value })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBusinessForm({ ...businessForm, logo: file })
      
      // Create a preview URL for the selected image
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setBusinessForm({ ...businessForm, logo: undefined })
      setLogoPreview(null)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateVendorProfile(profileForm)
    fetchVendorProfile()
  }

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { logo, ...rest } = businessForm;
    await updateBusinessProfile({ ...rest, ...(logo instanceof File ? { logo } : {}) });
    fetchBusinessProfile();
  }

  // Tabs are now defined earlier in the component

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Manage your account and business preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1 w-full"
        >
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      router.push(`/vendor/settings?tab=${tab.id}`)
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-aurora-blue-500/20 text-aurora-blue-400 border border-aurora-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="p-6">
            {error === 'Not Authorized' ? (
              <div className="text-center py-12">
                <div className="text-red-400 text-lg mb-4">Not Authorized. Login Again.</div>
                <Link href="/signin">
                  <Button variant="gradient">Login</Button>
                </Link>
              </div>
            ) : (
              <>
                {activeTab === 'profile' ? (
                  loading ? (
                    <div className="space-y-4">
                      <Skeleton width="60%" height={32} className="mb-2" />
                      <Skeleton width="100%" height={48} className="mb-2" />
                      <Skeleton width="100%" height={48} className="mb-2" />
                      <Skeleton width="100%" height={48} className="mb-2" />
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit}>
                      <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input
                              type="email"
                              value={vendorProfile?.email || ''}
                              disabled
                              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500 opacity-60"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={profileForm.phone}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-8 pt-6 border-t border-gray-700/50">
                        <Button type="submit" variant="gradient">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  )
                ) : (
                  activeTab === 'business' ? (
                    loading ? (
                      <div className="space-y-4">
                        <Skeleton width="60%" height={32} className="mb-2" />
                        <Skeleton width="100%" height={48} className="mb-2" />
                        <Skeleton width="100%" height={48} className="mb-2" />
                        <Skeleton width="100%" height={48} className="mb-2" />
                        <Skeleton width="100%" height={48} className="mb-2" />
                        <Skeleton width="100%" height={48} className="mb-2" />
                        <Skeleton width="100%" height={48} className="mb-2" />
                      </div>
                    ) : (
                      <form onSubmit={handleBusinessSubmit}>
                        <h2 className="text-xl font-bold text-white mb-6">Business Information</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Business Name</label>
                            <input
                              type="text"
                              name="businessName"
                              value={businessForm.businessName}
                              onChange={handleBusinessChange}
                              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Business Description</label>
                            <textarea
                              name="businessDescription"
                              value={businessForm.businessDescription}
                              onChange={handleBusinessChange}
                              rows={3}
                              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Category</label>
                              <input
                                type="text"
                                name="category"
                                value={businessForm.category}
                                onChange={handleBusinessChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Address</label>
                              <input
                                type="text"
                                name="address"
                                value={businessForm.address}
                                onChange={handleBusinessChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">City</label>
                              <input
                                type="text"
                                name="city"
                                value={businessForm.city}
                                onChange={handleBusinessChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">State</label>
                              <input
                                type="text"
                                name="state"
                                value={businessForm.state}
                                onChange={handleBusinessChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Country</label>
                              <input
                                type="text"
                                name="country"
                                value={businessForm.country}
                                onChange={handleBusinessChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Zip</label>
                              <input
                                type="text"
                                name="zip"
                                value={businessForm.zip}
                                onChange={handleBusinessChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-3">Business Logo</label>
                            <div className="flex items-center space-x-6">
                              <div className="relative group">
                                <div className="w-24 h-24 rounded-lg bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden transition-colors group-hover:border-aurora-blue-500/50">
                                  {logoPreview ? (
                                    <img 
                                      src={logoPreview} 
                                      alt="Business Logo Preview" 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : businessProfile?.logo ? (
                                    <img 
                                      src={businessProfile.logo} 
                                      alt="Business Logo" 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="text-gray-500 text-center p-2">
                                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span className="text-xs">No logo</span>
                                    </div>
                                  )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-black/70 backdrop-blur-sm text-white text-xs p-1.5 rounded">
                                    Change
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1">
                                <label className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700/50 transition-colors">
                                  <svg className="w-5 h-5 mr-2 text-aurora-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <span className="text-sm">
                                    {businessProfile?.logo ? 'Change logo' : 'Upload logo'}
                                  </span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleLogoChange} 
                                    className="hidden" 
                                  />
                                </label>
                                <p className="mt-2 text-xs text-gray-500">
                                  Recommended: 512x512px, JPG, PNG, or WebP. Max 2MB
                                </p>
                                {businessProfile?.logo && (
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setBusinessForm({...businessForm, logo: undefined})
                                      setLogoPreview(null)
                                    }}
                                    className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center"
                                  >
                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove logo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-8 pt-6 border-t border-gray-700/50">
                          <Button type="submit" variant="gradient">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    )
                  ) : (
                    activeTab === 'wallet' && (
                      <div>
                        <h2 className="text-xl font-bold text-white mb-6">Wallet Settings</h2>
                        <div className="space-y-6">
                          <div className="p-4 bg-aurora-blue-500/10 border border-aurora-blue-500/20 rounded-lg">
                            <h3 className="text-aurora-blue-300 font-medium mb-2">Xion Wallet</h3>
                            {isConnected ? (
                              <>
                                <p className="text-gray-400 text-sm mb-1">Connected Address:</p>
                                <p className="font-mono text-white text-sm bg-gray-800/50 p-2 rounded-md overflow-hidden overflow-ellipsis">
                                  {xionAddress}
                                </p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                                  onClick={() => disconnectXion()}
                                >
                                  <LogOut className="w-4 h-4 mr-2" />
                                  Disconnect Wallet
                                </Button>
                              </>
                            ) : (
                              <>
                                <p className="text-gray-400 text-sm mb-3">Connect your Xion wallet to receive payments and manage your vendor account.</p>
                                <div className="mt-2">
                                  <XionConnectButton />
                                </div>
                              </>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Preferred Stablecoin</label>
                            <select className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500">
                              <option>USDC</option>
                              <option>USDT</option>
                              <option>DAI</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      {[
                        { label: 'Payment Received', description: 'Get notified when you receive a payment' },
                        { label: 'Daily Summary', description: 'Receive daily transaction summaries' },
                        { label: 'Security Alerts', description: 'Important security notifications' },
                        { label: 'Marketing Updates', description: 'Product updates and promotions' },
                      ].map((notification) => (
                        <div key={notification.label} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{notification.label}</p>
                            <p className="text-gray-400 text-sm">{notification.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-blue-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage
