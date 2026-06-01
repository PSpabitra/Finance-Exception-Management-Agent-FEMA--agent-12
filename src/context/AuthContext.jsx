import { createContext, useContext, useState, useEffect } from 'react'
import { authLogin } from '../services/api'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('fema_user')
    const t = localStorage.getItem('fema_token')
    if (u && t) { try { setUser(JSON.parse(u)) } catch {} }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const res = await authLogin({ username, password })
    const { access_token, user: u } = res.data
    localStorage.setItem('fema_token', access_token)
    localStorage.setItem('fema_user', JSON.stringify(u))
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('fema_token')
    localStorage.removeItem('fema_user')
    setUser(null)
  }

  return <Ctx.Provider value={{ user, login, logout, loading }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
