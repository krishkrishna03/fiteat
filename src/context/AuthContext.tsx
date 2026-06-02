import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/api'
import type { ReactNode } from 'react'
import type { User } from '../types'

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  userType: 'user' | 'admin' | null
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  loginAdmin: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    phone: string,
    dob: string,
    gender: string,
    location: string,
    address: string,
    age: string,
    weight: string,
    height: string,
  ) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const defaultState: AuthContextValue = {
  isLoggedIn: false,
  user: null,
  userType: null,
  login: async () => {},
  loginAdmin: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
}

const AuthContext = createContext<AuthContextValue>(defaultState)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('fitAuthUser')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('fitAuthToken'))
  const [userType, setUserType] = useState<'user' | 'admin' | null>(() => {
    const stored = localStorage.getItem('fitAuthUserType')
    return stored === 'admin' ? 'admin' : stored === 'user' ? 'user' : null
  })

  const storeAuth = (token: string, currentUser: User, type: 'user' | 'admin') => {
    localStorage.setItem('fitAuthToken', token)
    localStorage.setItem('fitAuthUser', JSON.stringify(currentUser))
    localStorage.setItem('fitAuthUserType', type)
    setIsLoggedIn(true)
    setUser(currentUser)
    setUserType(type)
  }

  const login = async (email: string, password: string) => {
    const response = await API.post('/auth/login', { email, password })
    if (response.data?.token && response.data?.user) {
      const isAdmin = response.data.user?.isAdmin === true
      storeAuth(response.data.token, response.data.user, isAdmin ? 'admin' : 'user')
      navigate(isAdmin ? '/admin' : '/profile')
    }
  }

  const loginAdmin = async (email: string, password: string) => {
    const response = await API.post('/auth/admin-login', { email, password })
    if (response.data?.token && response.data?.user) {
      storeAuth(response.data.token, response.data.user, 'admin')
      navigate('/admin')
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    phone: string,
    dob: string,
    gender: string,
    location: string,
    address: string,
    age: string,
    weight: string,
    height: string,
  ) => {
    const response = await API.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
      phone,
      dob,
      gender,
      location,
      address,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
    })
    if (response.data?.token && response.data?.user) {
      storeAuth(response.data.token, response.data.user, 'user')
      navigate('/profile')
    }
  }

  const logout = () => {
    localStorage.removeItem('fitAuthToken')
    localStorage.removeItem('fitAuthUser')
    localStorage.removeItem('fitAuthUserType')
    setIsLoggedIn(false)
    setUser(null)
    setUserType(null)
    navigate('/login')
  }

  const refreshUser = async () => {
    try {
      const response = await API.get('/auth/me')
      if (response.data?.user) {
        const currentUser = response.data.user
        setUser(currentUser)
        localStorage.setItem('fitAuthUser', JSON.stringify(currentUser))
        const currentType = currentUser?.isAdmin ? 'admin' : 'user'
        setUserType(currentType)
        localStorage.setItem('fitAuthUserType', currentType)
      }
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      refreshUser().catch(() => {})
    }
  }, [])

  const value = useMemo(
    () => ({ isLoggedIn, user, userType, login, loginAdmin, register, logout, refreshUser }),
    [isLoggedIn, user, userType]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
