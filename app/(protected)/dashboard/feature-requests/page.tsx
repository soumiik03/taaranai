import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { getFeatureRequests } from '@/features/requests/actions'
import { FeatureRequestList } from '@/features/requests/components/feature-request-list'
import { Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FeatureRequestsPage() {
  const requests = await getFeatureRequests()

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            Feature Requests
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Submit and track product feature requests processed by the AI pipeline.
          </p>
        </div>
        <Link href="/dashboard/feature-requests/new" className={buttonVariants()}>
          New Feature Request
        </Link>
      </div>

      <FeatureRequestList initialRequests={requests} />
    </div>
  )
}
