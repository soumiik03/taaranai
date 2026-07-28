// app/(protected)/dashboard/shipped/page.tsx
import Link from 'next/link'
import { getShippedFeatures } from '@/features/shipped/actions'
import { ShippedFeatureCard } from '@/features/shipped/components/shipped-feature-card'
import { Ship, Sparkles, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ShippedFeaturesPage() {
  const shippedFeatures = await getShippedFeatures()

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
              <Ship className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Shipped Features
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete delivery timeline of all features reviewed, approved, and released to production.
          </p>
        </div>

        <Link
          href="/dashboard/feature-requests"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>View All Feature Requests</span>
        </Link>
      </div>

      {/* Shipped List / Empty State */}
      {shippedFeatures.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm space-y-4">
          <Ship className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <div>
            <h3 className="text-base font-bold text-foreground">No Features Shipped Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Once an AI review completes with zero blocking issues and a human reviewer approves it on the Approval page, the feature will appear here with its full delivery timeline.
            </p>
          </div>
          <Link
            href="/dashboard/feature-requests"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/30 transition-colors"
          >
            <span>Check Pending Feature Requests</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {shippedFeatures.map((feature) => (
            <ShippedFeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      )}
    </div>
  )
}
