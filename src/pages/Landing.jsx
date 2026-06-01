import { Link } from 'react-router-dom'
import { Brain, ShieldCheck, TrendingUp, FileText, BarChart2, Zap, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: Brain, title: 'AI Exception Detection', desc: 'Mistral AI automatically detects financial anomalies across all uploaded documents.' },
  { icon: ShieldCheck, title: 'Risk Scoring Engine', desc: 'Real-time risk scores (0–10) with severity classification: LOW to CRITICAL.' },
  { icon: TrendingUp, title: 'Predictive Analytics', desc: 'Trend analysis with 7-day rolling charts and early warning triggers.' },
  { icon: FileText, title: 'Multi-format Parsing', desc: 'XLSX, CSV, PDF, DOCX — upload any financial document and extract metrics instantly.' },
  { icon: BarChart2, title: 'Executive Dashboards', desc: 'Role-specific views for CFO and Finance Controllers with recharts visualizations.' },
  { icon: Zap, title: 'Finance Chat Assistant', desc: 'Ask FEMA anything about your exceptions in natural language. AI-powered answers.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      {/* Nav */}
      <nav className="border-b border-surface-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-orange-600 rounded-lg flex items-center justify-center font-display font-black text-sm text-surface">F</div>
          <span className="font-display font-bold text-brand text-lg tracking-tight">FEMA</span>
        </div>
        <Link to="/login" className="btn-primary">
          Sign In <ArrowRight size={14} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative py-28 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand/5 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto slide-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold mb-6 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-dot" />
            Finance Exception Management Agent
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-ink leading-[1.05] mb-6">
            AI-Powered Financial<br />
            <span className="text-brand">Exception Intelligence</span>
          </h1>
          <p className="text-ink-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Detect, triage, and resolve financial exceptions at CFO speed. Built with local Mistral AI, MySQL, FastAPI, and React.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-surface font-display font-bold text-base rounded-xl hover:bg-brand-light transition-colors shadow-glow">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-8 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 hover:border-brand/20 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/15 transition-colors">
                <Icon size={18} className="text-brand" />
              </div>
              <h3 className="font-display font-semibold text-ink text-sm mb-2">{title}</h3>
              <p className="text-ink-muted text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <div className="border-t border-surface-border py-6 px-8 text-center">
        <p className="text-xs text-ink-faint">FEMA v2.0 · FastAPI + React Vite + Tailwind CSS + MySQL · Mistral AI</p>
      </div>
    </div>
  )
}
