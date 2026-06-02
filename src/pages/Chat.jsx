import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Send, Bot, User, MessageSquare } from 'lucide-react'
import clsx from 'clsx'

const SUGGESTIONS = [
  'What are the most critical exceptions right now?',
  'Summarize our financial risk exposure',
  'What actions should I take for the cash flow risk?',
  'Explain the OPEX overrun exception',
  'Which exceptions need CFO sign-off?',
]

function FormattedMessage({ text, isUser }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className={isUser ? "font-semibold text-white" : "font-semibold text-ink"}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return (
          <span key={i}>
            {part.split('\n').map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <div className="h-1.5" />}
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm FEMA, your Finance Exception Management AI. I have context on all your current exceptions and can provide actionable CFO-level insights. What would you like to know?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async text => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await sendChat({ message: msg })
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.response, intent: res.data.intent }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'An error occurred. Please try again.', error: true }])
    } finally { setLoading(false) }
  }

  return (
    <div className="animate-in flex flex-col h-[calc(90vh-120px)] w-full">
      <div className="mb-4">
        <h1 className="text-xl font-display font-bold text-ink flex items-center gap-2">
          <MessageSquare size={18} className="text-brand" /> Finance Chat Assistant
        </h1>
        <p className="text-sm text-ink-muted mt-1">AI-powered financial exception insights via Mistral</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
        {messages.map((m, i) => (
          <div key={i} className={clsx('flex gap-3 items-end', m.role === 'user' && 'flex-row-reverse')}>
            {/* Avatar */}
            <div className={clsx(
              'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
              m.role === 'assistant' ? 'bg-gradient-to-br from-brand to-orange-600' : 'bg-surface-muted border border-surface-border'
            )}>
              {m.role === 'assistant' ? <Bot size={13} className="text-surface" /> : <User size={13} className="text-ink-muted" />}
            </div>
            {/* Bubble */}
            <div className={clsx(
              'max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
              m.role === 'assistant'
                ? 'bg-surface-card border border-surface-border text-ink-muted rounded-bl-sm'
                : 'bg-brand text-surface font-medium rounded-br-sm',
              m.error && 'border-danger/30 text-red-400'
            )}>
              <FormattedMessage text={m.text} isUser={m.role === 'user'} />
              {m.intent && m.role === 'assistant' && (
                <p className="text-[10px] text-ink-faint mt-2 font-mono">intent: {m.intent}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-end">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-orange-600 flex items-center justify-center flex-shrink-0">
              <Bot size={13} className="text-surface" />
            </div>
            <div className="bg-surface-card border border-surface-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap py-3 border-t border-surface-border">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-surface-card border border-surface-border text-ink-muted hover:border-brand/30 hover:text-brand transition-all">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 pt-1">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about exceptions, risks, financial insights…"
          className="input flex-1"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className={clsx(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
            input.trim() ? 'bg-brand hover:bg-brand-light text-surface' : 'bg-surface-muted text-ink-faint cursor-not-allowed'
          )}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
