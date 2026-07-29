import React from 'react'
import { cn } from '@/lib/utils'

interface AIThinkingIndicatorProps {
  label?: string
  className?: string
}

export function AIThinkingIndicator({
  label = 'AI thinking...',
  className,
}: AIThinkingIndicatorProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 text-xs text-muted-foreground font-medium', className)}>
      <span className="inline-flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-typing-dot-1" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-typing-dot-2" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-typing-dot-3" />
      </span>
      {label && <span>{label}</span>}
    </div>
  )
}
