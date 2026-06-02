import Papa from 'papaparse'

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
const ALIAS_REGEX = /^[a-zA-Z0-9_-]{4,32}$/

/**
 * Parses a CSV file using PapaParse.
 *
 * @param {File} file - The file to parse.
 * @returns {Promise<Array<Object>>} Resolved with the parsed rows.
 */
export const parseCsvFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy', // ignores lines containing only whitespace
      complete: (results) => {
        resolve(results.data)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

/**
 * Validates parsed CSV rows client-side based on project rules.
 *
 * @param {Array<Object>} rows - Parsed rows from CSV.
 * @returns {Object} { errors: Array<Object>, validatedRows: Array<Object> }
 */
export const validateCsvRows = (rows) => {
  const errors = []
  const validatedRows = []
  const aliasSeen = new Set()

  rows.forEach((row, index) => {
    const rowNum = index + 1
    const originalUrl = row.originalUrl?.trim() || row.url?.trim() || ''
    const customAlias = row.customAlias?.trim() || row.alias?.trim() || ''

    // Detect empty rows
    if (!originalUrl && !customAlias) {
      errors.push({
        row: rowNum,
        field: 'all',
        message: 'Empty row detected',
      })
      return
    }

    const rowErrors = []

    // Validate URL format
    if (!originalUrl) {
      rowErrors.push({
        row: rowNum,
        field: 'originalUrl',
        message: 'Original URL is required',
      })
    } else if (!URL_REGEX.test(originalUrl)) {
      rowErrors.push({
        row: rowNum,
        field: 'originalUrl',
        message: 'Invalid URL format (must start with http:// or https://)',
      })
    }

    // Validate alias format and duplicates
    if (customAlias) {
      if (!ALIAS_REGEX.test(customAlias)) {
        rowErrors.push({
          row: rowNum,
          field: 'customAlias',
          message: 'Alias must be 4–32 characters (letters, numbers, hyphens, or underscores)',
        })
      } else if (aliasSeen.has(customAlias)) {
        rowErrors.push({
          row: rowNum,
          field: 'customAlias',
          message: `Duplicate custom alias "${customAlias}" detected in this file`,
        })
      } else {
        aliasSeen.add(customAlias)
      }
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors)
    } else {
      validatedRows.push({
        originalUrl,
        customAlias: customAlias || undefined,
      })
    }
  })

  return {
    errors,
    validatedRows,
  }
}

/**
 * Generates a result CSV file layout containing upload status and returned links.
 *
 * @param {Array<Object>} results - Upload results array returned from backend.
 * @returns {string} The formatted CSV content.
 */
export const generateResultCsv = (results) => {
  const mapped = results.map((row) => ({
    originalUrl: row.originalUrl || '',
    customAlias: row.customAlias || '',
    status: row.status || 'failed',
    shortUrl: row.url || '',
    error: row.error?.message || '',
  }))

  return Papa.unparse(mapped)
}
