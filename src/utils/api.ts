/** API client for backend communication. */
import axios from 'axios'

function normalizeApiUrl(url: string): string {
  const trimmed = url.replace(/\/$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const API_BASE_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage')
  if (token) {
    try {
      const authData = JSON.parse(token)
      if (authData?.state?.token) {
        config.headers.Authorization = `Bearer ${authData.state.token}`
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return config
})

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api



