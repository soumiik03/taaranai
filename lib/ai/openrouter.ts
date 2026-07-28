import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { env } from '@/lib/env'

export const openrouterProvider = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '',
})

export const clarificationModel = openrouterProvider('openai/gpt-4o-mini')
