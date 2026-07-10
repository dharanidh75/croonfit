import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../lib/api'
import toast from 'react-hot-toast'

export function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminApi.post('/admin/login', { username, password })
      localStorage.setItem('croonfit-admin-token', res.data.access_token)
      toast.success('Login successful')
      navigate('/admin')
    } catch (err) {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 border border-border shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">
            CROONFIT<span className="text-muted text-sm ml-2">ADMIN</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field border-border border"
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field border-border border"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full h-12 mt-4">
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  )
}
