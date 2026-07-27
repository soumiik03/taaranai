'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'


const createOrgSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
})

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createOrganization(formData: FormData) {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  const parsed = createOrgSchema.safeParse({
    name: formData.get('name'),
  })
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Slugs must be unique — "Acme" and a second "Acme" from another user
  // both need distinct URLs, so we append a numeric suffix on collision.
  const baseSlug = slugify(parsed.data.name)
  let slug = baseSlug
  let suffix = 1
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`
  }

  const org = await prisma.organization.create({
    data: {
      name: parsed.data.name,
      slug,
      members: {
        create: {
          userId: session.user.id,
          role: 'OWNER',
        },
      },
    },
  })

  const cookieStore = await cookies()
  cookieStore.set('active_org_id', org.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  redirect('/dashboard')
}

// add to features/workspace/actions.ts

export async function switchWorkspace(organizationId: string) {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  // Never trust the incoming ID blindly — confirm this user is actually
  // a member of the org they're trying to switch into.
  const membership = await prisma.member.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  })

  if (!membership) {
    throw new Error('You are not a member of this organization')
  }

  const cookieStore = await cookies()
  cookieStore.set('active_org_id', organizationId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  redirect('/dashboard')
}