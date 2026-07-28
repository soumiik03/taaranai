// lib/inngest/functions/generate-prd.ts
import { generateObject } from 'ai'
import { z } from 'zod'
import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/db'
import { clarificationModel } from '@/lib/ai/openrouter'
import { buildPrdPrompt } from '@/lib/prompts/prd-prompt'

const prdSchema = z.object({
  problemStatement: z.string(),
  goals: z.array(z.string()),
  nonGoals: z.array(z.string()),
  userStories: z.array(
    z.object({ role: z.string(), story: z.string() })
  ),
  acceptanceCriteria: z.array(z.string()),
  edgeCases: z.array(z.string()),
  successMetrics: z.array(z.string()),
})

export const generatePrd = inngest.createFunction(
  {
    id: 'generate-prd',
    triggers: [{ event: 'prd/generate' }],
  },
  async ({ event, step }) => {
    const { featureRequestId } = event.data

    const context = await step.run('fetch-context', async () => {
      const featureRequest = await prisma.featureRequest.findUniqueOrThrow({
        where: { id: featureRequestId },
      })
      const clarifications = await prisma.clarificationQuestion.findMany({
        where: { featureRequestId },
        orderBy: { createdAt: 'asc' },
      })
      return { featureRequest, clarifications }
    })

    const prdData = await step.run('generate-prd-content', async () => {
      const { object } = await generateObject({
        model: clarificationModel,
        schema: prdSchema,
        prompt: buildPrdPrompt(
          context.featureRequest.title,
          context.featureRequest.description,
          context.clarifications.map((c) => ({
            question: c.question,
            answer: c.answer,
          }))
        ),
      })
      return object
    })

    const prd = await step.run('save-prd', async () => {
      return prisma.pRD.create({
        data: {
          featureRequestId,
          organizationId: context.featureRequest.organizationId,
          problemStatement: prdData.problemStatement,
          goals: prdData.goals,
          nonGoals: prdData.nonGoals,
          userStories: prdData.userStories,
          acceptanceCriteria: prdData.acceptanceCriteria,
          edgeCases: prdData.edgeCases,
          successMetrics: prdData.successMetrics,
        },
      })
    })

    return { prdId: prd.id }
  }
)
