import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getException, updateException, addComment, getComments } from '../services/api'
import { SevBadge, StatusBadge, RiskBar, Spinner } from '../components/UI'
import { ArrowLeft, Send, Brain, TrendingDown } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = ['OPEN', 'IN_REVIEW', 'RESOLVED', 'ESCALATED', 'CLOSED']

export default function ExceptionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exc, setExc] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    Promise.all([getException(id), getComments(id)])
      .then(([e, c]) => { setExc(e.data); setStatus(e.data.status); setComments(c.data) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatus = async () => {
    try {
      const res = await updateException(id, { status })
      setExc(res.data)
      toast.success('Status updated')
    } catch { toast.error('Update failed') }
  }

  const handleComment = async e => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      const res = await addComment(id, { comment })
      setComments([...comments, res.data])
      setComment('')
    } catch { toast.error('Failed to add comment') }
  }

  if (loading) return <Spinner />
  if (!exc) return <div className="text-ink-muted p-8">Exception not found</div>

  const rca = exc.ai_analysis?.rca

  return (
    <div className="animate-in max-w-4xl">
      <button onClick={() => navigate('/exceptions')} className="flex items-center gap-1.5 text-ink-muted hover:text-ink text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Exceptions
      </button>

      {/* Header */}
      <div className="card p-6 mb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-brand font-semibold mb-2">{exc.case_number}</p>
            <h2 className="text-lg font-display font-bold text-ink mb-2">{exc.title}</h2>
            <p className="text-sm text-ink-muted">{exc.description}</p>
          </div>
          <SevBadge s={exc.severity} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Metrics */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={14} className="text-brand" />
            <p className="text-sm font-semibold text-ink">Financial Metrics</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Metric', exc.metric_name],
              ['Actual', exc.actual_value?.toLocaleString()],
              ['Expected', exc.expected_value?.toLocaleString()],
              ['Variance %', exc.variance_pct != null ? `${exc.variance_pct?.toFixed(1)}%` : '—'],
              ['Risk Score', null],
              ['Type', exc.exception_type],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[10px] text-ink-muted uppercase tracking-wide mb-1">{l}</p>
                {l === 'Risk Score'
                  ? <RiskBar score={exc.risk_score} />
                  : <p className={`text-sm font-medium ${l === 'Variance %' && exc.variance_pct < 0 ? 'text-red-400' : 'text-ink'}`}>{v || '—'}</p>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Manage */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-ink mb-4">Manage Case</p>
          <div className="mb-4">
            <label className="label">Update Status</label>
            <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <button onClick={handleStatus} className="btn-primary">Update Status</button>
          <div className="mt-5 space-y-3">
            <div>
              <p className="label">Current Status</p>
              <StatusBadge s={exc.status} />
            </div>
            <div>
              <p className="label">Created</p>
              <p className="text-sm text-ink">{new Date(exc.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Root Cause */}
      {exc.root_cause && (
        <div className="card p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} className="text-purple-400" />
            <p className="text-sm font-semibold text-ink">AI Root Cause Analysis</p>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">{exc.root_cause}</p>
          {rca?.recommendations && (
            <>
              <p className="label mb-2">Recommendations</p>
              <div className="space-y-1.5">
                {rca.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/15">
                    <span className="text-purple-400 font-bold text-xs mt-0.5">{i + 1}</span>
                    <p className="text-xs text-ink-muted">{r}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {rca?.contributing_factors && (
            <div className="mt-3">
              <p className="label mb-2">Contributing Factors</p>
              <div className="flex flex-wrap gap-2">
                {rca.contributing_factors.map((f, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-surface-muted text-ink-muted border border-surface-border">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-ink mb-4">Comments ({comments.length})</p>
        <div className="space-y-3 mb-4">
          {comments.map(c => (
            <div key={c.id} className="p-3 rounded-xl bg-surface border border-surface-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-brand">{c.author_name || 'Unknown'}</span>
                <span className="text-[10px] text-ink-faint">{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">{c.comment}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="text-sm text-ink-faint text-center py-4">No comments yet</p>}
        </div>
        <form onSubmit={handleComment} className="flex gap-3">
          <input className="input flex-1" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment…" />
          <button type="submit" className="btn-primary px-4">
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  )
}
