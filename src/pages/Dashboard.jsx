import { useEffect, useState } from 'react'
import { getDashboard } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { AlertTriangle, TrendingDown, CheckCircle, FileText, Zap, Activity } from 'lucide-react'
import { StatCard, PageHeader, SevBadge, StatusBadge, Spinner } from '../components/UI'
import toast from 'react-hot-toast'

const SEV_COLORS = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#10b981' }
const STAT_COLORS = { OPEN: '#f97316', IN_REVIEW: '#3b82f6', RESOLVED: '#10b981', ESCALATED: '#ef4444', CLOSED: '#64748b' }
const TIP = { contentStyle: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 12 } }

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!data) return null

  const sevPie = Object.entries(data.by_severity || {}).map(([name, value]) => ({ name, value }))
  const statBar = Object.entries(data.by_status || {}).map(([name, value]) => ({ name: name.replace('_', ' '), value }))

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title={user?.role === 'CFO' ? 'CFO Dashboard' : 'Finance Controller Dashboard'}
        sub={`Welcome back, ${user?.full_name || user?.username}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard label="Total" value={data.total_exceptions} icon={AlertTriangle} color="text-brand" />
        <StatCard label="Open" value={data.open_exceptions} icon={Zap} color="text-blue-400" />
        <StatCard label="Critical" value={data.critical_exceptions} icon={TrendingDown} color="text-red-400" />
        {/* <StatCard label="Resolved / Mo." value={data.resolved_this_month} icon={CheckCircle} color="text-emerald-400" /> */}
        <StatCard label="Avg Risk" value={`${data.avg_risk_score}/10`} icon={Activity} color="text-yellow-400" />
        <StatCard label="Documents" value={data.total_documents} icon={FileText} color="text-purple-400" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend chart */}
        <div className="card p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-ink mb-4">Exception Trend — Last 7 Days</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.trend_data}>
              <defs>
                <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TIP} />
              <Area type="monotone" dataKey="count" stroke="#2563eb" fill="url(#tg)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity pie */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-ink mb-3">By Severity</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={sevPie} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {sevPie.map(e => <Cell key={e.name} fill={SEV_COLORS[e.name] || '#64748b'} />)}
              </Pie>
              <Tooltip {...TIP} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {sevPie.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: SEV_COLORS[e.name] || '#64748b' }} />
                  <span className="text-ink-muted">{e.name}</span>
                </div>
                <span className="font-mono font-semibold text-ink">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status bar */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-ink mb-4">By Status</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statBar} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip {...TIP} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {statBar.map(e => <Cell key={e.name} fill={STAT_COLORS[e.name.replace(' ', '_')] || '#64748b'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent exceptions */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-ink mb-4">Recent Exceptions</p>
          <div className="space-y-0">
            {data.recent_exceptions?.map(exc => (
              <div key={exc.id} className="flex items-center justify-between py-3 border-b border-surface-border last:border-0">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs font-medium text-ink truncate">{exc.title}</p>
                  <p className="text-[10px] text-ink-faint mt-0.5 font-mono">{exc.case_number}</p>
                </div>
                <SevBadge s={exc.severity} />
              </div>
            ))}
            {!data.recent_exceptions?.length && (
              <p className="text-sm text-ink-muted text-center py-6">No exceptions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
