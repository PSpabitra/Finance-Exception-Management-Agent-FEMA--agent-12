import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ── Severity badge ─────────────────────────────────────────────────────────
const SEV = {
  CRITICAL: 'bg-danger/10 text-red-400 border border-danger/30',
  HIGH: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  MEDIUM: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  LOW: 'bg-success/10 text-emerald-400 border border-success/30',
}
const STAT = {
  OPEN: 'bg-orange-500/10 text-orange-400 border border-orange-400/30',
  IN_REVIEW: 'bg-info/10 text-blue-400 border border-info/30',
  RESOLVED: 'bg-success/10 text-emerald-400 border border-success/30',
  ESCALATED: 'bg-danger/10 text-red-400 border border-danger/30',
  CLOSED: 'bg-surface-muted text-ink-muted border border-surface-border',
}

export function SevBadge({ s }) {
  return <span className={clsx('badge', SEV[s] || 'bg-surface-muted text-ink-muted')}>{s}</span>
}
export function StatusBadge({ s }) {
  return <span className={clsx('badge', STAT[s] || 'bg-surface-muted text-ink-muted')}>{s?.replace('_', ' ')}</span>
}

// ── Risk bar ─────────────────────────────────────────────────────────────────
export function RiskBar({ score }) {
  const pct = Math.min((score / 10) * 100, 100)
  const color = score >= 8 ? 'bg-danger' : score >= 6 ? 'bg-orange-500' : score >= 4 ? 'bg-yellow-500' : 'bg-success'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 bg-surface-muted rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-ink-muted">{score?.toFixed(1)}</span>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card p-5 flex items-center gap-4 hover:border-surface-muted transition-colors">
      <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', color + '/10')}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-xs text-ink-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-display font-bold text-ink mt-0.5">{value}</p>
        {sub && <p className="text-xs text-ink-faint mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Page header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, sub, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
      <div>
        <h1 className="text-xl font-display font-bold text-ink">{title}</h1>
        {sub && <p className="text-sm text-ink-muted mt-1">{sub}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function Empty({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-ink-muted">
      <Icon size={40} className="mb-3 text-ink-faint" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-7 h-7 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
    </div>
  )
}

// ── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-surface-border px-4 py-3 bg-surface">
      <p className="text-xs text-ink-muted">
        Page <span className="font-medium text-ink">{currentPage}</span> of <span className="font-medium text-ink">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          className="btn-ghost h-7 w-7 p-0 flex items-center justify-center disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        <button
          className="btn-ghost h-7 w-7 p-0 flex items-center justify-center disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

