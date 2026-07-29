'use client'

import { StatusPoller } from './status-poller'

interface ProcessingViewProps {
  requestId: string
  status: string
  hasPendingQuestions: boolean
  prdId?: string | null
  autoRedirectOnReady?: boolean
}

export function ProcessingView({
  requestId,
  status,
  hasPendingQuestions,
  prdId,
  autoRedirectOnReady,
}: ProcessingViewProps) {
  const message =
    status === 'PENDING'
      ? 'Preparing clarification questions'
      : status === 'CLARIFYING' && !hasPendingQuestions
        ? 'Reviewing your answers'
        : 'Preparing your PRD'

  return (
    <div className='mx-auto flex min-h-[360px] max-w-xl items-center justify-center'>
      <StatusPoller
        requestId={requestId}
        status={status}
        hasPendingQuestions={hasPendingQuestions}
        prdId={prdId}
        autoRedirectOnReady={autoRedirectOnReady}
        autoRedirectPath={prdId ? '/dashboard/prd/' + prdId + '?flow=new' : undefined}
      />
      <div className='w-full rounded-xl border border-border bg-card p-8 text-center'>
        <div className='mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-indigo-400/40 text-indigo-300'>
          <span className='h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse' aria-hidden='true' />
        </div>
        <h2 className='text-lg font-semibold tracking-tight text-foreground'>{message}</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          This page will update automatically when the next step is ready.
        </p>
      </div>
    </div>
  )
}