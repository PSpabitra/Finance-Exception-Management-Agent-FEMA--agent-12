import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('fema_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('fema_token')
    localStorage.removeItem('fema_user')
    window.location.href = '/login'
  }
  return Promise.reject(err)
})

// Auth
export const authLogin = d => api.post('/api/auth/login', d)
export const authRegister = d => api.post('/api/auth/register', d)
export const authMe = () => api.get('/api/auth/me')

// Dashboard
export const getDashboard = () => api.get('/api/dashboard')

// Documents
export const uploadDoc = fd => api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getDocs = () => api.get('/api/documents')

// Exceptions
export const getExceptions = p => api.get('/api/exceptions', { params: p })
export const getException = id => api.get(`/api/exceptions/${id}`)
export const updateException = (id, d) => api.put(`/api/exceptions/${id}`, d)
export const addComment = (id, d) => api.post(`/api/exceptions/${id}/comment`, d)
export const getComments = id => api.get(`/api/exceptions/${id}/comments`)
export const detectExceptions = () => api.post('/api/exceptions/detect/run')

// Core
export const getExecutiveSummary = () => api.get('/api/executive-summary')
export const getRiskRegister = () => api.get('/api/risk-register')
export const sendChat = d => api.post('/api/chat', d)
export const getAuditLogs = p => api.get('/api/audit-logs', { params: p })
export const getPolicies = () => api.get('/api/policies')
export const getAvailableReports = () => api.get('/api/reports/available')
export const generateReport = d => api.post('/api/reports/generate', d, { responseType: 'blob' })

export default api
