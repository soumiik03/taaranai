import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent text-xs font-semibold whitespace-nowrap transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-[#7C6EF2] text-white hover:bg-[#6C5CE7]",
        outline:
          "border-[#1F1F23] bg-transparent text-[#F5F5F5] hover:bg-[#111113] hover:border-[#2F2F35]",
        secondary:
          "border border-[#1F1F23] bg-[#111113] text-[#F5F5F5] hover:bg-[#161619]",
        ghost:
          "text-[#8A8A93] hover:bg-[#111113] hover:text-[#F5F5F5]",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#DC2626]",
        link: "text-[#7C6EF2] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-3",
        xs: "h-6 gap-1 px-2 text-[11px]",
        sm: "h-7 gap-1.5 px-2.5",
        lg: "h-9 gap-2 px-4 text-sm",
        icon: "size-8",
        "icon-xs": "size-6",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
