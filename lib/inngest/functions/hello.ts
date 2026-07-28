import { inngest } from '@/lib/inngest/client'

export const helloWorld = inngest.createFunction(
  {
    id: 'hello-world',
    triggers: [{ event: 'test/hello.world' }],
  },
  async ({ event, step }) => {
    await step.sleep('wait-a-sec', '1s')
    return { message: `Hello ${event.data?.name || 'World'}!` }
  }
)
