import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, AlertTriangle, Upload, ShieldAlert,
  FileText, MessageSquare, ClipboardList
} from 'lucide-react'

import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/exceptions', icon: AlertTriangle, label: 'Exceptions' },
  { to: '/upload', icon: Upload, label: 'Upload Docs' },
  { to: '/risk-register', icon: ShieldAlert, label: 'Risk Register' },
  { to: '/executive-summary', icon: FileText, label: 'Executive Summary' },
  { to: '/chat', icon: MessageSquare, label: 'Finance Chat' },
  { to: '/audit-logs', icon: ClipboardList, label: 'Audit Logs' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (to) => location.pathname.startsWith(to)
  const activeLabel = NAV.find(n => isActive(n.to))?.label || 'FEMA'

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        NAV={NAV}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          activeLabel={activeLabel}
          activeEmail={user?.email}
        />

        <main className="flex-1 overflow-auto p-5 lg:p-7 animate-in relative">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  )
}

