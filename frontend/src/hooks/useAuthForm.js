import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'

/**
 * Custom hook to encapsulate React Hook Form validation, Zod resolvers, 
 * loading states, and backend field error mapping for authentication forms.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against.
 * @param {Function} onSubmit - The async function to call on successful form validation.
 * @param {Object} defaultValues - Default values for form fields.
 */
export const useAuthForm = (schema, onSubmit, defaultValues = {}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched', // Validate inputs when user blurs out of them
  })

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data)
    } catch (err) {
      const status = err?.response?.status
      const message = err?.response?.data?.message || err.message || 'An unexpected error occurred'
      const details = err?.response?.data?.details

      // If backend validation details are present, map them to form fields
      if (details) {
        if (details.fieldErrors) {
          // Flattened Zod errors format: { fieldErrors: { email: ['invalid email'], password: [...] } }
          Object.entries(details.fieldErrors).forEach(([field, messages]) => {
            setError(field, {
              type: 'server',
              message: Array.isArray(messages) ? messages[0] : messages,
            })
          })
        } else if (Array.isArray(details)) {
          // Standard Zod array issue format: [ { path: ['email'], message: 'invalid email' } ]
          details.forEach((issue) => {
            const field = issue.path?.[0]
            if (field) {
              setError(field, {
                type: 'server',
                message: issue.message,
              })
            }
          })
        }
      } else {
        // Fallback to toast if no specific field details are available
        toast.error(message)
      }

      // Re-throw to allow component-level catch if needed
      throw err
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    isSubmitting,
    isValid,
    isDirty,
    reset,
    setError,
  }
}
