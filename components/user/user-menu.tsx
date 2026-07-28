'use client'

import Image from 'next/image'
import React, { useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOutUser } from '@/features/auth/actions'
import { Settings, LogOut } from 'lucide-react'

interface UserMenuProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function UserMenu({ user }: UserMenuProps) {
  const [isPending, startTransition] = useTransition()

  const displayName = user?.name || 'User'
  const displayEmail = user?.email || 'user@taaran.ai'
  const initial = displayName.substring(0, 1).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-full bg-[#22C55E] text-xs font-bold text-white transition-opacity hover:opacity-90 outline-none cursor-pointer"
        >
          {user?.image ? (
            <Image
              src={user.image}
              alt={displayName}
              width={28}
              height={28}
              className="size-7 rounded-full object-cover"
            />
          ) : (
            <span>{initial}</span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 border-[#262626] bg-[#0D0D0F] p-1 shadow-none rounded-md">
        <div className="flex flex-col px-3 py-2 border-b border-[#262626] mb-1">
          <span className="text-xs font-semibold text-[#FAFAFA] truncate">
            {displayName}
          </span>
          <span className="text-[11px] text-[#8B8B92] font-mono truncate mt-0.5">
            {displayEmail}
          </span>
        </div>

        <DropdownMenuItem
          onClick={() => (window.location.href = '/dashboard/settings')}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#8B8B92] hover:text-[#FAFAFA] hover:bg-[#1F1F23] rounded-md cursor-pointer font-medium"
        >
          <Settings className="size-3.5 text-[#8B8B92]" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <div className="border-t border-[#262626] my-1 pt-1">
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => {
              startTransition(() => {
                signOutUser()
              })
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 rounded-md cursor-pointer font-medium"
          >
            <LogOut className="size-3.5 text-[#EF4444]" />
            <span>{isPending ? 'Signing out...' : 'Sign out'}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
