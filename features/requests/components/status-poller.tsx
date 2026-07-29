'use client'

import { useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface StatusPollerProps {
  requestId: string
  status: string
  hasPendingQuestions: boolean
  prdId?: string | null
  intervalMs?: number
  autoRedirectOnReady?: boolean
  autoRedirectPath?: string
}

type RequestStatus = {
  status: string
  hasPendingQuestions: boolean
  prdId: string | null
}

export function StatusPoller({
  requestId,
  status,
  hasPendingQuestions,
  prdId,
  intervalMs = 1500,
  autoRedirectOnReady = false,
  autoRedirectPath,
}: StatusPollerProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const lastState = useRef<RequestStatus>({ status, hasPendingQuestions, prdId: prdId ?? null })

  useEffect(() => {
    let disposed = false

    async function checkStatus() {
      try {
        const response = await fetch('/api/feature-requests/' + requestId + '/status', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        })
        if (!response.ok || disposed) return

        const next = (await response.json()) as RequestStatus
        const previous = lastState.current
        const changed =
          next.status !== previous.status ||
          next.hasPendingQuestions !== previous.hasPendingQuestions ||
          next.prdId !== previous.prdId

        lastState.current = next

        if (changed) {
          startTransition(() => router.refresh())
        }
      } catch {
        // A transient polling failure should not interrupt the workflow.
      }
    }

    const intervalId = window.setInterval(checkStatus, intervalMs)
    void checkStatus()

    return () => {
      disposed = true
      window.clearInterval(intervalId)
    }
  }, [intervalMs, requestId, router])

  useEffect(() => {
    if (autoRedirectOnReady && status === 'READY' && prdId) {
      router.replace(autoRedirectPath ?? '/dashboard/prd/' + prdId)
    }
  }, [autoRedirectOnReady, autoRedirectPath, prdId, router, status])

  return null
}