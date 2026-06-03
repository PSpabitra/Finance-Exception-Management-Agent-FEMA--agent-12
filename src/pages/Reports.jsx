import React, { useState } from 'react'
import { PageHeader } from '../components/UI'
import { generateReport } from '../services/api'
import { FileText, File, DownloadCloud, FileBarChart, ShieldAlert, Activity, Users, Settings } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const CATEGORIES = [
    {
        id: 'exception',
        label: 'Exception Management',
        icon: ShieldAlert,
        reports: [
            'Open Exceptions', 'Closed Exceptions', 'Critical Exceptions', 'Recurring Exceptions'
        ]
    },
    {
        id: 'risk',
        label: 'Financial Risk',
        icon: Activity,
        reports: [
            'Margin Erosion Analysis', 'Cash Flow Risk Analysis', 'Receivables Ageing Risk Report', 'Liquidity & Covenant Risk Report'
        ]
    },
    {
        id: 'operational',
        label: 'Operational',
        icon: Settings,
        reports: [
            'SLA Performance Report', 'Resolution Time Analysis', 'Owner Performance Report', 'Escalation Tracking Report'
        ]
    },
    {
        id: 'executive',
        label: 'Executive Reports',
        icon: FileBarChart,
        reports: [
            'CFO Weekly Digest', 'Monthly Finance Health Report', 'Quarterly Executive Summary', 'Board Presentation Pack'
        ]
    },
    {
        id: 'governance',
        label: 'Governance & Audit',
        icon: Users,
        reports: [
            'Complete Audit Trail Report', 'User Activity Report', 'Escalation Approval History', 'Compliance Monitoring Report'
        ]
    }
]

export default function Reports() {
    const [loading, setLoading] = useState(null)
    const [activeTab, setActiveTab] = useState(CATEGORIES[0].id)

    const handleDownload = async (reportName, format) => {
        setLoading(`${reportName}-${format}`)
        try {
            const res = await generateReport({ report_type: reportName, format })
            const blob = new Blob([res.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${reportName.replace(/\s+/g, '_')}.${format}`)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success(`${reportName} generated successfully`)
        } catch (err) {
            toast.error(`Failed to generate ${reportName}`)
        } finally {
            setLoading(null)
        }
    }

    const activeReports = CATEGORIES.find(c => c.id === activeTab)?.reports || []

    return (
        <div className="animate-in w-full h-full flex flex-col">
            <PageHeader title="Reports Center" sub="Generate and download customized financial reports in PDF or DOCX format">
                <button className="btn-secondary h-9">
                    <DownloadCloud size={14} className="mr-2" /> View History
                </button>
            </PageHeader>

            {/* Tabs */}
            <div className="flex border-b border-surface-border mb-6 overflow-x-auto hide-scrollbar">
                {CATEGORIES.map(c => {
                    const Icon = c.icon
                    const isActive = activeTab === c.id
                    return (
                        <button
                            key={c.id}
                            onClick={() => setActiveTab(c.id)}
                            className={clsx(
                                "flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap",
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
                    <div key={report} className="card p-5 group flex flex-col hover:border-brand/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <FileText size={20} className="text-ink-muted group-hover:text-brand" />
                            </div>
                            <div className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                                Ready
                            </div>
                        </div>
                        <h3 className="text-ink font-semibold mb-1 text-base leading-tight">{report}</h3>
                        <p className="text-xs text-ink-muted mb-5 leading-relaxed">
                            Provides detailed insights and recent data regarding {report.toLowerCase()}.
                        </p>
                        <div className="mt-auto flex items-center gap-2 pt-4 border-t border-surface-border">
                            <button
                                onClick={() => handleDownload(report, 'pdf')}
                                disabled={loading === `${report}-pdf`}
                                className="flex-1 btn-white py-2 flex items-center justify-center gap-2 text-xs border border-surface-border hover:border-surface-muted hover:bg-surface-muted/30 rounded-lg transition-colors"
                            >
                                {loading === `${report}-pdf` ? (
                                    <div className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <File size={14} className="text-red-500" />
                                )}
                                PDF
                            </button>
                            <button
                                onClick={() => handleDownload(report, 'docx')}
                                disabled={loading === `${report}-docx`}
                                className="flex-1 btn-white py-2 flex items-center justify-center gap-2 text-xs border border-surface-border hover:border-surface-muted hover:bg-surface-muted/30 rounded-lg transition-colors"
                            >
                                {loading === `${report}-docx` ? (
                                    <div className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
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
