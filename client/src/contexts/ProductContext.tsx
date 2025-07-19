'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

// Define the Product interface based on the API
export interface Product {
  _id: string
  name: string
  price: number
  description?: string
  category?: string
  createdAt: string
  isActive?: boolean
}

// Define the context interface
interface ProductContextType {
  products: Product[]
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  getProduct: (productId: string) => Promise<Product | null>
  createProduct: (productData: Partial<Product>) => Promise<Product | null>
  updateProduct: (productId: string, productData: Partial<Product>) => Promise<Product | null>
  deleteProduct: (productId: string) => Promise<boolean>
}


// Create the context with a default value
const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Provider component
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Base URL from the API documentation
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  // Helper for API calls with authentication
  const api = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const isGetRequest = !options.method || options.method === 'GET';
    if (isGetRequest) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        credentials: 'include',
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401) {
          // Handle unauthorized access
          if (!window.location.pathname.startsWith('/signin')) {
            window.location.href = '/signin?session=expired'
          }
        }
        throw new Error(data.message || 'Something went wrong')
      }
      
      setLoading(false)
      return data
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong'
      setError(errorMessage)
      setLoading(false)
      
      // Only throw non-auth errors to prevent infinite loops
      if (!errorMessage.toLowerCase().includes('authorized') && 
          !errorMessage.toLowerCase().includes('unauthorized')) {
        throw err
      }
    }
  }, [API_BASE_URL])

  // Fetch all products for the authenticated vendor
  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      // console.log('Fetching products...');
      const data = await api('/product', { method: 'GET' });
      // console.log('Products data:', data);
      if (data && data.products) {
        setProducts(data.products);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [api])

  // Get a single product by ID
  const getProduct = useCallback(async (productId: string): Promise<Product | null> => {
    try {
      const data = await api(`/product/${productId}`, { method: 'GET' })
      if (data && data.product) {
        return data.product
      }
      return null
    } catch (err: any) {
      // Error is handled in api function
      return null
    }
  }, [api])

  // Create a new product
  const createProduct = useCallback(async (productData: Partial<Product>): Promise<Product | null> => {
    try {
      // According to API doc, only name and price are required
      const payload: Record<string, any> = {
        name: productData.name,
        price: productData.price
      }
      
      // Add optional fields if they exist
      if (productData.description) payload.description = productData.description
      if (productData.category) payload.category = productData.category
      if (productData.isActive !== undefined) payload.isActive = productData.isActive
      
      const data = await api('/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (data && data.product) {
        // Add the new product to the state
        const newProduct = data.product
        setProducts(prevProducts => [...prevProducts, newProduct])
        return newProduct
      }
      return null
    } catch (err: any) {
      // Error is handled in api function
      return null
    }
  }, [api])

  // Update an existing product
  const updateProduct = useCallback(async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
    try {
      // Create payload according to API doc
      const payload: Record<string, any> = {
        productId // Required parameter
      }
      
      // Add fields that can be updated
      if (productData.name !== undefined) payload.name = productData.name
      if (productData.price !== undefined) payload.price = productData.price
      if (productData.description !== undefined) payload.description = productData.description
      if (productData.category !== undefined) payload.category = productData.category
      if (productData.isActive !== undefined) payload.isActive = productData.isActive
      
      const data = await api('/product/single', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (data && data.product) {
        // Update the product in the state
        const updatedProduct = data.product
        setProducts(prevProducts => 
          prevProducts.map(p => p._id === productId ? updatedProduct : p)
        )
        return updatedProduct
      }
      return null
    } catch (err: any) {
      // Error is handled in api function
      return null
    }
  }, [api])

  // Delete a product
  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      // For DELETE requests with a body, we need to use the fetch API directly
      const data = await api('/product/single', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      
      if (data && data.success) {
        // Remove the product from the state
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId))
        return true
      }
      return false
    } catch (err: any) {
      // Error is handled in api function
      return false
    }
  }, [api])

  // Load products when the component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        console.error('Error in initial product load:', err);
        if (isMounted) {
          setError('Failed to load products. Please refresh the page.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadProducts();
    
    return () => {
      isMounted = false;
    };
  }, [fetchProducts])

  // Context value
  const value = {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

// Custom hook to use the product context
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}
