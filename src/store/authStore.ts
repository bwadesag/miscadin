import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'
import api from '../utils/api'

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  fetchCurrentUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', { email, password })
          const { user, token } = response.data
          set({ user, token })
        } catch (error: any) {
          const message = error.response?.data?.error || 'Erreur de connexion'
          throw new Error(message)
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        try {
          const response = await api.post('/auth/register', { name, email, password })
          const { user, token } = response.data
          set({ user, token })
        } catch (error: any) {
          const message = error.response?.data?.error || 'Erreur lors de l\'inscription'
          throw new Error(message)
        }
      },
      
      fetchCurrentUser: async () => {
        try {
          const response = await api.get('/auth/me')
          set({ user: response.data.user })
        } catch (error) {
          // If fetch fails, clear auth
          set({ user: null, token: null })
        }
      },
      
      logout: () => {
        set({ user: null, token: null })
      },
      
      isAuthenticated: () => {
        return get().user !== null && get().token !== null
      },
      
      isAdmin: () => {
        return get().user?.role === 'admin'
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

