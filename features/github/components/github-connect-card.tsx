// features/github/components/github-connect-card.tsx
import { buttonVariants } from '@/components/ui/button'
import { env } from '@/lib/env'

export function GithubConnectCard() {
  const rawSlug = env.NEXT_PUBLIC_GITHUB_APP_SLUG || ''
  const slug = rawSlug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
  const installUrl = `https://github.com/apps/${slug}/installations/new`

  return (
    <div className="rounded-md border border-dashed border-border p-6 text-center space-y-3">
      <p className="font-medium">Connect GitHub</p>
      <p className="text-sm text-muted-foreground">
        Install the Taarana GitHub App to enable AI PR reviews.
      </p>
      <a href={installUrl} className={buttonVariants()}>
        Connect GitHub Repository
      </a>
    </div>
  )
}