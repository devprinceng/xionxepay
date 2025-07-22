'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Package, DollarSign, Search, Filter, Loader2, AlertTriangle, RefreshCw } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useProducts, Product } from '@/contexts/ProductContext'
import { toast } from 'sonner'
const ProductsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [initialLoad, setInitialLoad] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  
  // Get products and methods from context
  const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()


  const [formData, setFormData] = useState({
    name: '',
    price: ''
  })

  // No categories needed as per API docs

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only name and price are required as per API docs
    
    // Validate required fields according to API doc
    if (!formData.name || !formData.price) {
      toast.error('Product name and price are required')
      return
    }
    
    try {
      if (editingProduct) {
        // Update existing product
        const result = await updateProduct(editingProduct._id, {
          name: formData.name,
          price: parseFloat(formData.price)
        })
        
        if (result) {
          toast.success('Product updated successfully')
          setEditingProduct(null)
        }
      } else {
        // Add new product
        const result = await createProduct({
          name: formData.name,
          price: parseFloat(formData.price)
        })
        
        if (result) {
          toast.success('Product created successfully')
        }
      }

      // Reset form
      setFormData({ name: '', price: '' })
      setShowAddForm(false)
    } catch (err) {
      toast.error('An error occurred while saving the product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString()
    })
    setShowAddForm(true)
  }

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!productToDelete) return
    
    try {
      const success = await deleteProduct(productToDelete)
      if (success) {
        toast.success('Product deleted successfully')
      }
    } catch (err) {
      toast.error('Failed to delete product')
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean | undefined) => {
    try {
      const result = await updateProduct(id, { isActive: !currentStatus })
      if (result) {
        toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      }
    } catch (err) {
      toast.error('Failed to update product status')
    }
  }

  // Effect to refresh products when needed
  useEffect(() => {
    fetchProducts().finally(() => {
      setInitialLoad(false)
    })
  }, [fetchProducts])

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    // Sort by creation date (newest first)
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  // Loading state - only show full screen loader on initial load
  if (loading && initialLoad) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading your products...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 text-center max-w-md">{error}</p>
        <Button 
          onClick={() => fetchProducts()} 
          variant="outline"
          className="mt-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Try Again
        </Button>
      </div>
    )
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
            <h2 className="text-2xl font-bold text-white mb-2">Products</h2>
            <p className="text-gray-400">Manage your product catalog and pricing</p>
          </div>
          <Button 
            variant="gradient" 
            onClick={() => {
              setShowAddForm(true)
              setEditingProduct(null)
              setFormData({ name: '', price: '' })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
          />
        </div>
        {/* <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select> */}
      </motion.div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                    placeholder="e.g., Espresso Coffee"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-aurora-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="gradient">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingProduct(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product) => (
            <Card key={product._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-aurora-blue-500 to-aurora-cyan-500 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">

                  {/* //TODO fix eidt and delete button */}
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-1 text-gray-400 hover:text-aurora-blue-400 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(product._id)
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-aurora-blue-400" />
                  <span className="text-xl font-bold text-aurora-blue-400">
                    {product.price}
                  </span>
                </div>
                {/* <button
                  onClick={() => toggleActive(product._id, product.isActive)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    product.isActive
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </button> */}
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Package className="w-12 h-12 text-gray-400" />
          <p className="text-gray-400">No products found. Create your first product to get started.</p>
          <div className="flex space-x-4">
            <Button 
              onClick={() => setShowAddForm(true)}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
            <Button 
              variant="outline" 
              onClick={() => fetchProducts()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="border-gray-700 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ProductsPage
