import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-none border border-[#262626] bg-[#0D0D0F] px-3 py-2 text-xs shadow-none placeholder:text-[#8B8B92] focus-visible:outline-none focus-visible:border-[#525252] disabled:cursor-not-allowed disabled:opacity-50 text-[#FAFAFA]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
