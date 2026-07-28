'use client'

import React, { useState } from 'react'
import { DashboardSidebar } from './dashboard-sidebar'
import { WorkspaceSwitcher } from '@/features/workspace/components/workspace-switcher'
import { UserMenu } from '@/components/user/user-menu'
import { Menu, X, Search, Plus, HelpCircle } from 'lucide-react'

interface DashboardShellProps {
  children: React.ReactNode
  organizations: { id: string; name: string }[]
  activeOrgId: string
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  isAiWorking?: boolean
}

export function DashboardShell({
  children,
  organizations,
  activeOrgId,
  user,
  isAiWorking,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0A0A0A] text-[#FAFAFA] font-sans antialiased">
      {/* Desktop Sidebar (Fixed 260px) */}
      <div className="hidden lg:flex h-full shrink-0">
        <DashboardSidebar isAiWorking={isAiWorking} />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform bg-[#0A0A0A] transition-transform duration-200 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar isAiWorking={isAiWorking} onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Right Body */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#262626] bg-[#0A0A0A] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex size-8 items-center justify-center rounded-none border border-[#262626] bg-[#0D0D0F] text-[#8B8B92] hover:text-[#FAFAFA] lg:hidden"
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>

            {/* Top Workspace Switcher Dropdown */}
            <WorkspaceSwitcher
              organizations={organizations}
              activeOrgId={activeOrgId}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input Box */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-none border border-[#262626] bg-[#0D0D0F] text-xs text-[#8B8B92] w-48 lg:w-56 cursor-pointer hover:border-[#404040] transition-colors">
              <Search className="size-3.5 text-[#8B8B92]" />
              <span className="flex-1 text-[#8B8B92]">Search...</span>
              <kbd className="font-mono text-[10px] bg-[#1F1F23] px-1.5 py-0.2 rounded-none text-[#8B8B92]">
                ⌘K
              </kbd>
            </div>

            {/* Outlined Action Button (+ New) */}
            <button
              type="button"
              className="px-2.5 py-1 rounded-none border border-[#262626] bg-[#0D0D0F] text-xs font-medium text-[#FAFAFA] hover:bg-[#1F1F23] transition-colors flex items-center gap-1"
            >
              <Plus className="size-3.5 text-[#FAFAFA]" />
              <span>New</span>
            </button>

            {/* Outlined Upgrade Button */}
            <button
              type="button"
              className="hidden md:flex px-2.5 py-1 rounded-none border border-[#262626] bg-[#0D0D0F] text-xs font-medium text-[#FAFAFA] hover:bg-[#1F1F23] transition-colors"
            >
              Upgrade
            </button>

            {/* Help / Docs */}
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-none border border-[#262626] bg-[#0D0D0F] text-[#8B8B92] hover:text-[#FAFAFA] transition-colors"
              title="Documentation & Help"
            >
              <HelpCircle className="size-3.5" />
            </button>

            {/* User Profile Menu */}
            <UserMenu user={user} />
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
