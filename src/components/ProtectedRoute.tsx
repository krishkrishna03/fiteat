import { type ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactElement
  requireAdmin?: boolean
  requireSubscription?: boolean
}

export const ProtectedRoute = ({ children, requireAdmin, requireSubscription }: ProtectedRouteProps) => {
  const auth = useAuth()

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && auth.userType !== 'admin') {
    return <Navigate to="/login" replace />
  }

  if (requireSubscription && auth.user?.subscriptionStatus !== 'ACTIVE') {
    return <Navigate to="/checkout?plan=premium" replace />
  }

  return children
}
