// app/(protected)/dashboard/feature-requests/[id]/page.tsx
import { notFound } from 'next/navigation'
import {
  getFeatureRequest,
  getClarificationQuestions,
  deleteFeatureRequest,
} from '@/features/requests/actions'
import { RequestForm } from '@/features/requests/components/request-form'
import { ClarificationChat } from '@/features/requests/components/clarification-chat'
import { StatusPoller } from '@/features/requests/components/status-poller'
import { Button } from '@/components/ui/button'

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  CLARIFYING: 'Clarifying',
  READY: 'Ready',
  REJECTED: 'Rejected',
}

export default async function FeatureRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await getFeatureRequest(id)
  if (!request) notFound()

  const questions =
    request.status === 'CLARIFYING' ? await getClarificationQuestions(id) : []
  const hasPendingQuestions = questions.some((q) => q.status === 'PENDING')
  const prdId = (request as any).prd?.id ?? null

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <StatusPoller
        status={request.status}
        hasPendingQuestions={hasPendingQuestions}
        prdId={prdId}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-semibold">{request.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Status: <span className="font-medium text-foreground">{statusLabels[request.status]}</span>
          </p>
        </div>
        <form
          action={async () => {
            'use server'
            await deleteFeatureRequest(id)
          }}
        >
          <Button variant="destructive" type="submit">
            Delete
          </Button>
        </form>
      </div>

      {/* Status Notice Banners */}
      {request.status === 'CLARIFYING' && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span>AI analyst has asked clarifying questions for this request.</span>
          </div>
          <a
            href={`/dashboard/clarifications?id=${id}`}
            className="font-semibold text-amber-400 hover:underline shrink-0 ml-2"
          >
            Answer AI Questions →
          </a>
        </div>
      )}

      {request.status === 'PENDING' && (
        <div className="flex items-center space-x-3 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          <span>Reviewing your request... AI is analyzing your input.</span>
        </div>
      )}

      <RequestForm
        mode="edit"
        requestId={request.id}
        defaultValues={{
          title: request.title,
          description: request.description,
          sourceType: request.sourceType,
        }}
      />
    </div>
  )
}