import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, X, LogOut } from 'lucide-react'

export default function Sidebar({
    NAV,
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    user,
    handleLogout
}) {
    const location = useLocation()
    const isActive = (to) => location.pathname.startsWith(to)
    const isCFO = user?.role === 'CFO'

    return (
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
    )
}
