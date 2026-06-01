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
              background: '#161c26',
              color: '#e2eaf5',
              border: '1px solid #1e2736',
              fontSize: 13,
              fontFamily: '"DM Sans", system-ui',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#161c26' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#161c26' } },
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
