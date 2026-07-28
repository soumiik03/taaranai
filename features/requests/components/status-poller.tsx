'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface StatusPollerProps {
  status: string
  hasPendingQuestions: boolean
  prdId?: string | null
  intervalMs?: number
}

export function StatusPoller({
  status,
  hasPendingQuestions,
  prdId,
  intervalMs = 2500,
}: StatusPollerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    // If status is READY and PRD has been generated, auto-redirect immediately
    if (status === 'READY' && prdId) {
      window.location.href = `/dashboard/prd/${prdId}`
      return
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
  }, [status, hasPendingQuestions, prdId, intervalMs, router])

  return null
}
