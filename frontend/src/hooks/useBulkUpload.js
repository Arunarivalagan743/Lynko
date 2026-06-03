import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { bulkCreateUrls } from '../api/bulkApi.js'
import { parseCsvFile, validateCsvRows, generateResultCsv } from '../utils/csvHelpers.js'

const MAX_ROWS = 500
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Custom hook to manage the lifecycle of bulk uploading URLs:
 * CSV parsing, client-side validation, previews, API uploads, and results reporting.
 */
export const useBulkUpload = () => {
  const [parsedRows, setParsedRows] = useState([])
  const [validationErrors, setValidationErrors] = useState([])
  const [uploadResults, setUploadResults] = useState(null)
  const [progress, setProgress] = useState(0) // 0 to 100
  const [uploading, setUploading] = useState(false)
  const [fileMeta, setFileMeta] = useState(null)

  // Parses and validates a selected CSV file
  const handleFileSelect = useCallback(async (file) => {
    // Reset state before parsing
    setParsedRows([])
    setValidationErrors([])
    setUploadResults(null)
    setProgress(0)
    setFileMeta(null)

    if (!file) return

    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      const err = `File size exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      setValidationErrors([{ row: 0, field: 'file', message: err }])
      toast.error(err)
      return
    }

    setFileMeta({
      name: file.name,
      size: file.size,
    })

    try {
      // 2. Parse CSV
      const rows = await parseCsvFile(file)

      // 3. Row Count Validation
      if (rows.length > MAX_ROWS) {
        const err = `File contains ${rows.length} rows, which exceeds the max limit of 500 rows`
        setValidationErrors([{ row: 0, field: 'rows', message: err }])
        toast.error(err)
        return
      }

      // 4. Validate Row Columns and values
      const { errors, validatedRows } = validateCsvRows(rows)
      setParsedRows(validatedRows)
      setValidationErrors(errors)

      if (errors.length > 0) {
        toast(`Parsed ${rows.length} rows, found ${errors.length} validation errors`, { icon: '⚠️' })
      } else {
        toast.success(`Successfully parsed ${rows.length} rows for upload`)
      }
    } catch (err) {
      const msg = err.message || 'Failed to parse CSV file'
      setValidationErrors([{ row: 0, field: 'parse', message: msg }])
      toast.error(msg)
    }
  }, [])

  // Dispatches bulk payload to backend API
  const submitBulkUpload = useCallback(async () => {
    if (parsedRows.length === 0) {
      toast.error('No valid rows available to upload')
      return
    }

    setUploading(true)
    setProgress(10) // Start progress indicator

    try {
      // Format payload to support both backend schema (rows + fileSizeBytes) 
      // and user prompt requirements (urls)
      const payload = {
        fileSizeBytes: fileMeta?.size || 1024,
        rows: parsedRows,
        urls: parsedRows, // Defensive mapping for user-specified request structure
      }

      setProgress(40) // Sending data
      const data = await bulkCreateUrls(payload)
      setProgress(100) // Completed

      setUploadResults(data)
      toast.success(`Bulk upload complete! Success: ${data.success}, Failed: ${data.failed}`)
      return data
    } catch (err) {
      setProgress(0)
      const msg = err?.response?.data?.message || err.message || 'Bulk upload failed'
      toast.error(msg)
      throw err
    } finally {
      setUploading(false)
    }
  }, [parsedRows, validationErrors, fileMeta])

  // Triggers downloading the results report as a CSV file in the browser
  const downloadResults = useCallback(() => {
    if (!uploadResults || !uploadResults.results) {
      toast.error('No upload results available to download')
      return
    }

    try {
      const csvContent = generateResultCsv(uploadResults.results)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `bulk_upload_results_${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Downloaded results report')
    } catch (err) {
      console.error('CSV Generation Error:', err)
      toast.error('Failed to generate results file')
    }
  }, [uploadResults])

  return {
    // States
    parsedRows,
    validationErrors,
    uploadResults,
    progress,
    setProgress,
    uploading,
    fileMeta,

    // Operations
    handleFileSelect,
    submitBulkUpload,
    downloadResults,
  }
}
