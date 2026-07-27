// app/(onboarding)/create-workspace/page.tsx
import { WorkspaceForm } from '@/features/workspace/components/workspace-form'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { SIGN_IN_PATH } from '@/features/auth/utils'

export const dynamic = 'force-dynamic'

export default async function CreateWorkspacePage() {
  const session = await getSession()
  if (!session) {
    redirect(SIGN_IN_PATH)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#0b0b0d] text-zinc-100">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Create your workspace</h1>
          <p className="text-sm text-zinc-400">
            This is where your team's feature requests, PRDs, and repos will live.
          </p>
        </div>
        <WorkspaceForm />
      </div>
    </div>
  )
}