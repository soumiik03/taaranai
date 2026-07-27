'use client'

import { useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { switchWorkspace } from '../actions'

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between" disabled={isPending}>
          {active?.name ?? 'Select workspace'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            disabled={org.id === activeOrgId}
            onClick={() => startTransition(() => switchWorkspace(org.id))}
          >
            {org.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}