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
          className="group flex items-center gap-2.5 rounded-none border border-[#262626] bg-[#0D0D0F] px-2.5 py-1 text-xs font-medium text-[#FAFAFA] hover:bg-[#1F1F23] transition-colors outline-none cursor-pointer"
        >
          <div className="flex size-4 items-center justify-center rounded-full border border-[#262626] bg-[#0D0D0F] text-[10px] font-bold text-[#FAFAFA]">
            {activeInitial}
          </div>
          <span className="truncate max-w-[140px] font-medium">{displayName}</span>
          <ChevronDown className="size-3 text-[#8B8B92] group-hover:text-[#FAFAFA] transition-colors ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52 border-[#262626] bg-[#0D0D0F] p-1 shadow-none rounded-none">
        {organizations.map((org) => {
          const isSelected = org.id === activeOrgId
          return (
            <DropdownMenuItem
              key={org.id}
              disabled={isSelected}
              onClick={() => startTransition(() => switchWorkspace(org.id))}
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-[#FAFAFA] hover:bg-[#1F1F23] rounded-none cursor-pointer font-medium"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="flex size-4 items-center justify-center rounded-full border border-[#262626] bg-[#0D0D0F] text-[10px] font-bold text-[#FAFAFA]">
                  {org.name.substring(0, 1).toUpperCase()}
                </div>
                <span className="truncate">{org.name}</span>
              </div>
              {isSelected && <Check className="size-3.5 text-[#FAFAFA]" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}