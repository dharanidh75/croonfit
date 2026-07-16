import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { adminApi } from '../../lib/api'

export function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('croonfit-admin-token')
      if (!token) {
        setIsAuthenticated(false)
        return
      }

      try {
        // Quick verification of the token
        await adminApi.get('/admin/stats') // Or a dedicated /admin/me endpoint
        setIsAuthenticated(true)
      } catch (err) {
        setIsAuthenticated(false)
        sessionStorage.removeItem('croonfit-admin-token')
      }
    }

    checkAuth()
  }, [])

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
