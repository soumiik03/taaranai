'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface StatusPollerProps {
  status: string
  hasPendingQuestions: boolean
  prdId?: string | null
  intervalMs?: number
  autoRedirectOnReady?: boolean
  autoRedirectPath?: string
}

export function StatusPoller({
  status,
  hasPendingQuestions,
  prdId,
  intervalMs = 2500,
  autoRedirectOnReady = false,
  autoRedirectPath,
}: StatusPollerProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  useEffect(() => {
    // Only auto-redirect if explicitly requested (e.g. fresh submission creation flow)
    if (autoRedirectOnReady) {
      if (status === 'READY' && prdId) {
        router.replace(autoRedirectPath ?? `/dashboard/prd/${prdId}`)
        return
      }
    }


    // Determine whether polling is needed
    const shouldPoll =
      status === 'PENDING' ||
      (status === 'CLARIFYING' && !hasPendingQuestions) ||
      (status === 'READY' && !prdId)

    if (!shouldPoll) return

    let timeoutId: NodeJS.Timeout

    const poll = () => {
      startTransition(() => {
        router.refresh()
      })
      timeoutId = setTimeout(poll, intervalMs)
    }

    timeoutId = setTimeout(poll, intervalMs)

    return () => clearTimeout(timeoutId)
  }, [status, hasPendingQuestions, prdId, intervalMs, autoRedirectOnReady, autoRedirectPath, router])

  return null
}

