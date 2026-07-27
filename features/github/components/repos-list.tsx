'use client'

import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { getConnectedRepos, type ConnectedRepo } from '../actions'

export function ReposList() {
  const [repos, setRepos] = useState<ConnectedRepo[] | null>(null)
  const [isPending, startTransition] = useTransition()

  function load() {
    startTransition(async () => {
      const result = await getConnectedRepos()
      setRepos(result.repos)
    })
  }

  useEffect(() => {
    load()
  }, [])

  if (repos === null || isPending) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-medium text-[#FAFAFA]">Connected Repositories</p>
          <Button variant="outline" size="sm" disabled>
            Loading...
          </Button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 rounded-md border border-[#262626] bg-[#0D0D0F] animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-medium text-[#FAFAFA]">Connected Repositories</p>
        <Button variant="outline" size="sm" onClick={load} disabled={isPending}>
          Refresh
        </Button>
      </div>
      {repos.length === 0 ? (
        <div className="rounded-md border border-dashed border-[#262626] p-6 text-center text-sm text-[#8B8B92]">
          No repos connected yet. Grant access in your GitHub App installation.
        </div>
      ) : (
        <div className="space-y-2">
          {repos.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-md border border-[#262626] bg-[#0D0D0F] p-3 text-sm text-[#FAFAFA]"
            >
              <span className="font-mono">{r.fullName}</span>
              <span className="text-xs text-[#8B8B92] bg-[#1F1F23] px-2 py-0.5 rounded border border-[#262626]">
                {r.private ? 'Private' : 'Public'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}