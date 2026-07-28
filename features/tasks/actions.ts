'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getActiveOrganization } from '@/lib/session'
import { inngest } from '@/lib/inngest/client'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export async function getPrdWithTasks(prdId: string) {
  const org = await getActiveOrganization()
  if (!org) return null

  const prd = await prisma.pRD.findFirst({
    where: { id: prdId, organizationId: org.id },
    include: {
      featureRequest: {
        select: { title: true, description: true },
      },
      tasks: {
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      },
    },
  })

  return prd
}

export async function getTasksByPrd(prdId: string) {
  const org = await getActiveOrganization()
  if (!org) return []

  const prd = await prisma.pRD.findFirst({
    where: { id: prdId, organizationId: org.id },
  })
  if (!prd) return []

  return prisma.task.findMany({
    where: { prdId },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const org = await getActiveOrganization()
  if (!org) throw new Error('Not authenticated')

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { prd: true },
  })

  if (!task || task.prd.organizationId !== org.id) {
    throw new Error('Task not found')
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status },
  })

  revalidatePath(`/dashboard/tasks/${task.prdId}`)
  return updated
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string
    description?: string
    priority?: TaskPriority
    status?: TaskStatus
    order?: number
  }
) {
  const org = await getActiveOrganization()
  if (!org) throw new Error('Not authenticated')

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { prd: true },
  })

  if (!task || task.prd.organizationId !== org.id) {
    throw new Error('Task not found')
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.order !== undefined && { order: data.order }),
    },
  })

  revalidatePath(`/dashboard/tasks/${task.prdId}`)
  return updated
}

export async function deleteTask(taskId: string) {
  const org = await getActiveOrganization()
  if (!org) throw new Error('Not authenticated')

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { prd: true },
  })

  if (!task || task.prd.organizationId !== org.id) {
    throw new Error('Task not found')
  }

  await prisma.task.delete({
    where: { id: taskId },
  })

  revalidatePath(`/dashboard/tasks/${task.prdId}`)
}

export async function createTask(
  prdId: string,
  data: {
    title: string
    description: string
    priority: TaskPriority
    status?: TaskStatus
  }
) {
  const org = await getActiveOrganization()
  if (!org) throw new Error('Not authenticated')

  const prd = await prisma.pRD.findFirst({
    where: { id: prdId, organizationId: org.id },
  })
  if (!prd) throw new Error('PRD not found')

  const lastTask = await prisma.task.findFirst({
    where: { prdId },
    orderBy: { order: 'desc' },
  })
  const nextOrder = (lastTask?.order ?? -1) + 1

  const newTask = await prisma.task.create({
    data: {
      prdId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status || 'todo',
      order: nextOrder,
    },
  })

  revalidatePath(`/dashboard/tasks/${prdId}`)
  return newTask
}

export async function approvePlan(prdId: string) {
  const org = await getActiveOrganization()
  if (!org) throw new Error('Not authenticated')

  const prd = await prisma.pRD.findFirst({
    where: { id: prdId, organizationId: org.id },
  })
  if (!prd) throw new Error('PRD not found')

  const updatedPrd = await prisma.pRD.update({
    where: { id: prdId },
    data: { planApproved: true },
  })

  revalidatePath(`/dashboard/tasks/${prdId}`)
  revalidatePath(`/dashboard/prd/${prdId}`)
  return updatedPrd
}

export async function triggerTaskGeneration(prdId: string) {
  const org = await getActiveOrganization()
  if (!org) throw new Error('Not authenticated')

  const prd = await prisma.pRD.findFirst({
    where: { id: prdId, organizationId: org.id },
  })
  if (!prd) throw new Error('PRD not found')

  await inngest.send({
    name: 'tasks/generate',
    data: { prdId },
  })

  revalidatePath(`/dashboard/tasks/${prdId}`)
}

export async function getAllPrdsWithTasks() {
  const org = await getActiveOrganization()
  if (!org) return []

  return prisma.pRD.findMany({
    where: { organizationId: org.id },
    include: {
      featureRequest: {
        select: { title: true, description: true },
      },
      tasks: {
        select: { id: true, status: true, priority: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}
