import { CheckCircle2, Loader2 } from 'lucide-react'

type WorkflowStatusProps = {
  status: 'PENDING' | 'READY'
  hasPrd: boolean
}

export function WorkflowStatus({ status, hasPrd }: WorkflowStatusProps) {
  const preparingPrd = status === 'READY' && !hasPrd
  const title = preparingPrd ? 'Preparing your PRD' : 'Preparing clarification questions'
  const description = preparingPrd
    ? 'Your requirements are complete. The Product Requirements Document will appear here shortly.'
    : 'Your request has been received. This page will update when the first review is complete.'

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {preparingPrd ? <CheckCircle2 className="size-5" /> : <Loader2 className="size-5 animate-spin" />}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
