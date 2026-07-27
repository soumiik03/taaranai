// app/(protected)/dashboard/feature-requests/page.tsx
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { getFeatureRequests } from '@/features/requests/actions'
import { statusStyles } from '@/features/dashboard/lib/status-styles'

export default async function FeatureRequestsPage() {
  const requests = await getFeatureRequests()

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Feature Requests</h1>
        <Link href="/dashboard/feature-requests/new" className={buttonVariants()}>
          New Feature Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-10 text-center text-muted-foreground">
          No feature requests yet. Create your first one to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/feature-requests/${r.id}`}
              className="flex items-center justify-between rounded-md border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-muted-foreground">
                  {r.sourceType.toLowerCase()} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={statusStyles[r.status]}>{r.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}