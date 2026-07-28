'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession, getActiveOrganization } from '@/lib/session'
import { inngest } from '@/lib/inngest/client'
import { featureRequestSchema } from './schema'
import { executeClarificationForRequest } from '@/lib/inngest/functions/clarify-request'
import { executePrdGeneration } from '@/lib/inngest/functions/generate-prd'



// Small helper repeated across every feature-scoped action from here on:
// resolve who's asking AND which org they're acting within, in one place,
// so every action below has a guaranteed non-null session + org or throws.
async function requireOrgContext() {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  const org = await getActiveOrganization()
  if (!org) redirect('/create-workspace')

  return { session, org }
}

export async function createFeatureRequest(formData: FormData) {
  const { org } = await requireOrgContext()

  const parsed = featureRequestSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    sourceType: formData.get('sourceType'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // For V1, one default project per org keeps this simple — you already
  // built multi-project support in Chapter 4's schema, so this is easy to
  // extend into a project picker later without touching this action's shape.
  let project = await prisma.project.findFirst({
    where: { organizationId: org.id },
  })
  if (!project) {
    project = await prisma.project.create({
      data: {
        name: 'Default Project',
        organizationId: org.id,
      },
    })
  }

  const featureRequest = await prisma.featureRequest.create({
    data: {
      ...parsed.data,
      organizationId: org.id,
      projectId: project.id,
    },
  })

  await inngest.send({
    name: 'feature-request/created',
    data: { featureRequestId: featureRequest.id },
  })

  // Let Inngest handle the AI clarification and PRD generation in the background.
  // We'll redirect to the AI Processing view, which polls for status updates.
  redirect(`/dashboard/clarifications?id=${featureRequest.id}&flow=new`)
}


export async function updateFeatureRequest(id: string, formData: FormData) {
  const { org } = await requireOrgContext()

  const parsed = featureRequestSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    sourceType: formData.get('sourceType'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // updateMany + organizationId in the WHERE clause, not update() by id
  // alone, is the whole tenant-isolation trick: if this request belongs to
  // a different org, the WHERE clause matches zero rows instead of leaking
  // a cross-tenant write. update() by id alone would happily edit it.
  const result = await prisma.featureRequest.updateMany({
    where: { id, organizationId: org.id },
    data: parsed.data,
  })

  if (result.count === 0) {
    return { error: { _form: ['Feature request not found'] } }
  }

  revalidatePath('/dashboard/feature-requests')
  revalidatePath(`/dashboard/feature-requests/${id}`)
  return { success: true }
}

export async function deleteFeatureRequest(id: string) {
  const { org } = await requireOrgContext()

  await prisma.featureRequest.deleteMany({
    where: { id, organizationId: org.id },
  })

  revalidatePath('/dashboard/feature-requests')
  revalidatePath('/dashboard/clarifications')
  revalidatePath('/dashboard/prd')
  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard')
  redirect('/dashboard/feature-requests')
}

export async function deleteFeatureRequestInline(id: string) {
  const { org } = await requireOrgContext()

  await prisma.featureRequest.deleteMany({
    where: { id, organizationId: org.id },
  })

  revalidatePath('/dashboard/feature-requests')
  revalidatePath('/dashboard/clarifications')
  revalidatePath('/dashboard/prd')
  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard')
  return { success: true }
}


export async function getFeatureRequests() {
  const { org } = await requireOrgContext()

  return prisma.featureRequest.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getFeatureRequest(id: string) {
  const { org } = await requireOrgContext()

  return prisma.featureRequest.findFirst({
    where: { id, organizationId: org.id },
    include: { prd: true },
  })
}


export async function getClarificationQuestions(featureRequestId: string) {
  const { org } = await requireOrgContext()

  return prisma.clarificationQuestion.findMany({
    where: { featureRequestId, organizationId: org.id },
    orderBy: { createdAt: 'asc' },
  })
}

export async function answerClarificationQuestion(
  questionId: string,
  answer: string
) {
  const { org } = await requireOrgContext()

  const question = await prisma.clarificationQuestion.findFirst({
    where: { id: questionId, organizationId: org.id },
  })
  if (!question) throw new Error('Question not found')

  await prisma.clarificationQuestion.update({
    where: { id: questionId },
    data: { answer, status: 'ANSWERED' },
  })

  const remainingPending = await prisma.clarificationQuestion.count({
    where: { featureRequestId: question.featureRequestId, status: 'PENDING' },
  })

  // Last question just answered — hand back to the AI to decide if this
  // is enough context now, or if it needs to ask follow-ups.
  if (remainingPending === 0) {
    await inngest.send({
      name: 'feature-request/clarification-answered',
      data: { featureRequestId: question.featureRequestId },
    })

    const prd = await executePrdGeneration(question.featureRequestId)

    revalidatePath('/dashboard/clarifications')
    revalidatePath('/dashboard/prd')
    revalidatePath(`/dashboard/feature-requests/${question.featureRequestId}`)

    if (prd) {
      return { success: true, status: 'READY', prdId: prd.id }
    }
  }

  revalidatePath(`/dashboard/feature-requests/${question.featureRequestId}`)
  revalidatePath('/dashboard/clarifications')
  return { success: true, status: 'CLARIFYING' }
}