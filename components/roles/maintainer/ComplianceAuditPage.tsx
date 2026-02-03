"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  generateComplianceAudit, 
  ComplianceAuditResponse, 
  getReadinessStatus
} from '@/lib/api/compliance'
import { showToast } from '@/lib/utils/toast'
import ThemeButton from '@/components/ui/button'
import Loader from '@/components/ui/loader'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { 
  HiShieldCheck, 
  HiShieldExclamation, 
  HiExclamationTriangle,
  HiGlobeAlt,
  HiDocumentText,
  HiArrowDownTray,
  HiMagnifyingGlass,
  HiServer,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiChevronDown,
  HiChevronUp
} from 'react-icons/hi2'
import { FaShieldAlt } from 'react-icons/fa'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

function ComplianceAuditPage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [auditResult, setAuditResult] = useState<ComplianceAuditResponse | null>(null)
  const [showHeaders, setShowHeaders] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'report' | 'headers'>('overview')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      showToast.error('Please enter a valid URL')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      showToast.error('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setIsLoading(true)
    setAuditResult(null)

    try {
      const result = await generateComplianceAudit({ url: url.trim() })
      setAuditResult(result)
      showToast.success('Compliance audit completed successfully!')
    } catch (error: any) {
      console.error('Audit error:', error)
      showToast.error(error?.response?.data?.message || 'Failed to generate compliance audit')
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 40) return '#EF4444' // red
    if (score <= 70) return '#F59E0B' // yellow
    return '#10B981' // green
  }

  const getScoreIcon = (score: number) => {
    if (score <= 40) return <HiShieldExclamation className="w-8 h-8 text-red-500" />
    if (score <= 70) return <HiExclamationTriangle className="w-8 h-8 text-yellow-500" />
    return <HiShieldCheck className="w-8 h-8 text-green-500" />
  }

  // Chart data for readiness score
  const scoreChartData = auditResult ? {
    labels: ['Score', 'Remaining'],
    datasets: [{
      data: [auditResult.readiness_score, 100 - auditResult.readiness_score],
      backgroundColor: [getScoreColor(auditResult.readiness_score), '#E5E7EB'],
      borderWidth: 0,
      cutout: '75%',
    }],
  } : null

  // Header security analysis
  const analyzeHeaders = (headers: Record<string, string>) => {
    const securityHeaders = [
      { name: 'Strict-Transport-Security', present: !!headers['Strict-Transport-Security'], critical: true },
      { name: 'Content-Security-Policy', present: !!headers['Content-Security-Policy'], critical: true },
      { name: 'X-Frame-Options', present: !!headers['X-Frame-Options'], critical: true },
      { name: 'X-Content-Type-Options', present: !!headers['X-Content-Type-Options'], critical: false },
      { name: 'X-XSS-Protection', present: !!headers['X-XSS-Protection'], critical: false },
      { name: 'Permissions-Policy', present: !!headers['Permissions-Policy'], critical: false },
      { name: 'Cross-Origin-Opener-Policy', present: !!headers['Cross-Origin-Opener-Policy'], critical: false },
    ]
    return securityHeaders
  }

  const headerAnalysis = auditResult ? analyzeHeaders(auditResult.headers_raw) : []
  
  const headerChartData = {
    labels: ['Present', 'Missing'],
    datasets: [{
      label: 'Security Headers',
      data: [
        headerAnalysis.filter(h => h.present).length,
        headerAnalysis.filter(h => !h.present).length
      ],
      backgroundColor: ['#10B981', '#EF4444'],
      borderRadius: 8,
    }],
  }

  return (
    <div className="min-h-screen bg-[#FFFCFB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaShieldAlt className="w-8 h-8 text-[#A33C13]" />
            <h1 className="text-3xl font-bold text-[#171717]">Web Compliance Audit</h1>
          </div>
          <p className="text-[#171717]/70">
            Analyze your Website for security compliance, headers, and readiness for professional security testing.
          </p>
        </motion.div>

        {/* URL Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#A33C13]/10"
        >
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiGlobeAlt className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A33C13]/60" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="w-full pl-12 pr-4 py-4 border-2 border-[#A33C13]/20 rounded-xl focus:border-[#A33C13] focus:ring-2 focus:ring-[#A33C13]/20 outline-none transition-all text-[#171717] placeholder-[#171717]/40"
                disabled={isLoading}
              />
            </div>
            <ThemeButton
              type="submit"
              disabled={isLoading}
              className="md:w-auto px-8 !h-auto !py-4"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <HiMagnifyingGlass className="w-5 h-5" />
                  Generate Audit
                </div>
              )}
            </ThemeButton>
          </form>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-[#A33C13]/20 border-t-[#A33C13] rounded-full animate-spin" />
              <FaShieldAlt className="absolute inset-0 m-auto w-8 h-8 text-[#A33C13]" />
            </div>
            <h3 className="text-xl font-semibold text-[#171717] mb-2">Analyzing Website Security</h3>
            <p className="text-[#171717]/60">This may take a moment...</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {auditResult && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Score Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Readiness Score Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-[#A33C13]/10 col-span-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#171717]">Readiness Score</h3>
                    {getScoreIcon(auditResult.readiness_score)}
                  </div>
                  <div className="relative w-40 h-40 mx-auto">
                    {scoreChartData && (
                      <Doughnut 
                        data={scoreChartData} 
                        options={{
                          plugins: { legend: { display: false } },
                          responsive: true,
                          maintainAspectRatio: true,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold" style={{ color: getScoreColor(auditResult.readiness_score) }}>
                        {auditResult.readiness_score}
                      </span>
                    </div>
                  </div>
                  <div className={`mt-4 p-3 rounded-xl ${getReadinessStatus(auditResult.readiness_score).bgColor}`}>
                    <p className={`text-center font-semibold ${getReadinessStatus(auditResult.readiness_score).color}`}>
                      {getReadinessStatus(auditResult.readiness_score).status}
                    </p>
                  </div>
                </motion.div>

                {/* Status Meaning Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-[#A33C13]/10 col-span-1 md:col-span-2"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <HiDocumentText className="w-6 h-6 text-[#A33C13]" />
                    <h3 className="text-lg font-semibold text-[#171717]">Assessment Summary</h3>
                  </div>
                  <div className={`p-4 rounded-xl ${getReadinessStatus(auditResult.readiness_score).bgColor} mb-4`}>
                    <p className="text-[#171717]/80">
                      {getReadinessStatus(auditResult.readiness_score).meaning}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#F3ECE9] rounded-xl">
                      <HiGlobeAlt className="w-5 h-5 text-[#A33C13]" />
                      <div>
                        <p className="text-xs text-[#171717]/60">Audited URL</p>
                        <p className="text-sm font-medium text-[#171717] truncate max-w-[200px]">{auditResult.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F3ECE9] rounded-xl">
                      <HiClock className="w-5 h-5 text-[#A33C13]" />
                      <div>
                        <p className="text-xs text-[#171717]/60">Audit Date</p>
                        <p className="text-sm font-medium text-[#171717]">
                          {new Date(auditResult.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Security Headers Analysis */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-[#A33C13]/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <HiServer className="w-6 h-6 text-[#A33C13]" />
                    <h3 className="text-lg font-semibold text-[#171717]">Security Headers Analysis</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-green-600">
                      <HiCheckCircle className="w-4 h-4" />
                      {headerAnalysis.filter(h => h.present).length} Present
                    </span>
                    <span className="flex items-center gap-1 text-red-600">
                      <HiXCircle className="w-4 h-4" />
                      {headerAnalysis.filter(h => !h.present).length} Missing
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Headers Chart */}
                  <div className="h-64">
                    <Bar
                      data={headerChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 },
                          },
                        },
                      }}
                    />
                  </div>
                  
                  {/* Headers List */}
                  <div className="space-y-2">
                    {headerAnalysis.map((header, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          header.present ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {header.present ? (
                            <HiCheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <HiXCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm font-medium text-[#171717]">{header.name}</span>
                        </div>
                        {header.critical && (
                          <span className="text-xs px-2 py-1 bg-[#A33C13]/10 text-[#A33C13] rounded-full">
                            Critical
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Tabs for Report and Raw Headers */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-[#A33C13]/10 overflow-hidden"
              >
                {/* Tab Headers */}
                <div className="flex border-b border-[#A33C13]/10">
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`flex-1 py-4 px-6 text-sm font-semibold transition-all ${
                      activeTab === 'report'
                        ? 'text-[#A33C13] border-b-2 border-[#A33C13] bg-[#A33C13]/5'
                        : 'text-[#171717]/60 hover:text-[#A33C13] hover:bg-[#A33C13]/5'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <HiDocumentText className="w-5 h-5" />
                      Full Report
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('headers')}
                    className={`flex-1 py-4 px-6 text-sm font-semibold transition-all ${
                      activeTab === 'headers'
                        ? 'text-[#A33C13] border-b-2 border-[#A33C13] bg-[#A33C13]/5'
                        : 'text-[#171717]/60 hover:text-[#A33C13] hover:bg-[#A33C13]/5'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <HiServer className="w-5 h-5" />
                      Raw Headers
                    </div>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'report' && (
                    <div className="prose prose-lg max-w-none prose-headings:text-[#171717] prose-p:text-[#171717]/80 prose-strong:text-[#A33C13] prose-table:border-collapse prose-th:bg-[#F3ECE9] prose-th:p-3 prose-th:text-left prose-td:p-3 prose-td:border prose-td:border-[#A33C13]/10">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {auditResult.report_markdown}
                      </ReactMarkdown>
                    </div>
                  )}
                  {activeTab === 'headers' && (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {Object.entries(auditResult.headers_raw).map(([key, value], index) => (
                        <div
                          key={index}
                          className="p-4 bg-[#F3ECE9] rounded-lg"
                        >
                          <p className="text-sm font-semibold text-[#A33C13] mb-1">{key}</p>
                          <p className="text-sm text-[#171717]/80 break-all font-mono">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Download PDF Button */}
              {auditResult.report_pdf && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <a 
                    href={`http://127.0.0.1:8000${auditResult.report_pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center px-8 py-4 rounded-lg font-medium text-lg transition-all bg-[#A33C13] text-white hover:bg-[#8a2f0f] shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <HiArrowDownTray className="w-5 h-5" />
                      Download PDF Report
                    </div>
                  </a>
                </motion.div>
              )}

              {/* Score Legend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-[#A33C13]/10"
              >
                <h3 className="text-lg font-semibold text-[#171717] mb-4">Score Interpretation Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <HiShieldExclamation className="w-6 h-6 text-red-500" />
                      <span className="font-semibold text-red-600">0 - 40: Critical</span>
                    </div>
                    <p className="text-sm text-red-700/80">
                      The site is an "easy target." Launching a bug bounty now would be too expensive.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <HiExclamationTriangle className="w-6 h-6 text-yellow-500" />
                      <span className="font-semibold text-yellow-600">41 - 70: Improving</span>
                    </div>
                    <p className="text-sm text-yellow-700/80">
                      Good foundations, but missing key protections. Risk of failing compliance audits.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <HiShieldCheck className="w-6 h-6 text-green-500" />
                      <span className="font-semibold text-green-600">71 - 100: Audit Ready</span>
                    </div>
                    <p className="text-sm text-green-700/80">
                      The site is mature and ready for professional security testing.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ComplianceAuditPage
