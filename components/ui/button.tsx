import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent text-xs font-semibold whitespace-nowrap transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E5E5E5]",
        outline:
          "border-[#262626] bg-[#0D0D0F] text-[#FAFAFA] hover:bg-[#1F1F23]",
        secondary:
          "border border-[#262626] bg-[#0D0D0F] text-[#FAFAFA] hover:bg-[#1F1F23]",
        ghost:
          "text-[#8B8B92] hover:bg-[#1F1F23] hover:text-[#FAFAFA]",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#DC2626]",
        link: "text-[#6C5DD3] underline-offset-4 hover:underline",
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
