import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, AlertTriangle, Upload, ShieldAlert,
  FileText, MessageSquare, ClipboardList, LogOut,
  Menu, X, ChevronRight, Bell, Zap
} from 'lucide-react'
import clsx from 'clsx'

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

  const handleLogout = () => { logout(); navigate('/login') }
  const isCFO = user?.role === 'CFO'
  const isActive = (to) => location.pathname.startsWith(to)

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'flex flex-col bg-surface-card border-r border-surface-border transition-all duration-200 z-50 flex-shrink-0',
        collapsed ? 'w-[66px]' : 'w-56',
        'fixed lg:relative h-full',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-surface-border min-h-[60px]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-orange-600 flex items-center justify-center text-surface font-display font-black text-sm flex-shrink-0">
            F
          </div>
          {!collapsed && (
            <div>
              <p className="font-display font-bold text-brand text-sm leading-tight">FEMA</p>
              <p className="text-[10px] text-ink-faint leading-tight">Exception Mgmt</p>
            </div>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-3 my-2 p-1.5 rounded-md text-ink-faint hover:text-ink hover:bg-surface-muted transition-colors hidden lg:flex items-center justify-center"
        >
          {collapsed ? <ChevronRight size={14} /> : <X size={14} />}
        </button>

        {/* Nav */}
        <nav className="flex-1 px-2 py-1 overflow-y-auto space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive(to)
                  ? 'bg-brand/10 text-brand border border-brand/20'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-2 pb-3 pt-2 border-t border-surface-border">
          {!collapsed && (
            <div className="px-3 py-2 mb-1">
              <p className="text-xs font-semibold text-ink truncate">{user?.full_name || user?.username}</p>
              <span className={clsx(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block',
                isCFO ? 'bg-brand/10 text-brand' : 'bg-info/10 text-blue-400'
              )}>{user?.role}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 w-full rounded-lg text-ink-muted hover:text-red-400 hover:bg-danger/5 transition-colors text-sm',
              collapsed && 'justify-center'
            )}
          >
            <LogOut size={15} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-[60px] bg-surface-card border-b border-surface-border flex items-center justify-between px-5 flex-shrink-0">
          <button className="lg:hidden p-2 rounded-md text-ink-muted" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>
          <p className="text-sm font-medium text-ink-muted">
            {NAV.find(n => isActive(n.to))?.label || 'FEMA'}
          </p>
          <div className="flex items-center gap-4">
            <Bell size={15} className="text-ink-faint" />
            <p className="text-xs text-ink-muted hidden sm:block">{user?.email}</p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-5 lg:p-7 animate-in">
          {children}
        </main>
      </div>
    </div>
  )
}
