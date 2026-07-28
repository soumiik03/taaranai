import { OpenRouter } from '@openrouter/sdk'
import { env } from '@/lib/env'

export const openrouter = new OpenRouter({
  apiKey: env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '',
})

export const DEFAULT_MODEL = 'openai/gpt-oss-20b:free'
