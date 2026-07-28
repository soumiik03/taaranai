import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { helloWorld } from '@/lib/inngest/functions/hello'
import { clarifyFeatureRequest, recheckClarification } from '@/lib/inngest/functions/clarify-request'
import { generatePrd } from '@/lib/inngest/functions/generate-prd'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    clarifyFeatureRequest,
    recheckClarification,
    generatePrd,
  ],
})
