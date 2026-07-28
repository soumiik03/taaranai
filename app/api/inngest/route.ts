import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { helloWorld } from '@/lib/inngest/functions/hello'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    // Chapter 9 onward: clarify-request, generate-prd, generate-tasks,
    // review-pr will all get added to this array as you build them.
  ],
})

