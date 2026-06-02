import { useEffect, useState } from 'react'
import { getRiskRegister } from '../services/api'
import { SevBadge, StatusBadge, RiskBar, PageHeader, Spinner, Empty, Pagination } from '../components/UI'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { ShieldAlert, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const SEV_COLORS = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#10b981' }
const TIP = { contentStyle: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 12 } }

export default function RiskRegister() {
  const [risks, setRisks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 8

  const load = () => {
    setLoading(true)
    getRiskRegister().then(r => setRisks(r.data)).catch(() => toast.error('Failed to load risk register')).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const radarData = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => ({
    severity: sev,
    count: risks.filter(r => r.severity === sev).length,
  }))

  const totalPages = Math.ceil(risks.length / PAGE_SIZE)
  const paginatedRisks = risks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [risks.length])

  return (
    <div className="animate-in">
      <PageHeader title="Risk Register" sub={`${risks.length} active risks ranked by score`}>
        <button onClick={load} className="btn-ghost"><RefreshCw size={13} /></button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="th w-12 text-center">#</th>
                  <th className="th">Title</th>
                  <th className="th hidden md:table-cell">Type</th>
                  <th className="th">Severity</th>
                  <th className="th">Risk</th>
                  <th className="th hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6}><Spinner /></td></tr>
                ) : risks.length === 0 ? (
                  <tr><td colSpan={6}><Empty icon={ShieldAlert} message="No active risks" /></td></tr>
                ) : paginatedRisks.map((r, i) => (
                  <tr key={r.id} className="border-b border-surface-border hover:bg-surface-muted/30 transition-colors">
                    <td className="td text-center font-display font-bold text-xs" style={{ color: ((page - 1) * PAGE_SIZE + i) < 3 ? '#2563eb' : '#94a3b8' }}>
                      #{((page - 1) * PAGE_SIZE) + i + 1}
                    </td>
                    <td className="td">
                      <p className="text-xs font-medium text-ink line-clamp-1 max-w-[200px]">{r.title}</p>
                      <p className="text-[10px] font-mono text-brand mt-0.5">{r.case_number}</p>
                    </td>
                    <td className="td hidden md:table-cell text-xs text-ink-muted">{r.exception_type || '—'}</td>
                    <td className="td"><SevBadge s={r.severity} /></td>
                    <td className="td"><RiskBar score={r.risk_score} /></td>
                    <td className="td hidden sm:table-cell"><StatusBadge s={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && risks.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Radar + breakdown */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-ink mb-4">Risk Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="severity" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="Count" dataKey="count" stroke="#2563eb" fill="#2563eb" fillOpacity={0.18} strokeWidth={2} />
              <Tooltip {...TIP} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {radarData.map(d => (
              <div key={d.severity} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: SEV_COLORS[d.severity] }} />
                  <span className="text-xs font-medium" style={{ color: SEV_COLORS[d.severity] }}>{d.severity}</span>
                </div>
                <span className="text-sm font-mono font-bold text-ink">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
