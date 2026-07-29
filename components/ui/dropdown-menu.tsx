"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left w-full">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

  const handleClick = () => {
    context.setOpen((prev) => !prev)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler; "aria-expanded"?: boolean }>, {
      onClick: (e: React.MouseEvent) => {
        (children.props as { onClick?: React.MouseEventHandler }).onClick?.(e)
        handleClick()
      },
      "aria-expanded": context.open,
    })
  }

  return (
    <button type="button" onClick={handleClick} aria-expanded={context.open}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  align = "start",
  className,
}: {
  children: React.ReactNode
  align?: "start" | "end" | "center"
  className?: string
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

  if (!context.open) return null

  const alignClass =
    align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 min-w-[12rem] overflow-hidden rounded-none border border-[#262626] bg-[#0D0D0F] p-1 text-[#FAFAFA] shadow-none",
        alignClass,
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  children,
  disabled,
  onClick,
  className,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
}) {
  const context = React.useContext(DropdownMenuContext)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    onClick?.(e)
    context?.setOpen(false)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-none px-3 py-1.5 text-xs outline-none transition-colors hover:bg-[#1F1F23] disabled:pointer-events-none disabled:opacity-40 text-left font-medium",
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-[#262626]", className)} />
}
