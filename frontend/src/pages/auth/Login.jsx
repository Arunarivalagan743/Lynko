import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import AuthShell from '../../components/layout/AuthShell.jsx'
import Button from '../../components/ui/Button.jsx'
import FieldMessage from '../../components/ui/FieldMessage.jsx'
import Input from '../../components/ui/Input.jsx'
import PasswordInput from '../../components/ui/PasswordInput.jsx'
import { loginSchema } from '../../schemas/authSchemas.js'
import { useAuth } from '../../context/AuthContext.jsx'
import loginImg from '../../assets/loginjsx.png'

const Login = () => {
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    setApiError('')
    try {
      await login(values)
      toast.success('Welcome back')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed'
      setApiError(message)
      toast.error(message)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage short links, analytics, and team access."
      illustration={loginImg}
      footer={
        <span>
          New to Lynko?{' '}
          <Link to="/signup" className="text-primary">
            Create an account
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
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-text-muted hover:text-text">
            Forgot password?
          </Link>
        </div>
        {apiError && <FieldMessage tone="error">{apiError}</FieldMessage>}
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}

export default Login
