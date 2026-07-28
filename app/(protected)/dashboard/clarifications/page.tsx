// app/(protected)/dashboard/clarifications/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActiveOrganization } from '@/lib/session'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { getClarificationQuestions } from '@/features/requests/actions'
import { ClarificationChat } from '@/features/requests/components/clarification-chat'
import { StatusPoller } from '@/features/requests/components/status-poller'
import { ProcessingView } from '@/features/requests/components/processing-view'
import { WorkflowStatus } from '@/features/requests/components/workflow-status'
import { HelpCircle, Sparkles, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ClarificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; flow?: string }>
}) {
  const { id: selectedId, flow } = await searchParams
  const org = await getActiveOrganization()
  if (!org) notFound()

  // Fetch feature requests that need clarification or are pending/recently clarified
  const requests = await prisma.featureRequest.findMany({
    where: {
      organizationId: org.id,
      status: { in: ['CLARIFYING', 'PENDING', 'READY'] },
    },
    include: {
      clarificationQuestions: true,
      prd: { select: { id: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Determine active request
  const activeRequest =
    requests.find((r) => r.id === selectedId) ||
    requests.find((r) => r.status === 'CLARIFYING') ||
    requests[0] ||
    null

  let questions: Awaited<ReturnType<typeof getClarificationQuestions>> = []
  if (activeRequest && activeRequest.status === 'CLARIFYING') {
    questions = await getClarificationQuestions(activeRequest.id)
  }

  const hasPendingQuestions = questions.some((q) => q.status === 'PENDING')
  const activePrdId = activeRequest?.prd?.id ?? null

  const showProcessingView = 
    flow === 'new' && 
    activeRequest && 
    (activeRequest.status === 'PENDING' || 
     (activeRequest.status === 'CLARIFYING' && !hasPendingQuestions) ||
     (activeRequest.status === 'READY' && !activePrdId))

  if (showProcessingView) {
    return (
      <div className="p-8 max-w-7xl mx-auto mt-20">
        <ProcessingView 
          status={activeRequest.status}
          hasPendingQuestions={hasPendingQuestions}
          prdId={activePrdId}
          autoRedirectOnReady={true}
        />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {activeRequest && (
        <StatusPoller
          status={activeRequest.status}
          hasPendingQuestions={hasPendingQuestions}
          prdId={activePrdId}
          autoRedirectOnReady={flow === 'new'}
          intervalMs={1000}
          autoRedirectPath={activePrdId ? `/dashboard/prd/${activePrdId}?flow=new` : undefined}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <HelpCircle className="h-6 w-6 text-indigo-400" />
            AI Clarifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Answer questions asked by the AI analyst to clarify requirements before generating your PRD.
          </p>
        </div>
        <Link href="/dashboard/feature-requests">
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Feature Requests
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4 bg-muted/10">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No pending AI questions</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              All your feature requests have enough details or are already processed into PRDs.
            </p>
          </div>
          <Link href="/dashboard/feature-requests">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
              Create New Feature Request
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Requests Selection List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Active Feature Requests
            </h2>
            <div className="space-y-2">
              {requests.map((req) => {
                const isSelected = activeRequest?.id === req.id
                const pendingQCount = req.clarificationQuestions.filter(
                  (q) => q.status === 'PENDING'
                ).length

                return (
                  <Link
                    key={req.id}
                    href={`/dashboard/clarifications?id=${req.id}`}
                    className={`block rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-indigo-500/50 bg-indigo-500/10 shadow-sm'
                        : 'border-border bg-card hover:border-border/80 hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm line-clamp-1">{req.title}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 border ${
                          req.status === 'CLARIFYING'
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                            : req.status === 'READY'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {pendingQCount > 0 ? (
                          <span className="text-amber-400 font-medium">
                            {pendingQCount} question{pendingQCount > 1 ? 's' : ''} pending
                          </span>
                        ) : (
                          <span>{req.clarificationQuestions.length} questions</span>
                        )}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Clarification Chat Area */}
          <div className="lg:col-span-8 rounded-xl border border-border bg-card p-6 shadow-sm min-h-[450px]">
            {activeRequest ? (
              <div className="space-y-6">
                <div className="border-b border-border pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      Selected Request
                    </span>
                    <h2 className="text-xl font-bold mt-0.5">{activeRequest.title}</h2>
                  </div>
                  <Link
                    href={`/dashboard/feature-requests/${activeRequest.id}`}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    View Request Details →
                  </Link>
                </div>
                {activeRequest.status === 'PENDING' && (
                  <WorkflowStatus status="PENDING" hasPrd={Boolean(activePrdId)} />
                )}

                {activeRequest.status === 'CLARIFYING' && (
                  <div className="space-y-4">
                    <ClarificationChat questions={questions} />
                  </div>
                )}

                {activeRequest.status === 'READY' && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-4 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                    <div>
                      <h3 className="font-semibold text-emerald-300 text-lg">All Questions Answered!</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                        This feature request has sufficient context. The Product Requirement Document has been generated.
                      </p>
                    </div>
                    {activePrdId ? (
                      <Link href={`/dashboard/prd/${activePrdId}`}>
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
                          Go to PRD Editor →
                        </button>
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-foreground animate-pulse">Generating PRD...</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Select a feature request on the left to view AI questions.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
