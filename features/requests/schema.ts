import { z } from 'zod'

export const featureRequestSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title is too long'),
  description: z
    .string()
    .min(10, 'Give a bit more detail — at least 10 characters')
    .max(5000, 'Description is too long'),
  sourceType: z.enum(['EMAIL', 'TICKET', 'CALL', 'MANUAL']),
})

export type FeatureRequestInput = z.infer<typeof featureRequestSchema>