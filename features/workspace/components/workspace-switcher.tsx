'use client'

import { useState, useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { switchWorkspace, createOrganization } from '../actions'
import { ChevronDown, Check, Plus, Building2, X } from 'lucide-react'

type Org = { id: string; name: string }

export function WorkspaceSwitcher({
  organizations,
  activeOrgId,
}: {
  organizations: Org[]
  activeOrgId: string
}) {
  const [isPending, startTransition] = useTransition()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  const active = organizations.find((o) => o.id === activeOrgId)
  const displayName = active?.name ?? 'My Workspace'
  const activeInitial = displayName.substring(0, 1).toUpperCase()

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrgName.trim()) return

    const formData = new FormData()
    formData.append('name', newOrgName.trim())

    startTransition(async () => {
      const res = await createOrganization(formData)
      if (res?.error?.name) {
        setCreateError(res.error.name[0])
      } else {
        setShowCreateModal(false)
        setNewOrgName('')
      }
    })
  }

  return (
    <>
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
        <DropdownMenuContent align="start" className="w-56 border-[#262626] bg-[#0D0D0F] p-1 shadow-none rounded-none">
          <div className="px-2 py-1 text-[10px] font-mono text-[#8B8B92] uppercase">
            Switch Company / Project
          </div>
          {organizations.map((org) => {
            const isSelected = org.id === activeOrgId
            return (
              <DropdownMenuItem
                key={org.id}
                disabled={isSelected || isPending}
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

          <DropdownMenuSeparator className="my-1 bg-[#262626]" />

          <DropdownMenuItem
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#FAFAFA] hover:bg-[#1F1F23] rounded-none cursor-pointer font-medium"
          >
            <Plus className="size-3.5 text-[#8B8B92]" />
            <span>Create New Project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* CREATE NEW PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D0D0F] border border-[#262626] p-6 space-y-4 shadow-2xl relative font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#FAFAFA] font-bold text-sm">
                <Building2 className="size-4 text-[#8B8B92]" />
                <span>Create New Company Project</span>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateError(null)
                }}
                className="text-[#8B8B92] hover:text-[#FAFAFA]"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-[#8B8B92] leading-relaxed">
              Create an isolated project workspace for a new company or team. Data and PR reviews will be kept 100% separate from Google.
            </p>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#FAFAFA] block">
                  Project / Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta, Stripe, OpenAI"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full bg-[#050505] border border-[#262626] px-3 py-2 text-xs text-[#FAFAFA] focus:outline-none focus:border-[#404040]"
                />
                {createError && (
                  <p className="text-[11px] text-red-400 mt-1">{createError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 border border-[#262626] text-xs font-medium text-[#8B8B92] hover:text-[#FAFAFA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !newOrgName.trim()}
                  className="px-4 py-1.5 bg-[#FAFAFA] text-[#0A0A0A] text-xs font-bold hover:bg-[#E5E5E5] disabled:opacity-50"
                >
                  {isPending ? 'Creating...' : 'Create & Switch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}