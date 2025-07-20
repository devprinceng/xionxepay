'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Building,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

interface Vendor {
  id: string
  name: string
  businessName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  category: string
  status: 'active' | 'pending' | 'suspended'
  joinDate: string
  totalTransactions: number
  totalRevenue: number
  isVerified: boolean
}

const AdminVendorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  // Mock vendors data
  const [vendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'John Doe',
      businessName: 'Coffee Corner',
      email: 'john@coffeecorner.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      category: 'Food & Beverage',
      status: 'active',
      joinDate: '2024-01-15',
      totalTransactions: 1234,
      totalRevenue: 45678.90,
      isVerified: true
    },
    {
      id: '2',
      name: 'Sarah Smith',
      businessName: 'Pizza Palace',
      email: 'sarah@pizzapalace.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      category: 'Food & Beverage',
      status: 'pending',
      joinDate: '2024-01-14',
      totalTransactions: 0,
      totalRevenue: 0,
      isVerified: false
    },
    {
      id: '3',
      name: 'Mike Johnson',
      businessName: 'Book Store',
      email: 'mike@bookstore.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      category: 'Retail',
      status: 'active',
      joinDate: '2024-01-13',
      totalTransactions: 567,
      totalRevenue: 12345.67,
      isVerified: true
    },
    {
      id: '4',
      name: 'Lisa Brown',
      businessName: 'Tech Repair',
      email: 'lisa@techrepair.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      category: 'Services',
      status: 'suspended',
      joinDate: '2024-01-12',
      totalTransactions: 234,
      totalRevenue: 8901.23,
      isVerified: true
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'suspended':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
          <h2 className="text-2xl font-bold text-white mb-2">Vendor Management</h2>
          <p className="text-gray-400">Monitor and manage all registered vendors</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'suspended'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Vendors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Vendor</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Business</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Location</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Revenue</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{vendor.name}</p>
                          <p className="text-gray-400 text-sm">ID: {vendor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{vendor.businessName}</p>
                      <p className="text-gray-400 text-sm">{vendor.category}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-300 text-sm">{vendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-300 text-sm">{vendor.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300 text-sm">{vendor.city}, {vendor.state}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(vendor.status)}
                        <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                          {vendor.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">${vendor.totalRevenue.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">{vendor.totalTransactions} transactions</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedVendor(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Vendor Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(null)}>
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Name:</span> <span className="text-white">{selectedVendor.name}</span></p>
                  <p><span className="text-gray-400">Email:</span> <span className="text-white">{selectedVendor.email}</span></p>
                  <p><span className="text-gray-400">Phone:</span> <span className="text-white">{selectedVendor.phone}</span></p>
                  <p><span className="text-gray-400">Verified:</span> <span className={selectedVendor.isVerified ? 'text-green-400' : 'text-red-400'}>{selectedVendor.isVerified ? 'Yes' : 'No'}</span></p>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Business Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Business:</span> <span className="text-white">{selectedVendor.businessName}</span></p>
                  <p><span className="text-gray-400">Category:</span> <span className="text-white">{selectedVendor.category}</span></p>
                  <p><span className="text-gray-400">Address:</span> <span className="text-white">{selectedVendor.address}</span></p>
                  <p><span className="text-gray-400">Location:</span> <span className="text-white">{selectedVendor.city}, {selectedVendor.state}, {selectedVendor.country}</span></p>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Account Status</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Status:</span> <span className={`capitalize ${getStatusColor(selectedVendor.status).split(' ')[0]}`}>{selectedVendor.status}</span></p>
                  <p><span className="text-gray-400">Join Date:</span> <span className="text-white">{selectedVendor.joinDate}</span></p>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Performance</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Total Revenue:</span> <span className="text-white">${selectedVendor.totalRevenue.toLocaleString()}</span></p>
                  <p><span className="text-gray-400">Transactions:</span> <span className="text-white">{selectedVendor.totalTransactions}</span></p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="gradient">Approve Vendor</Button>
              <Button variant="outline">Edit Details</Button>
              <Button variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/20">
                Suspend Account
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminVendorsPage
