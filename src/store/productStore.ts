import { create } from 'zustand'
import { Product, Category } from '../types'
import api from '../utils/api'

interface ProductState {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
  fetchProducts: (categoryId?: string, featured?: boolean) => Promise<void>
  fetchCategories: () => Promise<void>
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (categoryId: string) => Product[]
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<Category>
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  
  fetchProducts: async (categoryId?: string, featured?: boolean) => {
    set({ loading: true, error: null })
    try {
      const params: any = {}
      if (categoryId) params.categoryId = categoryId
      if (featured) params.featured = 'true'
      
      const response = await api.get('/products', { params })
      set({ products: response.data, loading: false })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors du chargement des produits'
      set({ error: message, loading: false })
    }
  },
  
  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get('/categories')
      set({ categories: response.data, loading: false })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors du chargement des catégories'
      set({ error: message, loading: false })
    }
  },
  
  getProductById: (id: string) => {
    return get().products.find(p => p.id === id)
  },
  
  getProductsByCategory: (categoryId: string) => {
    return get().products.filter(p => p.categoryId === categoryId)
  },
  
  addProduct: async (productData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/products', productData)
      const newProduct = response.data
      set({ 
        products: [...get().products, newProduct],
        loading: false 
      })
      return newProduct
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de l\'ajout du produit'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },
  
  updateProduct: async (id: string, updates: Partial<Product>) => {
    set({ loading: true, error: null })
    try {
      await api.put(`/products/${id}`, updates)
      set({
        products: get().products.map(p =>
          p.id === id ? { ...p, ...updates } : p
        ),
        loading: false
      })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la mise à jour du produit'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },
  
  deleteProduct: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/products/${id}`)
      set({ 
        products: get().products.filter(p => p.id !== id),
        loading: false 
      })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la suppression du produit'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },
  
  addCategory: async (categoryData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/categories', categoryData)
      const newCategory = response.data
      set({ 
        categories: [...get().categories, newCategory],
        loading: false 
      })
      return newCategory
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de l\'ajout de la catégorie'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },
  
  updateCategory: async (id: string, updates: Partial<Category>) => {
    set({ loading: true, error: null })
    try {
      await api.put(`/categories/${id}`, updates)
      set({
        categories: get().categories.map(c =>
          c.id === id ? { ...c, ...updates } : c
        ),
        loading: false
      })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la mise à jour de la catégorie'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },
  
  deleteCategory: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/categories/${id}`)
      set({ 
        categories: get().categories.filter(c => c.id !== id),
        loading: false 
      })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la suppression de la catégorie'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },
}))

