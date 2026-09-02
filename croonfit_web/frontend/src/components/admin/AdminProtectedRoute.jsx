import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../../store'

export function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const { user, token: firebaseToken } = useStore()

  useEffect(() => {
    // Path 1: User is already logged in via Firebase as ADMIN role
    // Their Firebase token is valid for all admin API calls — let them straight through
    if (user?.role === 'ADMIN' && firebaseToken) {
      setIsAuthenticated(true)
      return
    }

    // Path 2: Legacy admin session token (from /admin/login username+password)
    const adminToken = sessionStorage.getItem('croonfit-admin-token')
    if (adminToken) {
      setIsAuthenticated(true)
      return
    }

    // Neither — redirect to admin login
    setIsAuthenticated(false)
  }, [user, firebaseToken])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#888888]">Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
