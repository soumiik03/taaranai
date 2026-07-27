import { App } from '@octokit/app'
import { env } from '@/lib/env'

export const githubApp = new App({
  appId: env.GITHUB_APP_ID,
  privateKey: env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  webhooks: {
    secret: env.GITHUB_WEBHOOK_SECRET,
  },
})
