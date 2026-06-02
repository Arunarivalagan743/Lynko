import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import AuthShell from '../../components/layout/AuthShell.jsx'
import Button from '../../components/ui/Button.jsx'
import FieldMessage from '../../components/ui/FieldMessage.jsx'
import Input from '../../components/ui/Input.jsx'
import PasswordInput from '../../components/ui/PasswordInput.jsx'
import { resetPasswordSchema } from '../../schemas/authSchemas.js'
import { resetPassword } from '../../services/authApi.js'

const ResetPassword = () => {
  const [apiError, setApiError] = useState('')
  const [params] = useSearchParams()
  const token = useMemo(() => params.get('token') || '', [params])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    setApiError('')
    try {
      await resetPassword({ token: values.token, password: values.password })
      toast.success('Password updated')
    } catch (err) {
      const message = err?.response?.data?.message || 'Reset failed'
      setApiError(message)
      toast.error(message)
    }
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Keep your workspace secured with a strong, unique password."
      footer={
        <span>
          Need a new reset link?{' '}
          <Link to="/forgot-password" className="text-primary">
            Request one
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Reset token"
          type="text"
          placeholder="Paste your reset token"
          error={errors.token?.message}
          {...register('token')}
        />
        <PasswordInput
          label="New password"
          placeholder="Create a new password"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {apiError && <FieldMessage tone="error">{apiError}</FieldMessage>}
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </AuthShell>
  )
}

export default ResetPassword
