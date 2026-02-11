import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as authLogin, register as authRegister, verifyToken } from '../services/auth'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export default function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // ── hydrate on mount ────────────────────────────────────────
  useEffect(() => {
    const token = sessionStorage.getItem('appt_token')
    if (token) {
      const payload = verifyToken(token)
      if (payload) setUser(payload)
      else         sessionStorage.removeItem('appt_token')
    }
    setLoading(false)
  }, [])

  // ── actions ─────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { token, user: u } = await authLogin(email, password)
    sessionStorage.setItem('appt_token', token)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { user: u } = await authRegister(name, email, password)
    return u   // don't auto-login; redirect to login page
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('appt_token')
    setUser(null)
  }, [])

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </Ctx.Provider>
  )
}
