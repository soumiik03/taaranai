"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectContextValue {
  value: string
  setValue: (value: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  labels: Record<string, React.ReactNode>
  registerLabel: (value: string, label: React.ReactNode) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function Select({ value: controlledValue, defaultValue = "", onValueChange, children }: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({})

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const setValue = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
    setLabels((prev) => (prev[val] === label ? prev : { ...prev, [val]: label }))
  }, [])

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
    <SelectContext.Provider value={{ value, setValue, open, setOpen, labels, registerLabel }}>
      <div ref={ref} className="relative inline-block w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectTrigger must be used within Select")

  return (
    <button
      type="button"
      onClick={() => context.setOpen((prev) => !prev)}
      className={cn(
        "flex h-9 w-full items-center justify-between border border-[#262626] bg-[#0D0D0F] px-3 py-1 text-xs text-[#FAFAFA] transition-colors hover:bg-[#1F1F23] focus:outline-none focus:border-[#525252]",
        className
      )}
    >
      {children}
      <ChevronDown className="size-3.5 text-[#8B8B92]" />
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectValue must be used within Select")

  const selectedLabel = context.labels[context.value] ?? context.value

  return (
    <span className={cn("truncate", !context.value && "text-[#8B8B92]")}>
      {selectedLabel || placeholder || "Select..."}
    </span>
  )
}

export function SelectContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectContent must be used within Select")

  if (!context.open) return null

  return (
    <div
      className={cn(
        "absolute left-0 top-full z-50 mt-1 w-full overflow-hidden border border-[#262626] bg-[#0D0D0F] p-1 text-[#FAFAFA] shadow-lg",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SelectItem({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectItem must be used within Select")

  React.useEffect(() => {
    context.registerLabel(value, children)
  }, [value, children, context])

  const isSelected = context.value === value

  return (
    <button
      type="button"
      onClick={() => {
        context.setValue(value)
        context.setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center px-3 py-1.5 text-xs outline-none transition-colors hover:bg-[#1F1F23]",
        isSelected && "bg-[#1F1F23] font-medium",
        className
      )}
    >
      {children}
    </button>
  )
}
