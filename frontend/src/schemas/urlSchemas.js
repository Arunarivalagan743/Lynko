import { z } from 'zod'

const SHORT_CODE_REGEX = /^[a-zA-Z0-9_-]{4,32}$/

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'Original URL is required')
    .url('Please enter a valid URL')
    .max(2048, 'URL exceeds max length of 2048 characters'),
  customAlias: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || SHORT_CODE_REGEX.test(val),
      {
        message: 'Alias must be 4–32 characters and only contain letters, numbers, hyphens, or underscores',
      }
    )
    .optional(),
  expiresAt: z
    .string()
    .refine(
      (val) => val === '' || new Date(val) > new Date(),
      {
        message: 'Expiration date must be in the future',
      }
    )
    .optional(),
  platforms: z.array(z.string()).optional(),
})

export const updateUrlSchema = z
  .object({
    originalUrl: z
      .string()
      .url('Please enter a valid URL')
      .max(2048, 'URL exceeds max length of 2048 characters')
      .optional()
      .or(z.literal('')),
    expiresAt: z
      .string()
      .refine(
        (val) => val === '' || new Date(val) > new Date(),
        {
          message: 'Expiration date must be in the future',
        }
      )
      .optional()
      .or(z.literal('')),
    platforms: z.array(z.string()).optional(),
  })
  .refine(
    (values) =>
      (values.originalUrl && values.originalUrl !== '') ||
      (values.expiresAt && values.expiresAt !== '') ||
      (values.platforms && values.platforms.length > 0),
    {
      message: 'At least one field (Original URL, Expiration Date or Platforms) must be provided to update',
      path: ['originalUrl'],
    }
  )
