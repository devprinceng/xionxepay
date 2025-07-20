'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  CreditCard,
  Mail,
  Key,
  Server,
  Users,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw
} from 'lucide-react'

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      platformName: 'XionxePay',
      platformDescription: 'Web3 Point-of-Sale Payment System',
      supportEmail: 'support@xionxepay.com',
      maintenanceMode: false,
      allowRegistrations: true
    },
    security: {
      twoFactorRequired: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      ipWhitelist: '',
      auditLogging: true
    },
    payments: {
      defaultCurrency: 'USDC',
      transactionFee: 2.5,
      minimumTransaction: 1.00,
      maximumTransaction: 10000.00,
      autoSettlement: true,
      settlementDelay: 24
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      webhookUrl: '',
      slackIntegration: false,
      alertThreshold: 1000
    },
    api: {
      rateLimit: 1000,
      apiVersion: 'v1',
      webhookRetries: 3,
      timeoutSeconds: 30,
      corsOrigins: '*'
    }
  })

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'api', name: 'API', icon: Server }
  ]

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings)
  }

  const handleReset = () => {
    // Reset to default values
    console.log('Resetting settings')
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">System Settings</h2>
          <p className="text-gray-400">Configure platform settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="gradient" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Platform Name</label>
                    <input
                      type="text"
                      value={settings.general.platformName}
                      onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Support Email</label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Platform Description</label>
                  <textarea
                    rows={3}
                    value={settings.general.platformDescription}
                    onChange={(e) => updateSetting('general', 'platformDescription', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Maintenance Mode</p>
                      <p className="text-gray-400 text-sm">Temporarily disable platform access</p>
                    </div>
                    <button
                      onClick={() => updateSetting('general', 'maintenanceMode', !settings.general.maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.general.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Allow New Registrations</p>
                      <p className="text-gray-400 text-sm">Enable vendor registration</p>
                    </div>
                    <button
                      onClick={() => updateSetting('general', 'allowRegistrations', !settings.general.allowRegistrations)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.general.allowRegistrations ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.general.allowRegistrations ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Security Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Password Min Length</label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Max Login Attempts</label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">IP Whitelist (comma separated)</label>
                  <textarea
                    rows={3}
                    value={settings.security.ipWhitelist}
                    onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Require Two-Factor Authentication</p>
                      <p className="text-gray-400 text-sm">Mandatory 2FA for all admin users</p>
                    </div>
                    <button
                      onClick={() => updateSetting('security', 'twoFactorRequired', !settings.security.twoFactorRequired)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.security.twoFactorRequired ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.security.twoFactorRequired ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Audit Logging</p>
                      <p className="text-gray-400 text-sm">Log all admin actions</p>
                    </div>
                    <button
                      onClick={() => updateSetting('security', 'auditLogging', !settings.security.auditLogging)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.security.auditLogging ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.security.auditLogging ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Payment Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Default Currency</label>
                    <select
                      value={settings.payments.defaultCurrency}
                      onChange={(e) => updateSetting('payments', 'defaultCurrency', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                      <option value="DAI">DAI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Transaction Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.payments.transactionFee}
                      onChange={(e) => updateSetting('payments', 'transactionFee', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Minimum Transaction ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.payments.minimumTransaction}
                      onChange={(e) => updateSetting('payments', 'minimumTransaction', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Maximum Transaction ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.payments.maximumTransaction}
                      onChange={(e) => updateSetting('payments', 'maximumTransaction', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Settlement Delay (hours)</label>
                    <input
                      type="number"
                      value={settings.payments.settlementDelay}
                      onChange={(e) => updateSetting('payments', 'settlementDelay', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Auto Settlement</p>
                    <p className="text-gray-400 text-sm">Automatically settle vendor payments</p>
                  </div>
                  <button
                    onClick={() => updateSetting('payments', 'autoSettlement', !settings.payments.autoSettlement)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.payments.autoSettlement ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.payments.autoSettlement ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Notification Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      value={settings.notifications.webhookUrl}
                      onChange={(e) => updateSetting('notifications', 'webhookUrl', e.target.value)}
                      placeholder="https://your-webhook-url.com"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Alert Threshold ($)</label>
                    <input
                      type="number"
                      value={settings.notifications.alertThreshold}
                      onChange={(e) => updateSetting('notifications', 'alertThreshold', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-gray-400 text-sm">Send alerts via email</p>
                    </div>
                    <button
                      onClick={() => updateSetting('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.emailNotifications ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">SMS Notifications</p>
                      <p className="text-gray-400 text-sm">Send alerts via SMS</p>
                    </div>
                    <button
                      onClick={() => updateSetting('notifications', 'smsNotifications', !settings.notifications.smsNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.smsNotifications ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Slack Integration</p>
                      <p className="text-gray-400 text-sm">Send alerts to Slack</p>
                    </div>
                    <button
                      onClick={() => updateSetting('notifications', 'slackIntegration', !settings.notifications.slackIntegration)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.slackIntegration ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.slackIntegration ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Settings */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">API Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Rate Limit (requests/hour)</label>
                    <input
                      type="number"
                      value={settings.api.rateLimit}
                      onChange={(e) => updateSetting('api', 'rateLimit', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">API Version</label>
                    <select
                      value={settings.api.apiVersion}
                      onChange={(e) => updateSetting('api', 'apiVersion', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="v1">v1</option>
                      <option value="v2">v2 (Beta)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Webhook Retries</label>
                    <input
                      type="number"
                      value={settings.api.webhookRetries}
                      onChange={(e) => updateSetting('api', 'webhookRetries', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Timeout (seconds)</label>
                    <input
                      type="number"
                      value={settings.api.timeoutSeconds}
                      onChange={(e) => updateSetting('api', 'timeoutSeconds', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">CORS Origins</label>
                  <input
                    type="text"
                    value={settings.api.corsOrigins}
                    onChange={(e) => updateSetting('api', 'corsOrigins', e.target.value)}
                    placeholder="* or https://yourdomain.com"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminSettingsPage
