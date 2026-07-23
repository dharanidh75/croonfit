import axios from 'axios'
import { useStore } from '../store'

// Base configuration for customer API
const api = axios.create({
  baseURL: '/api' 
})

// Customer API Interceptor
api.interceptors.request.use((config) => {
  const token = useStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Base configuration for admin API
export const adminApi = axios.create({
  baseURL: '/api'
})

// Admin API Interceptor
adminApi.interceptors.request.use((config) => {
  const adminToken = sessionStorage.getItem('croonfit-admin-token')
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }
  return config
})

export default api
