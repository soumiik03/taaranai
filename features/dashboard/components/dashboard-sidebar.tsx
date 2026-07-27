'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navSections } from '../lib/routes'
import { cn } from '@/lib/utils'
import { ChevronUp } from 'lucide-react'

interface DashboardSidebarProps {
  onCloseMobile?: () => void
}

export function DashboardSidebar({ onCloseMobile }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[260px] flex-col bg-[#0A0A0B] border-r border-[#1F1F23] text-[#F5F5F5] select-none shrink-0 font-sans">
      {/* Top Header Logo Icon (Render style: simple icon/logo top-left) */}
      <div className="flex h-14 items-center px-5 border-b border-[#1F1F23]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded bg-[#7C6EF2] text-white font-bold text-xs tracking-tighter">
            T
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#F5F5F5]">
            Taaran AI
          </span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="px-3 space-y-1">
            {section.title && (
              <div className="px-3 pb-1.5 pt-1">
                <span className="text-[11px] font-medium tracking-wider text-[#8A8A93] uppercase">
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
                      'group flex items-center gap-3 px-3 py-2 text-xs font-medium transition-colors rounded-r-md',
                      isActive
                        ? 'bg-[#7C6EF2]/12 text-[#F5F5F5] border-l-2 border-[#7C6EF2]'
                        : 'text-[#8A8A93] hover:bg-[#111113] hover:text-[#F5F5F5] border-l-2 border-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        isActive ? 'text-[#7C6EF2]' : 'text-[#8A8A93] group-hover:text-[#F5F5F5]'
                      )}
                    />
                    <span className="truncate">{route.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer System Status Banner (Render status style) */}
      <div className="p-3 border-t border-[#1F1F23]">
        <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#111113] transition-colors cursor-pointer text-xs text-[#8A8A93]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#22C55E] inline-block" />
            <span className="text-xs font-medium text-[#F5F5F5]">Taaran Status</span>
          </div>
          <ChevronUp className="size-3.5 text-[#8A8A93]" />
        </div>
      </div>
    </aside>
  )
}
