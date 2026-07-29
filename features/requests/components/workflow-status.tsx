import { CheckCircle2 } from 'lucide-react'
import { ThinkingIndicator } from './thinking-indicator'

type WorkflowStatusProps = {
  status: 'PENDING' | 'READY'
  hasPrd: boolean
}

export function WorkflowStatus({ status, hasPrd }: WorkflowStatusProps) {
  const preparingPrd = status === 'READY' && !hasPrd
  const title = preparingPrd ? 'Preparing your PRD' : 'Preparing clarification questions'
  const text = preparingPrd
    ? 'Generating Product Requirements Document (PRD)...'
    : 'Thinking through your request and preparing questions...'

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-indigo-500/30 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ThinkingIndicator text={text} />
    </div>
  )
}
