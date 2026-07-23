import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, userId, name, email: userEmail } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ userId, name, email: userEmail }))
    setUser({ userId, name, email: userEmail })
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { token, userId, name: userName, email: userEmail } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ userId, name: userName, email: userEmail }))
    setUser({ userId, name: userName, email: userEmail })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}