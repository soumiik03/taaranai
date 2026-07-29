// lib/inngest/functions/generate-tasks.ts
import { generateObject } from 'ai'
import { z } from 'zod'
import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/db'
import { clarificationModel } from '@/lib/ai/openrouter'
import { buildTaskPrompt } from '@/lib/prompts/task-prompt'

const tasksResponseSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        priority: z.enum(['low', 'medium', 'high']),
      })
    )
    .min(1)
    .max(3),
})

export const generateTasks = inngest.createFunction(
  {
    id: 'generate-tasks',
    triggers: [{ event: 'tasks/generate' }],
  },
  async ({ event, step }) => {
    const { prdId } = event.data

    const prd = await step.run('fetch-prd', async () => {
      return prisma.pRD.findUniqueOrThrow({
        where: { id: prdId },
        include: {
          featureRequest: {
            select: { title: true, description: true },
          },
        },
      })
    })

    const generated = await step.run('generate-tasks-content', async () => {
      const { object } = await generateObject({
        model: clarificationModel,
        schema: tasksResponseSchema,
        prompt: buildTaskPrompt(prd),
      })
      return object
    })

    const result = await step.run('save-tasks', async () => {
      // Clear previous tasks if any exist to allow clean regeneration
      await prisma.task.deleteMany({
        where: { prdId },
      })

      const taskData = generated.tasks.slice(0, 3).map((t, index) => ({
        prdId,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: 'todo' as const,
        order: index,
      }))

      await prisma.task.createMany({
        data: taskData,
      })

      return { count: taskData.length }
    })

    return { prdId, count: result.count }
  }
)
