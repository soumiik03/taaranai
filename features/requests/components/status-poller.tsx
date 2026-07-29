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
  intervalMs = 2000,
  autoRedirectOnReady = false,
  autoRedirectPath,
}: StatusPollerProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  useEffect(() => {
    // 1. Auto-redirect to PRD editor when PRD is ready
    if (autoRedirectOnReady && status === 'READY' && prdId) {
      router.replace(autoRedirectPath ?? `/dashboard/prd/${prdId}`)
      return
    }

    // 2. Determine whether polling should be active:
    // Poll while status is PENDING, or CLARIFYING with 0 pending questions, or READY waiting for PRD id
    const shouldPoll =
      status === 'PENDING' ||
      (status === 'CLARIFYING' && !hasPendingQuestions) ||
      (status === 'READY' && !prdId)

    if (!shouldPoll) return

    // 3. setInterval every intervalMs (2 seconds)
    const intervalId = setInterval(() => {
      startTransition(() => {
        router.refresh()
      })
    }, intervalMs)

    return () => clearInterval(intervalId)
  }, [status, hasPendingQuestions, prdId, intervalMs, autoRedirectOnReady, autoRedirectPath, router])

  return null
}

