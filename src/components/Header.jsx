import { Menu, Bell } from 'lucide-react'

export default function Header({ setMobileOpen, activeLabel, activeEmail }) {
    return (
        <header className="h-[64px] bg-surface-card border-b border-surface-border flex items-center justify-between px-5 flex-shrink-0">
            <button className="lg:hidden p-2 rounded-md text-ink-muted" onClick={() => setMobileOpen(true)}>
                <Menu size={18} />
            </button>
            <p className="text-sm font-medium text-ink-muted">
                {activeLabel}
            </p>
            <div className="flex items-center gap-4">
                {/* <Bell size={15} className="text-ink-faint" /> */}
                <p className="text-xs text-ink-muted hidden sm:block">{activeEmail}</p>
            </div>
        </header>
    )
}
