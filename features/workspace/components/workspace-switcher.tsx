'use client'

import { useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { switchWorkspace } from '../actions'
import { ChevronDown, Check } from 'lucide-react'

type Org = { id: string; name: string }

export function WorkspaceSwitcher({
  organizations,
  activeOrgId,
}: {
  organizations: Org[]
  activeOrgId: string
}) {
  const [isPending, startTransition] = useTransition()
  const active = organizations.find((o) => o.id === activeOrgId)
  const displayName = active?.name ?? 'My Workspace'
  const activeInitial = displayName.substring(0, 1).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="group flex items-center gap-2.5 rounded-md border border-[#1F1F23] bg-[#111113] px-3 py-1.5 text-xs font-medium text-[#F5F5F5] hover:bg-[#161619] hover:border-[#2F2F35] transition-colors outline-none cursor-pointer"
        >
          <div className="flex size-4 items-center justify-center rounded bg-[#7C6EF2]/20 text-[10px] font-bold text-[#7C6EF2]">
            {activeInitial}
          </div>
          <span className="truncate max-w-[140px] font-medium">{displayName}</span>
          <ChevronDown className="size-3.5 text-[#8A8A93] group-hover:text-[#F5F5F5] transition-colors ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 border-[#1F1F23] bg-[#111113] p-1 shadow-none rounded-md">
        {organizations.map((org) => {
          const isSelected = org.id === activeOrgId
          return (
            <DropdownMenuItem
              key={org.id}
              disabled={isSelected}
              onClick={() => startTransition(() => switchWorkspace(org.id))}
              className="flex items-center justify-between px-3 py-2 text-xs text-[#F5F5F5] hover:bg-[#1F1F23]/60 rounded cursor-pointer font-medium"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="flex size-4 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-300">
                  {org.name.substring(0, 1).toUpperCase()}
                </div>
                <span className="truncate">{org.name}</span>
              </div>
              {isSelected && <Check className="size-3.5 text-[#7C6EF2]" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}