import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getExecutiveSummary } from '../services/api'
import { PageHeader, Spinner } from '../components/UI'
import { FileText, RefreshCw, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const HEALTH_STYLES = {
  HEALTHY: { bg: 'bg-success/10 border-success/20', text: 'text-emerald-400', icon: '✓' },
  AT_RISK: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: '~' },
  CRITICAL: { bg: 'bg-danger/10 border-danger/20', text: 'text-red-400', icon: '!' },
  UNKNOWN: { bg: 'bg-surface-muted border-surface-border', text: 'text-ink-muted', icon: '?' },
}

export default function ExecutiveSummary() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'Finance Controller') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const generate = async () => {
    setLoading(true)
    try {
      const res = await getExecutiveSummary()
      setData(res.data)
    } catch { toast.error('Failed to generate summary') }
    finally { setLoading(false) }
  }

  const hs = HEALTH_STYLES[data?.overall_health] || HEALTH_STYLES.UNKNOWN

  return (
    <div className="animate-in w-full">
      <PageHeader title="Executive Summary" sub="AI-generated CFO-level financial exception report">
        <button onClick={generate} disabled={loading} className="btn-primary">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Generating…' : 'Generate with AI'}
        </button>
      </PageHeader>

      {!data && !loading && (
        <div className="card p-16 text-center border-dashed">
          <FileText size={40} className="text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">Click "Generate with AI" to create a summary from current exception data</p>
        </div>
      )}

      {loading && (
        <div className="card p-16 text-center">
          <div className="w-10 h-10 border-2 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-ink-muted">Generating AI-powered executive summary…</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4 slide-in">
          {/* Health banner */}
          <div className={clsx('card p-5 flex items-center gap-4 border', hs.bg)}>
            <div className={clsx('w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold flex-shrink-0', hs.bg, hs.text)}>
              {hs.icon}
            </div>
            <div>
              <p className={clsx('text-lg font-display font-bold', hs.text)}>Financial Health: {data.overall_health || 'UNKNOWN'}</p>
              <p className="text-xs text-ink-muted mt-0.5">Period: {data.period}</p>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Exceptions', value: data.total_exceptions, color: 'text-brand' },
              { label: 'Critical', value: data.critical_exceptions, color: 'text-red-400' },
              { label: 'Resolved', value: data.resolved_exceptions, color: 'text-emerald-400' },
              { label: 'Avg Risk', value: `${data.avg_risk_score?.toFixed(1)}/10`, color: 'text-yellow-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-4 text-center">
                <p className={clsx('text-2xl font-display font-bold', color)}>{value}</p>
                <p className="text-[10px] text-ink-muted uppercase tracking-wide mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Summary text */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-ink mb-3">Executive Overview</p>
            <p className="text-sm text-ink-muted leading-relaxed">{data.summary_text}</p>
          </div>

          {/* Highlights + Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} className="text-emerald-400" />
                <p className="text-sm font-semibold text-ink">Key Highlights</p>
              </div>
              <div className="space-y-2">
                {(data.highlights || []).map((h, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-success/5 border border-success/10">
                    <span className="text-emerald-400 text-xs mt-0.5">•</span>
                    <p className="text-xs text-ink-muted">{h}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-brand" />
                <p className="text-sm font-semibold text-ink">Key Risks</p>
              </div>
              <div className="space-y-2">
                {(data.key_risks || []).map((r, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-brand/5 border border-brand/10">
                    <span className="text-brand text-xs mt-0.5">•</span>
                    <p className="text-xs text-ink-muted">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {(data.recommendations || []).length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={14} className="text-purple-400" />
                <p className="text-sm font-semibold text-ink">AI Recommendations</p>
              </div>
              <div className="space-y-2">
                {data.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/15">
                    <span className="text-purple-400 font-bold text-xs mt-0.5 font-mono">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-xs text-ink-muted">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
