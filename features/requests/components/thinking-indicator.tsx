'use client'

interface ThinkingIndicatorProps {
  text?: string
  className?: string
}

export function ThinkingIndicator({
  text = 'Processing your request...',
  className = '',
}: ThinkingIndicatorProps) {
  return (
    <div className={'inline-flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground ' + className}>
      <span className='h-2 w-2 rounded-full bg-indigo-400 animate-pulse' aria-hidden='true' />
      <span>{text}</span>
    </div>
  )
}