import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getExceptions, detectExceptions } from '../services/api'
import { SevBadge, StatusBadge, RiskBar, PageHeader, Spinner, Empty, Pagination } from '../components/UI'
import { AlertTriangle, Zap, RefreshCw, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = ['', 'OPEN', 'AWAITING_RESPONSE', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED', 'CLOSED']
const SEVERITIES = ['', 'CRITICAL', 'MATERIAL', 'WARNING', 'INFORMATIONAL']

export default function Exceptions() {
  const [exceptions, setExceptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [detecting, setDetecting] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 7

  const load = () => {
    setLoading(true)
    getExceptions({ status: filterStatus || undefined, severity: filterSeverity || undefined })
      .then(r => setExceptions(r.data))
      .catch(() => toast.error('Failed to load exceptions'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filterStatus, filterSeverity])

  const totalPages = Math.ceil(exceptions.length / PAGE_SIZE)
  const paginatedExceptions = exceptions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [filterStatus, filterSeverity, exceptions.length])

  const handleDetect = async () => {
    setDetecting(true)
    try {
      const res = await detectExceptions()
      toast.success(`AI detected ${res.data.length} new exception(s)`)
      load()
    } catch { toast.error('Detection failed') }
    finally { setDetecting(false) }
  }

  return (
    <div className="animate-in">
      <PageHeader title="Exception Cases" sub={`${exceptions.length} exceptions found`}>
        <button onClick={handleDetect} disabled={detecting} className="btn-primary">
          <Zap size={14} />
          {detecting ? 'Detecting…' : 'AI Detect'}
        </button>
        <button onClick={load} className="btn-ghost">
          <RefreshCw size={13} />
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select className="select w-auto min-w-[140px]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select className="select w-auto min-w-[140px]" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
          {SEVERITIES.map(s => <option key={s} value={s}>{s || 'All Severities'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="th">Case #</th>
                <th className="th">Title</th>
                <th className="th hidden md:table-cell">Type</th>
                <th className="th">Severity</th>
                <th className="th hidden lg:table-cell">Risk</th>
                <th className="th">Status</th>
                <th className="th hidden lg:table-cell">Variance %</th>
                <th className="th hidden lg:table-cell">Created At</th>
                <th className="th w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9}><Spinner /></td></tr>
              ) : exceptions.length === 0 ? (
                <tr><td colSpan={9}><Empty icon={AlertTriangle} message="No exceptions found. Try AI detection." /></td></tr>
              ) : paginatedExceptions.map(exc => (
                <tr key={exc.id} className="border-b border-surface-border hover:bg-surface-muted/30 transition-colors">
                  <td className="td font-mono text-brand text-xs font-semibold">{exc.case_number}</td>
                  <td className="td">
                    <p className="text-ink font-medium text-xs line-clamp-1 max-w-[200px]">{exc.title}</p>
                    <p className="text-ink-faint text-[10px] mt-0.5">{exc.metric_name}</p>
                  </td>
                  <td className="td hidden md:table-cell text-ink-muted text-xs">{exc.exception_type || '—'}</td>
                  <td className="td"><SevBadge s={exc.severity} /></td>
                  <td className="td hidden lg:table-cell"><RiskBar score={exc.risk_score} /></td>
                  <td className="td"><StatusBadge s={exc.status} /></td>
                  <td className="td hidden lg:table-cell">
                    <span className={exc.variance_pct < 0 ? 'text-red-400' : 'text-emerald-400'}>
                      {exc.variance_pct != null ? `${exc.variance_pct > 0 ? '+' : ''}${exc.variance_pct?.toFixed(1)}%` : '—'}
                    </span>
                  </td>
                  <td className="td hidden lg:table-cell text-ink-muted text-[11px] whitespace-nowrap">
                    {exc.created_at ? new Date(exc.created_at.replace(' ', 'T')).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="td">
                    <Link to={`/exceptions/${exc.id}`} className="text-ink-faint hover:text-brand transition-colors">
                      <ChevronRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && exceptions.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}
