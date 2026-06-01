import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const u = await login(form.username, form.password)
      toast.success(`Welcome, ${u.full_name || u.username}`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally { setLoading(false) }
  }

  const fill = (u, p) => setForm({ username: u, password: p })

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Card */}
        <div className="card p-8 shadow-card slide-in">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-orange-600 rounded-2xl flex items-center justify-center font-display font-black text-lg text-surface mb-3 shadow-glow">
              F
            </div>
            <h1 className="font-display font-bold text-xl text-ink">Sign in to FEMA</h1>
            <p className="text-xs text-ink-muted mt-1">Finance Exception Management Agent</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input className="input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="e.g. cfo_user" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={14} /></>}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-surface rounded-xl border border-surface-border">
            <p className="text-xs text-ink-muted font-semibold mb-3 uppercase tracking-wide">Demo Credentials</p>
            <div className="space-y-2">
              <button onClick={() => fill('cfo_user', 'cfo123')} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-brand/5 border border-brand/15 hover:bg-brand/10 transition-colors group">
                <div className="text-left">
                  <p className="text-xs font-semibold text-brand">CFO</p>
                  <p className="text-[10px] text-ink-faint">cfo_user / cfo123</p>
                </div>
                <ArrowRight size={12} className="text-brand/50 group-hover:text-brand transition-colors" />
              </button>
              <button onClick={() => fill('controller', 'ctrl123')} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-info/5 border border-info/15 hover:bg-info/10 transition-colors group">
                <div className="text-left">
                  <p className="text-xs font-semibold text-blue-400">Finance Controller</p>
                  <p className="text-[10px] text-ink-faint">controller / ctrl123</p>
                </div>
                <ArrowRight size={12} className="text-blue-400/50 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
