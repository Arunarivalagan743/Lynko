import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import AuthShell from '../../components/layout/AuthShell.jsx'
import Button from '../../components/ui/Button.jsx'
import FieldMessage from '../../components/ui/FieldMessage.jsx'
import Input from '../../components/ui/Input.jsx'
import { forgotPasswordSchema } from '../../schemas/authSchemas.js'
import { forgotPassword } from '../../services/authApi.js'

const ForgotPassword = () => {
  const [apiError, setApiError] = useState('')
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values) => {
    setApiError('')
    try {
      await forgotPassword(values)
      setSent(true)
      toast.success('Reset instructions sent')
    } catch (err) {
      const message = err?.response?.data?.message || 'Request failed'
      setApiError(message)
      toast.error(message)
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We will send a secure reset link to your verified email."
      footer={
        <span>
          Remembered your password?{' '}
          <Link to="/login" className="text-primary">
            Back to login
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Work email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        {apiError && <FieldMessage tone="error">{apiError}</FieldMessage>}
        {sent ? (
          <FieldMessage tone="success">
            If that email has an account, a reset link has been sent. Check your inbox.
          </FieldMessage>
        ) : (
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Send reset link
          </Button>
        )}
      </form>
    </AuthShell>
  )
}

export default ForgotPassword
