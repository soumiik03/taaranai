// app/(protected)/dashboard/approval/[featureId]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getApprovalDetails } from '@/features/approval/actions'
import { ApprovalSummary } from '@/features/approval/components/approval-summary'
import { ApprovalActions } from '@/features/approval/components/approval-actions'
import { ArrowLeft } from 'lucide-react'

export default async function FeatureApprovalPage({
  params,
}: {
  params: Promise<{ featureId: string }>
}) {
  const { featureId } = await params
  const details = await getApprovalDetails(featureId)

  if (!details || !details.featureRequest) {
    notFound()
  }

  const isShipped = details.pullRequest?.status === 'SHIPPED'

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/feature-requests/${featureId}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feature Request</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400">
            {isShipped ? 'Feature Shipped' : 'Ready for Human Approval'}
          </span>
        </div>
      </div>

      {/* Main Content Component */}
      <ApprovalSummary data={details} />

      {/* Action Footer */}
      {details.pullRequest && (
        <ApprovalActions
          featureId={featureId}
          pullRequestId={details.pullRequest.id}
          isAlreadyShipped={isShipped}
        />
      )}
    </div>
  )
}
