'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navSections } from '../lib/routes'
import { cn } from '@/lib/utils'
import { Command, ChevronUp } from 'lucide-react'

interface DashboardSidebarProps {
  onCloseMobile?: () => void
  isAiWorking?: boolean
}

export function DashboardSidebar({ onCloseMobile, isAiWorking }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[260px] flex-col bg-[#0A0A0A] border-r border-[#262626] text-[#FAFAFA] select-none shrink-0 font-sans">
      {/* Top Header Logo */}
      <div className="flex h-14 items-center px-5 border-b border-[#262626]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Command className="size-4 text-[#FAFAFA]" />
          <span className="text-sm font-semibold tracking-tight text-[#FAFAFA]">
            Taaran AI
          </span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <div className="px-5 pb-1.5 pt-1">
                <span className="text-[11px] font-medium tracking-wider text-[#8B8B92] uppercase">
                  {section.title}
                </span>
              </div>
            )}

            <nav className="space-y-0.5">
              {section.routes.map((route) => {
                const Icon = route.icon
                const isActive =
                  route.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(route.href)

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={onCloseMobile}
                    className={cn(
                      'group flex items-center gap-2.5 px-5 py-2 text-xs font-medium transition-colors rounded-none',
                      isActive
                        ? 'bg-[#6C5DD3]/25 text-[#FAFAFA]'
                        : 'text-[#8B8B92] hover:bg-[#0D0D0F] hover:text-[#FAFAFA]'
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        isActive ? 'text-[#6C5DD3]' : 'text-[#8B8B92] group-hover:text-[#FAFAFA]'
                      )}
                    />
                    <span className="truncate">{route.label}</span>
                    {(route.href === '/dashboard/feature-requests' || route.href === '/dashboard/clarifications') && isAiWorking && (
                      <span className="relative flex size-2 ml-auto shrink-0" title="AI is processing requests...">
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full size-2 bg-indigo-500" />
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}
