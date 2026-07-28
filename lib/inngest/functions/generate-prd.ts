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

export async function executePrdGeneration(featureRequestId: string) {
  const featureRequest = await prisma.featureRequest.findUnique({
    where: { id: featureRequestId },
  })
  if (!featureRequest) return null

  const clarifications = await prisma.clarificationQuestion.findMany({
    where: { featureRequestId },
    orderBy: { createdAt: 'asc' },
  })


    const { object: prdData } = await generateObject({
      model: clarificationModel,
      schema: prdSchema,
      prompt: buildPrdPrompt(
        featureRequest.title,
        featureRequest.description,
        clarifications.map((c) => ({
          question: c.question,
          answer: c.answer,
        }))
      ),
    })

    const prd = await prisma.pRD.upsert({
      where: { featureRequestId },
      create: {
        featureRequestId,
        organizationId: featureRequest.organizationId,
        problemStatement: prdData.problemStatement,
        goals: prdData.goals,
        nonGoals: prdData.nonGoals,
        userStories: prdData.userStories,
        acceptanceCriteria: prdData.acceptanceCriteria,
        edgeCases: prdData.edgeCases,
        successMetrics: prdData.successMetrics,
        status: 'DRAFT',
      },
      update: {
        problemStatement: prdData.problemStatement,
        goals: prdData.goals,
        nonGoals: prdData.nonGoals,
        userStories: prdData.userStories,
        acceptanceCriteria: prdData.acceptanceCriteria,
        edgeCases: prdData.edgeCases,
        successMetrics: prdData.successMetrics,
      },
    })

    await prisma.featureRequest.update({
      where: { id: featureRequestId },
      data: { status: 'READY' },
    })

    return prd
}

export const generatePrd = inngest.createFunction(
  {
    id: 'generate-prd',
    triggers: [{ event: 'prd/generate' }],
  },
  async ({ event, step }) => {
    const { featureRequestId } = event.data
    const prd = await step.run('execute-prd-gen', () => executePrdGeneration(featureRequestId))
    return { prdId: prd?.id }
  }
)

