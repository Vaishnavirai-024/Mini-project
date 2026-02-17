import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('rai_token'))
  const [loading, setLoading] = useState(true)

  // Bootstrap — verify stored token
  useEffect(() => {
    const bootstrap = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          const { data } = await api.get('/auth/me')
          if (data.success) setUser(data.user)
        } catch {
          // token invalid
          localStorage.removeItem('rai_token')
          setToken(null)
          delete api.defaults.headers.common['Authorization']
        }
      }
      setLoading(false)
    }
    bootstrap()
  }, [token])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    if (data.success) {
      localStorage.setItem('rai_token', data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setToken(data.token)
      setUser(data.user)
    }
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    if (data.success) {
      localStorage.setItem('rai_token', data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setToken(data.token)
      setUser(data.user)
    }
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('rai_token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
