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
import { signupSchema } from '../../schemas/authSchemas.js'
import { useAuth } from '../../context/AuthContext.jsx'
import signupImg from '../../assets/illustrations/signupjsx.png'

const Signup = () => {
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()
  const { signup } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    setApiError('')
    try {
      await signup({ email: values.email, password: values.password })
      toast.success('Account created')
      navigate('/login', { replace: true })
    } catch (err) {
      const message = err?.response?.data?.message || 'Signup failed'
      setApiError(message)
      toast.error(message)
    }
  }

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Start shortening links with enterprise-grade analytics in minutes."
      illustration={signupImg}
      footer={
        <span>
          Already have an account?{' '}
          <Link to="/login" className="text-primary">
            Sign in
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
          placeholder="Create a password"
          hint="Minimum 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {apiError && <FieldMessage tone="error">{apiError}</FieldMessage>}
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}

export default Signup
