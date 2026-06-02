import { useEffect, useState } from 'react'
import { getAuditLogs } from '../services/api'
import { PageHeader, Spinner, Empty, Pagination } from '../components/UI'
import { ClipboardList, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const ACTION_STYLES = {
  USER_LOGIN: 'bg-success/10 text-emerald-400',
  USER_REGISTERED: 'bg-info/10 text-blue-400',
  DOCUMENT_UPLOADED: 'bg-purple-500/10 text-purple-400',
  EXCEPTIONS_DETECTED: 'bg-brand/10 text-brand',
  EXCEPTION_UPDATED: 'bg-yellow-500/10 text-yellow-400',
  COMMENT_ADDED: 'bg-cyan-500/10 text-cyan-400',
  CHAT_MESSAGE: 'bg-surface-muted text-ink-muted',
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 8

  const load = () => {
    setLoading(true)
    getAuditLogs({ limit: 1000 }).then(r => setLogs(r.data)).catch(() => toast.error('Failed to load audit logs')).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const totalPages = Math.ceil(logs.length / PAGE_SIZE)
  const paginatedLogs = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [logs])

  return (
    <div className="animate-in">
      <PageHeader title="Audit Logs" sub={`${logs.length} events recorded`}>
        <button onClick={load} className="btn-ghost"><RefreshCw size={13} /></button>
      </PageHeader>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="th">Timestamp</th>
                <th className="th">User</th>
                <th className="th">Action</th>
                <th className="th hidden md:table-cell">Entity</th>
                <th className="th hidden lg:table-cell">IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}><Spinner /></td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5}><Empty icon={ClipboardList} message="No audit events yet" /></td></tr>
              ) : paginatedLogs.map(log => (
                <tr key={log.id} className="border-b border-surface-border hover:bg-surface-muted/20 transition-colors">
                  <td className="td font-mono text-[11px] text-ink-muted">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="td">
                    <p className="text-xs font-medium text-ink">{log.user_name || 'System'}</p>
                    {log.user_role && <p className="text-[10px] text-ink-faint">{log.user_role}</p>}
                  </td>
                  <td className="td">
                    <span className={clsx('badge text-[10px]', ACTION_STYLES[log.action] || 'bg-surface-muted text-ink-muted')}>
                      {log.action}
                    </span>
                  </td>
                  <td className="td hidden md:table-cell text-xs text-ink-muted">
                    {log.entity_type ? `${log.entity_type}${log.entity_id ? ` #${log.entity_id}` : ''}` : '—'}
                  </td>
                  <td className="td hidden lg:table-cell font-mono text-[11px] text-ink-faint">
                    {log.ip_address || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && logs.length > 0 && (
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
