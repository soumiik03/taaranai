'use client'

interface ThinkingIndicatorProps {
  text?: string
  className?: string
}

export function ThinkingIndicator({
  text = 'Thinking through your request...',
  className = '',
}: ThinkingIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 text-xs font-medium backdrop-blur-sm shadow-sm ${className}`}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="size-2 rounded-full bg-indigo-400 animate-typing-dot-1" />
        <span className="size-2 rounded-full bg-indigo-400 animate-typing-dot-2" />
        <span className="size-2 rounded-full bg-indigo-400 animate-typing-dot-3" />
      </div>
      <span className="tracking-wide">{text}</span>
    </div>
  )
}
