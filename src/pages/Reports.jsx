import React, { useState, useEffect } from 'react'
import { PageHeader, Spinner } from '../components/UI'
import { getAvailableReports, generateReport } from '../services/api'
import { FileText, File, DownloadCloud, FileBarChart, ShieldAlert, Activity, Users, Settings } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const ICON_MAP = {
    ShieldAlert: ShieldAlert,
    Activity: Activity,
    Settings: Settings,
    FileBarChart: FileBarChart,
    Users: Users
}

export default function Reports() {
    const [categories, setCategories] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [loadingAction, setLoadingAction] = useState(null)
    const [activeTab, setActiveTab] = useState(null)
    const [period, setPeriod] = useState("All Time")
    const [userContext, setUserContext] = useState("")

    useEffect(() => {
        getAvailableReports()
            .then(res => {
                setCategories(res.data)
                if (res.data.length > 0) setActiveTab(res.data[0].id)
            })
            .catch(() => toast.error('Failed to load report configurations'))
            .finally(() => setLoadingData(false))
    }, [])

    const handleDownload = async (reportName, format) => {
        setLoadingAction(`${reportName}-${format}`)
        try {
            const res = await generateReport({ report_type: reportName, format, period, context: userContext })
            const blob = new Blob([res.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${reportName.replace(/\s+/g, '_')}_${period.replace(' ', '')}.${format}`)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success(`${reportName} (${period}) generated successfully`)
        } catch (err) {
            toast.error(`Failed to generate ${reportName}`)
        } finally {
            setLoadingAction(null)
        }
    }

    if (loadingData) return <Spinner />

    const activeReports = categories.find(c => c.id === activeTab)?.reports || []

    return (
        <div className="animate-in w-full h-full flex flex-col">
            <PageHeader title="Reports Center" sub="Generate and download customized financial reports in PDF or DOCX format">
                {/* <button className="btn-secondary h-9">
                    <DownloadCloud size={14} className="mr-2" /> View History
                </button> */}
            </PageHeader>

            {/* Parameter Controls */}
            <div className="card p-4 mb-6 flex items-center bg-surface-muted/30">
                <div className="w-full sm:w-auto flex items-center gap-4">
                    <label className="block text-sm font-semibold text-ink-muted uppercase tracking-wider">Report Timeline:</label>
                    <select
                        value={period}
                        onChange={e => setPeriod(e.target.value)}
                        className="input min-w-[200px] h-10 border-surface-border focus:border-brand bg-surface"
                    >
                        <option value="Daily">Daily Status</option>
                        <option value="Weekly">Weekly Overview</option>
                        <option value="Monthly">Monthly Digest</option>
                        <option value="Quarterly">Quarterly Report</option>
                        <option value="All Time">All Time Record</option>
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-surface-border mb-8 pb-px">
                {categories.map(c => {
                    const Icon = ICON_MAP[c.icon] || FileText
                    const isActive = activeTab === c.id
                    return (
                        <button
                            key={c.id}
                            onClick={() => setActiveTab(c.id)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-medium transition-colors whitespace-nowrap rounded-t-lg -mb-[2px]",
                                isActive
                                    ? "border-brand text-brand bg-brand/5"
                                    : "border-transparent text-ink-muted hover:text-ink hover:bg-surface-muted/50"
                            )}
                        >
                            <Icon size={16} />
                            {c.label}
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 slide-in">
                {activeReports.map(report => (
                    <div key={report.name} className="card p-5 group flex flex-col border border-surface-border hover:border-brand/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-surface to-brand/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="w-11 h-11 rounded-xl bg-surface shadow-sm border border-surface-border flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <FileText size={20} className="text-ink-muted group-hover:text-brand" />
                            </div>
                            <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                Live Data
                            </div>
                        </div>

                        <h3 className="text-ink font-semibold mb-1.5 text-base leading-tight relative z-10 group-hover:text-brand transition-colors">{report.name}</h3>
                        <p className="text-xs text-ink-muted mb-6 leading-relaxed relative z-10">
                            {report.desc}
                        </p>

                        <div className="mt-auto flex items-center gap-2 pt-4 border-t border-surface-border/60 relative z-10">
                            <button
                                onClick={() => handleDownload(report.name, 'pdf')}
                                disabled={loadingAction === `${report.name}-pdf`}
                                className="flex-1 btn-white py-2.5 flex items-center justify-center gap-2 text-xs border border-surface-border hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500 rounded-lg transition-all shadow-sm disabled:opacity-50"
                            >
                                {loadingAction === `${report.name}-pdf` ? (
                                    <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <File size={14} className="text-red-500" />
                                )}
                                PDF
                            </button>
                            <button
                                onClick={() => handleDownload(report.name, 'docx')}
                                disabled={loadingAction === `${report.name}-docx`}
                                className="flex-1 btn-white py-2.5 flex items-center justify-center gap-2 text-xs border border-surface-border hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-500 rounded-lg transition-all shadow-sm disabled:opacity-50"
                            >
                                {loadingAction === `${report.name}-docx` ? (
                                    <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <File size={14} className="text-blue-500" />
                                )}
                                DOCX
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
