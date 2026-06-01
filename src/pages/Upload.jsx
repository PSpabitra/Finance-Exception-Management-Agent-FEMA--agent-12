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
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('P&L Statement')
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState([])
  const [drag, setDrag] = useState(false)
  const [docsLoading, setDocsLoading] = useState(true)
  const fileRef = useRef()

  const loadDocs = () => {
    setDocsLoading(true)
    getDocs().then(r => setDocuments(r.data)).catch(() => {}).finally(() => setDocsLoading(false))
  }
  useEffect(() => { loadDocs() }, [])

  const handleUpload = async () => {
    if (!file) return toast.error('Select a file first')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('document_category', category)
    setUploading(true)
    try {
      await uploadDoc(fd)
      toast.success(`${file.name} uploaded & parsed!`)
      setFile(null)
      loadDocs()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
    } finally { setUploading(false) }
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
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f) }}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".xlsx,.csv,.pdf,.docx,.xls,.doc" className="hidden" onChange={e => setFile(e.target.files[0])} />
        {file ? (
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-3">
              <FileText size={22} className="text-brand" />
            </div>
            <p className="text-sm font-semibold text-ink">{file.name}</p>
            <p className="text-xs text-ink-muted mt-1">{fmtSize(file.size)}</p>
            <button className="mt-3 text-xs text-ink-faint hover:text-red-400 flex items-center gap-1 mx-auto"
              onClick={e => { e.stopPropagation(); setFile(null) }}>
              <X size={11} /> Remove
            </button>
          </div>
        ) : (
          <>
            <Upload size={32} className={clsx('mx-auto mb-3', drag ? 'text-brand' : 'text-ink-faint')} />
            <p className="text-sm text-ink-muted">Drag & drop or <span className="text-brand">click to browse</span></p>
            <p className="text-xs text-ink-faint mt-1">XLSX · CSV · PDF · DOCX — max 50 MB</p>
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
        disabled={!file || uploading}
        className="btn-primary w-full justify-center py-3 text-base"
      >
        <Upload size={15} />
        {uploading ? 'Uploading & Parsing…' : 'Upload & Analyze'}
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
