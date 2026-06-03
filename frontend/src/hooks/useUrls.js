import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import {
  createUrl as createUrlRequest,
  getUrls as getUrlsRequest,
  getUrlById as getUrlByIdRequest,
  updateUrl as updateUrlRequest,
  deleteUrl as deleteUrlRequest,
} from '../api/urlApi.js'

/**
 * Custom hook to encapsulate business logic, asynchronous operations,
 * optimistic updates, and state management for URL CRUD operations.
 */
export const useUrls = () => {
  const [urls, setUrls] = useState([])
  const [selectedUrl, setSelectedUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Loading states for separate actions
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch all URLs for the authenticated user
  const fetchUrls = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getUrlsRequest()
      // Structure expected: { urls: [ ... ] } or [ ... ]
      const list = response.urls || response || []
      setUrls(list)
      return list
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load links'
      setError(msg)
      toast.error(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch a single URL details by ID
  const fetchUrlById = useCallback(async (id) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getUrlByIdRequest(id)
      const data = response.url || response
      setSelectedUrl(data)
      return data
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load link details'
      setError(msg)
      toast.error(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Create a new short link
  const addUrl = async (payload) => {
    setCreateLoading(true)
    try {
      const response = await createUrlRequest(payload)
      const newUrl = response.url || response
      if (response.platformLinks) {
        newUrl.platformLinks = response.platformLinks
      }
      if (response.qrCodeDataUrl) {
        newUrl.qrCodeDataUrl = response.qrCodeDataUrl
      }

      // Immediate cache append
      setUrls((prev) => [newUrl, ...prev])
      toast.success('Link created successfully')
      return newUrl
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to create link'
      toast.error(msg)
      throw err
    } finally {
      setCreateLoading(false)
    }
  }

  // Modify destination or constraints of an existing link (with Optimistic Updates)
  const modifyUrl = async (id, payload) => {
    const originalUrls = [...urls]
    const originalSelectedUrl = selectedUrl ? { ...selectedUrl } : null

    // Optimistic state change
    setUrls((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...payload } : item))
    )
    if (selectedUrl?._id === id) {
      setSelectedUrl((prev) => ({ ...prev, ...payload }))
    }

    setUpdateLoading(true)
    try {
      const response = await updateUrlRequest(id, payload)
      const updatedUrl = response.url || response

      // Synchronize exact server-side result (which includes click counts, dates)
      setUrls((prev) =>
        prev.map((item) => (item._id === id ? updatedUrl : item))
      )
      if (selectedUrl?._id === id) {
        setSelectedUrl(updatedUrl)
      }

      toast.success('Link updated successfully')
      return updatedUrl
    } catch (err) {
      // Rollback to previous state on validation/request failure
      setUrls(originalUrls)
      if (originalSelectedUrl) {
        setSelectedUrl(originalSelectedUrl)
      }
      const msg = err?.response?.data?.message || err.message || 'Failed to modify link'
      toast.error(msg)
      throw err
    } finally {
      setUpdateLoading(false)
    }
  }

  // Delete short link (with Optimistic Rollback)
  const removeUrl = async (id) => {
    const originalUrls = [...urls]

    // Optimistic deletion
    setUrls((prev) => prev.filter((item) => item._id !== id))

    setDeleteLoading(true)
    try {
      await deleteUrlRequest(id)
      toast.success('Link deleted successfully')
      if (selectedUrl?._id === id) {
        setSelectedUrl(null)
      }
    } catch (err) {
      // Rollback list state if delete request fails
      setUrls(originalUrls)
      const msg = err?.response?.data?.message || err.message || 'Failed to delete link'
      toast.error(msg)
      throw err
    } finally {
      setDeleteLoading(false)
    }
  }

  return {
    urls,
    selectedUrl,
    isLoading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,
    fetchUrls,
    fetchUrlById,
    addUrl,
    modifyUrl,
    removeUrl,
  }
}
