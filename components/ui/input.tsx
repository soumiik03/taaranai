import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-none border border-[#262626] bg-[#0D0D0F] px-3 py-1 text-xs shadow-none transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-[#8B8B92] focus-visible:outline-none focus-visible:border-[#525252] disabled:cursor-not-allowed disabled:opacity-50 text-[#FAFAFA]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
