import { useState, useEffect, useRef } from 'react'
import { uploadDoc, getDocs } from '../services/api'
import { PageHeader, Empty, Spinner } from '../components/UI'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const CATEGORIES = ['P&L Statement', 'Balance Sheet', 'CFO Dashboard', 'Company Policy', 'Budget Report', 'General']
const TYPE_COLORS = { xlsx: 'text-emerald-400', csv: 'text-blue-400', pdf: 'text-red-400', docx: 'text-purple-400' }
const fmtSize = b => b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState('P&L Statement')
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState([])
  const [drag, setDrag] = useState(false)
  const [docsLoading, setDocsLoading] = useState(true)
  const fileRef = useRef()

  const loadDocs = () => {
    setDocsLoading(true)
    getDocs().then(r => setDocuments(r.data)).catch(() => { }).finally(() => setDocsLoading(false))
  }
  useEffect(() => { loadDocs() }, [])

  const handleUpload = async () => {
    if (files.length === 0) return toast.error('Select at least one file first')
    setUploading(true)
    let success = 0
    let fail = 0

    for (const f of files) {
      const fd = new FormData()
      fd.append('file', f)
      fd.append('document_category', category)
      try {
        await uploadDoc(fd)
        success++
      } catch (err) {
        fail++
        toast.error(`Failed to upload ${f.name}`)
      }
    }

    if (success > 0) toast.success(`${success} file(s) uploaded & parsed!`)
    if (fail === 0) setFiles([])
    loadDocs()
    setUploading(false)
  }

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(f => f !== fileToRemove))
  }

  return (
    <div className="animate-in max-w-2xl">
      <PageHeader title="Upload Documents" sub="Upload XLSX, CSV, PDF, or DOCX files for AI analysis" />

      {/* Drop zone */}
      <div
        className={clsx(
          'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-4',
          drag ? 'border-brand bg-brand/5' : 'border-surface-border hover:border-brand/40 bg-surface'
        )}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => {
          e.preventDefault()
          setDrag(false)
          if (e.dataTransfer.files?.length) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
          }
        }}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".xlsx,.csv,.pdf,.docx,.xls,.doc"
          className="hidden"
          onChange={e => {
            if (e.target.files?.length) {
              setFiles(prev => [...prev, ...Array.from(e.target.files)])
            }
          }}
        />

        {files.length > 0 ? (
          <div className="space-y-3" onClick={e => e.stopPropagation()}>
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-surface-card border border-surface-border p-3 rounded-lg text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <FileText size={16} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{f.name}</p>
                    <p className="text-[10px] text-ink-muted">{fmtSize(f.size)}</p>
                  </div>
                </div>
                <button
                  className="p-1.5 text-ink-faint hover:text-red-400 hover:bg-danger/10 rounded-md transition-colors"
                  onClick={() => removeFile(f)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button className="mt-2 text-xs text-brand font-medium hover:underline" onClick={() => fileRef.current?.click()}>
              + Add more files
            </button>
          </div>
        ) : (
          <>
            <Upload size={32} className={clsx('mx-auto mb-3', drag ? 'text-brand' : 'text-ink-faint')} />
            <p className="text-sm text-ink-muted">Drag & drop or <span className="text-brand">click to browse</span></p>
            <p className="text-xs text-ink-faint mt-1">Multiple files supported (XLSX, CSV, PDF, DOCX)</p>
          </>
        )}
      </div>

      {/* Category selector */}
      <div className="mb-4">
        <label className="label">Document Category</label>
        <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className="btn-primary w-full justify-center py-3 text-base"
      >
        <Upload size={15} />
        {uploading ? 'Uploading & Parsing…' : `Upload ${files.length > 0 ? files.length : ''} File(s)`}
      </button>

      {/* Documents list */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-ink mb-4">Uploaded Documents ({documents.length})</p>
        {docsLoading ? <Spinner /> : documents.length === 0 ? (
          <Empty icon={FileText} message="No documents yet" />
        ) : (
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="card px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-surface-muted flex items-center justify-center flex-shrink-0">
                    <FileText size={15} className={TYPE_COLORS[doc.file_type] || 'text-ink-muted'} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{doc.original_filename}</p>
                    <p className="text-[10px] text-ink-faint mt-0.5">
                      {doc.document_category} · {doc.file_type?.toUpperCase()} · {doc.file_size ? fmtSize(doc.file_size) : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {doc.processed ? (
                    <><CheckCircle size={14} className="text-emerald-400" /><span className="text-xs text-emerald-400">Processed</span></>
                  ) : (
                    <><AlertCircle size={14} className="text-yellow-400" /><span className="text-xs text-yellow-400">Pending</span></>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
