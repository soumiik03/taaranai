// app/(protected)/layout.tsx
import { redirect } from 'next/navigation'
import { getSession, getActiveOrganization } from '@/lib/session'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  const org = await getActiveOrganization()
  if (!org) redirect('/create-workspace')

  return <>{children}</>
}