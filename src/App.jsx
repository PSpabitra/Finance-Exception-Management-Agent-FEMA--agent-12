import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Exceptions from './pages/Exceptions'
import ExceptionDetail from './pages/ExceptionDetail'
import Upload from './pages/Upload'
import RiskRegister from './pages/RiskRegister'
import ExecutiveSummary from './pages/ExecutiveSummary'
import Chat from './pages/Chat'
import AuditLogs from './pages/AuditLogs'
import Reports from './pages/Reports'

const Protected = ({ children }) => (
  <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              fontSize: 13,
              fontFamily: '"DM Sans", system-ui',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/exceptions" element={<Protected><Exceptions /></Protected>} />
          <Route path="/exceptions/:id" element={<Protected><ExceptionDetail /></Protected>} />
          <Route path="/upload" element={<Protected><Upload /></Protected>} />
          <Route path="/risk-register" element={<Protected><RiskRegister /></Protected>} />
          <Route path="/executive-summary" element={<Protected><ExecutiveSummary /></Protected>} />
          <Route path="/chat" element={<Protected><Chat /></Protected>} />
          <Route path="/audit-logs" element={<Protected><AuditLogs /></Protected>} />
          <Route path="/reports" element={<Protected><Reports /></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
