import { useState, useCallback } from 'react'

/**
 * Custom hook to standardise and aggregate loading states,
 * exposing helpers to manage async promise callbacks.
 *
 * @param {Object} initialStates - Initial loading states (e.g. { fetch: false, submit: false }).
 */
export const useLoadingState = (initialStates = {}) => {
  const [loaders, setLoaders] = useState(initialStates)

  const startLoading = useCallback((key) => {
    setLoaders((prev) => ({ ...prev, [key]: true }))
  }, [])

  const stopLoading = useCallback((key) => {
    setLoaders((prev) => ({ ...prev, [key]: false }))
  }, [])

  const isLoading = useCallback((key) => {
    return Boolean(loaders[key])
  }, [loaders])

  const isAnyLoading = useCallback(() => {
    return Object.values(loaders).some((value) => Boolean(value))
  }, [loaders])

  /**
   * Wraps an asynchronous operation to toggle loading states.
   *
   * @param {string} key - The loader key to manage.
   * @param {Function} asyncFn - The async function callback.
   * @returns {Promise<any>}
   */
  const withLoading = useCallback(async (key, asyncFn) => {
    startLoading(key)
    try {
      return await asyncFn()
    } finally {
      stopLoading(key)
    }
  }, [startLoading, stopLoading])

  return {
    loaders,
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
    withLoading,
  }
}
