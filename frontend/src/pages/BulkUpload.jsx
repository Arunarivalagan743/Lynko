import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useBulkUpload } from '../hooks/useBulkUpload.js'
import { useSocket } from '../context/SocketContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { ENV } from '../constants/env.js'
import bulkImg from '../assets/illustrations/bulkjsx.png'
import { 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Download, 
  HelpCircle
} from 'lucide-react'

export default function BulkUploadPage() {
  const {
    parsedRows,
    validationErrors,
    uploadResults,
    progress,
    setProgress,
    uploading,
    fileMeta,
    handleFileSelect,
    submitBulkUpload,
    downloadResults,
  } = useBulkUpload()

  const socket = useSocket()
  const [isDragActive, setIsDragActive] = useState(false)

  // Listen to socket bulk progress updates
  React.useEffect(() => {
    if (!socket) return

    const handleBulkProgress = (data) => {
      const calculatedPct = Math.round((data.processed / data.total) * 100)
      setProgress(calculatedPct)
    }

    socket.on('bulkProgress', handleBulkProgress)
    return () => {
      socket.off('bulkProgress', handleBulkProgress)
    }
  }, [socket, setProgress])

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Construct short URL for result listing
  const getShortUrlStr = (row) => {
    if (!row.url) return ''
    if (typeof row.url === 'string') return row.url
    if (row.url.shortCode) {
      return `${ENV.VITE_API_URL}/r/${row.url.shortCode}`
    }
    return ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-outline-variant pb-6">
        <div className="space-y-3">
          <p className="label-overline">Import</p>
          <h1 className="heading-page">Bulk Upload Links</h1>
          <p className="text-base font-medium text-on-surface-variant max-w-2xl">
            Shorten multiple destination URLs at once using a CSV data sheet.
          </p>
        </div>
        <div className="flex-shrink-0">
          <img src={bulkImg} alt="" className="h-20 w-auto object-contain shadow-none" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Left Column: Drag & Drop + File Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <Card className="space-y-5" shadowSize="sm">
            <h2 className="heading-section flex items-center gap-2 border-b-2 border-primary pb-3">
              <UploadCloud size={20} className="text-primary" />
              Upload CSV Document
            </h2>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-none p-8 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer transition-all min-h-[180px] ${
                isDragActive 
                  ? 'border-secondary bg-surface-container-low' 
                  : 'border-primary hover:border-secondary bg-white'
              }`}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <UploadCloud size={40} className="text-primary" />
              <div className="space-y-1.5">
                <p className="font-space text-sm font-bold text-primary">
                  Drag & drop your CSV file here, or click to browse
                </p>
                <p className="label-meta">
                  Supports .csv files up to 5MB (Max 500 rows)
                </p>
              </div>
            </div>

            {/* CSV Specification Details */}
            <div className="rounded-none bg-surface-container-low p-4 space-y-3 border-2 border-primary">
              <div className="flex items-center gap-2 font-space text-xs font-bold uppercase text-primary">
                <HelpCircle size={14} className="text-primary" />
                <span>CSV Template Specification:</span>
              </div>
              <p className="label-meta">
                Make sure your CSV file is formatted exactly as shown below:
              </p>
              <pre className="text-[11px] text-primary bg-white p-3 rounded-none border-2 border-primary select-all font-mono">
originalUrl,customAlias{"\n"}
https://google.com,google{"\n"}
https://github.com,github
              </pre>
            </div>
          </Card>

          {/* File Metadata Details */}
          {fileMeta && (
            <Card className="!p-5 space-y-4" shadowSize="sm">
              <h3 className="font-space text-xs font-bold uppercase tracking-wider text-primary">File Metadata</h3>
              <div className="flex items-start gap-4">
                <FileText size={32} className="text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-primary truncate">{fileMeta.name}</p>
                  <p className="label-meta mt-1">Size: {formatBytes(fileMeta.size)}</p>
                  <p className="label-meta">Rows Parsed: {parsedRows.length}</p>
                </div>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between font-space text-[11px] font-bold uppercase text-primary">
                    <span>Uploading links...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-surface-container-low border-2 border-primary rounded-none h-3.5 overflow-hidden">
                    <div 
                      className="bg-secondary h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Trigger */}
              <Button
                onClick={submitBulkUpload}
                disabled={parsedRows.length === 0}
                loading={uploading}
                size="xl"
                className="w-full select-none"
              >
                Upload & Shorten ({parsedRows.length} links)
              </Button>
            </Card>
          )}
        </motion.div>

        {/* Right Column: Previews, Validation Alerts, or Results Dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Upload Results Dashboard Section */}
          {uploadResults && (
            <Card className="space-y-5 border-secondary bg-white" shadowSize="md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-primary pb-3">
                <div className="space-y-1.5">
                  <h2 className="heading-section text-secondary flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-secondary" />
                    Upload Complete
                  </h2>
                  <p className="text-sm font-medium text-on-surface-variant">
                    Batch processes completed successfully.
                  </p>
                </div>
                <Button
                  onClick={downloadResults}
                  size="md"
                  className="flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Results CSV
                </Button>
              </div>

              {/* Counts metrics */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white border-2 border-primary rounded-none p-4 text-center">
                  <p className="label-meta">Success Count</p>
                  <p className="text-4xl font-anton text-secondary mt-1">{uploadResults.success}</p>
                </div>
                <div className="bg-white border-2 border-primary rounded-none p-4 text-center">
                  <p className="label-meta">Failed Count</p>
                  <p className="text-4xl font-anton text-error mt-1">{uploadResults.failed}</p>
                </div>
              </div>

              {/* Upload Results Table Details */}
              <div className="space-y-3">
                <h3 className="font-space text-xs font-bold uppercase text-primary">Execution Details</h3>
                
                {/* Desktop/Tablet Table */}
                <div className="hidden md:block overflow-x-auto border-2 border-primary rounded-none bg-white max-h-[40vh]">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary font-space text-[11px] font-bold uppercase text-primary bg-surface-container-low">
                        <th className="p-3.5 font-bold w-12 text-center">#</th>
                        <th className="p-3.5 font-bold">Original URL</th>
                        <th className="p-3.5 font-bold">Custom Alias</th>
                        <th className="p-3.5 font-bold">Status</th>
                        <th className="p-3.5 font-bold">Short URL / Error</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/15 bg-white">
                      {uploadResults.results?.map((res, i) => {
                        const shortUrl = getShortUrlStr(res)
                        return (
                          <tr key={res.index ?? i} className={i % 2 === 0 ? '' : 'bg-surface-container-low/30'}>
                            <td className="p-3.5 text-on-surface-variant text-center font-mono font-bold">{(res.index ?? i) + 1}</td>
                            <td className="p-3.5 text-primary font-semibold truncate max-w-[200px]" title={res.originalUrl}>
                              {res.originalUrl}
                            </td>
                            <td className="p-3.5 text-primary font-mono font-bold">{res.customAlias || '-'}</td>
                            <td className="p-3.5">
                              <span className={`inline-block rounded-none border-2 px-2 py-0.5 text-[10px] font-bold font-space uppercase ${
                                res.status === 'success'
                                  ? 'border-secondary bg-secondary-container/30 text-secondary'
                                  : 'border-error bg-error/10 text-error'
                              }`}>
                                {res.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3.5 max-w-[200px]">
                              {res.status === 'success' ? (
                                <a 
                                  href={shortUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-secondary hover:underline font-bold break-all text-sm"
                                >
                                  {shortUrl}
                                </a>
                              ) : (
                                <span className="text-error font-bold break-words text-sm">
                                  {res.error?.message || 'Unknown creation error'}
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards Stack */}
                <div className="block md:hidden space-y-4">
                  {uploadResults.results?.map((res, i) => {
                    const shortUrl = getShortUrlStr(res)
                    return (
                      <Card key={res.index ?? i} className="p-4 space-y-3" shadowSize="sm">
                        <div className="flex items-center justify-between">
                          <span className="code-label">Row #{(res.index ?? i) + 1}</span>
                          <span className={`inline-block rounded-none border px-2 py-0.5 text-[9px] font-bold font-space uppercase ${
                            res.status === 'success'
                              ? 'border-secondary bg-secondary-container/10 text-secondary'
                              : 'border-error bg-error/10 text-error'
                          }`}>
                            {res.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Destination URL</p>
                          <p className="text-xs text-on-surface-variant font-medium break-all select-all">{res.originalUrl}</p>
                        </div>
                        {res.customAlias && (
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Custom Alias</p>
                            <p className="text-xs text-primary font-mono font-bold">{res.customAlias}</p>
                          </div>
                        )}
                        <div className="border-t border-primary/10 pt-3">
                          <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space mb-1">Result</p>
                          {res.status === 'success' ? (
                            <a 
                              href={shortUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-secondary hover:underline font-bold break-all text-sm font-mono"
                            >
                              {shortUrl}
                            </a>
                          ) : (
                            <span className="text-error font-bold break-words text-sm">
                              {res.error?.message || 'Unknown creation error'}
                            </span>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Validation Errors List Section */}
          {validationErrors.length > 0 && (
            <Card className="space-y-4 border-error bg-white" shadowSize="md">
              <h2 className="heading-section text-error flex items-center gap-2">
                <AlertCircle size={20} />
                Validation Failures Found ({validationErrors.length})
              </h2>
              <p className="text-sm font-medium text-on-surface-variant">
                Please resolve the formatting discrepancies in your CSV and try re-uploading:
              </p>
              {/* Desktop/Tablet Table */}
              <div className="hidden md:block overflow-x-auto border-2 border-primary rounded-none bg-white max-h-[30vh]">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary font-space text-[11px] font-bold uppercase text-primary bg-surface-container-low">
                      <th className="p-3.5 font-bold w-16 text-center">Row</th>
                      <th className="p-3.5 font-bold w-24">Field</th>
                      <th className="p-3.5 font-bold">Issue Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/15">
                    {validationErrors.map((err, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/30'}>
                        <td className="p-3.5 text-center text-on-surface-variant font-mono font-bold">{err.row || 'File'}</td>
                        <td className="p-3.5 font-bold text-primary uppercase font-mono">{err.field}</td>
                        <td className="p-3.5 text-error font-bold">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards Stack */}
              <div className="block md:hidden space-y-4">
                {validationErrors.map((err, idx) => (
                  <Card key={idx} className="p-4 space-y-2 border-error animate-[fadeSlideIn_0.15s_ease-out]" shadowSize="sm">
                    <div className="flex items-center justify-between">
                      <span className="code-label">Row {err.row || 'File'}</span>
                      <span className="text-[10px] font-bold text-primary uppercase font-mono">{err.field}</span>
                    </div>
                    <div className="border-t border-primary/10 pt-2 text-xs font-semibold text-error">
                      {err.message}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* CSV File Content Preview Table */}
          {parsedRows.length > 0 && (
            <Card className="space-y-5" shadowSize="md">
              <div className="flex items-center justify-between border-b-2 border-primary pb-3">
                <h2 className="heading-section flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  CSV Content Preview
                </h2>
                <span className="font-space text-[11px] bg-surface-container-low border-2 border-primary rounded-none px-2.5 py-1 text-primary font-bold">
                  Total Rows: {parsedRows.length}
                </span>
              </div>

              {/* Desktop/Tablet Table */}
              <div className="hidden md:block overflow-x-auto border-2 border-primary rounded-none bg-white max-h-[45vh]">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary font-space text-[11px] font-bold uppercase text-primary bg-surface-container-low">
                      <th className="p-3.5 font-bold w-12 text-center">#</th>
                      <th className="p-3.5 font-bold">Destination URL (originalUrl)</th>
                      <th className="p-3.5 font-bold">Custom Alias (customAlias)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/15">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/30'}>
                        <td className="p-3.5 text-center text-on-surface-variant font-mono font-bold">{idx + 1}</td>
                        <td className="p-3.5 text-primary font-semibold truncate max-w-[280px]" title={row.originalUrl}>
                          {row.originalUrl}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-primary">{row.customAlias || <span className="text-on-surface-variant/50 font-sans italic">Generated</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards Stack */}
              <div className="block md:hidden space-y-4">
                {parsedRows.map((row, idx) => (
                  <Card key={idx} className="p-4 space-y-3" shadowSize="sm">
                    <div className="flex items-center justify-between">
                      <span className="code-label">Record #{idx + 1}</span>
                      {row.customAlias ? (
                        <span className="text-xs font-mono font-bold text-primary">{row.customAlias}</span>
                      ) : (
                        <span className="text-xs font-sans italic text-on-surface-variant/50">Auto Alias</span>
                      )}
                    </div>
                    <div className="border-t border-primary/10 pt-2.5 space-y-1">
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Destination URL</p>
                      <p className="text-xs text-on-surface-variant font-medium break-all select-all">{row.originalUrl}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* Pre-file Empty State */}
          {!fileMeta && !uploadResults && (
            <Card className="flex flex-col items-center justify-center text-center !p-16 min-h-[40vh] space-y-5" shadowSize="sm">
              <UploadCloud size={52} className="text-primary animate-pulse" />
              <div className="space-y-3">
                <h2 className="heading-section">No File Uploaded</h2>
                <p className="text-base font-medium text-on-surface-variant max-w-sm mx-auto">
                  Drag and drop a formatted link-shortening CSV stylesheet to run client validations and preview link records before batch committing them.
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
export { BulkUploadPage }
