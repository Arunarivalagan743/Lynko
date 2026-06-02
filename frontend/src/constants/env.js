import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url('VITE_API_URL must be a valid URL'),
  VITE_APP_NAME: z.string().min(1, 'VITE_APP_NAME is required').default('Lynko'),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
})

// Extract relevant env variables
const parsed = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  MODE: import.meta.env.MODE,
})

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.format())
  throw new Error('Invalid environment configuration. Please check your .env file.')
}

export const ENV = parsed.data
