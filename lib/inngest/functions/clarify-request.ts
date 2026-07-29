// lib/inngest/functions/clarify-request.ts
import { generateObject } from 'ai'
import { z } from 'zod'
import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/db'
import { clarificationModel } from '@/lib/ai/openrouter'
import { buildClarifyPrompt } from '@/lib/prompts/clarify-prompt'

const clarifyResultSchema = z.object({
  needsClarification: z.boolean(),
  questions: z.array(z.string()),
})

export async function executeClarificationForRequest(featureRequestId: string) {
  const featureRequest = await prisma.featureRequest.findUnique({
    where: { id: featureRequestId },
  })
  if (!featureRequest) return { status: 'error' }

  const existingCount = await prisma.clarificationQuestion.count({
    where: { featureRequestId },
  })

  if (existingCount >= 5) {
    await prisma.featureRequest.update({
      where: { id: featureRequestId },
      data: { status: 'READY' },
    })
    return { status: 'ready' }
  }

  const maxAllowed = Math.min(5, 5 - existingCount)


    const { object: aiResult } = await generateObject({
      model: clarificationModel,
      schema: clarifyResultSchema,
      prompt: buildClarifyPrompt(
        featureRequest.title,
        featureRequest.description,
        maxAllowed
      ),
    })

    const newQuestions = aiResult.questions.slice(0, maxAllowed)

    if (!aiResult.needsClarification || newQuestions.length === 0) {
      await prisma.featureRequest.update({
        where: { id: featureRequestId },
        data: { status: 'READY' },
      })
      return { status: 'ready' }
    }

    await prisma.$transaction([
      prisma.clarificationQuestion.createMany({
        data: newQuestions.map((q: string) => ({
          question: q,
          featureRequestId,
          organizationId: featureRequest.organizationId,
        })),
      }),
      prisma.featureRequest.update({
        where: { id: featureRequestId },
        data: { status: 'CLARIFYING' },
      }),
    ])

    return { status: 'clarifying', questionsAsked: newQuestions.length }
}

export const clarifyFeatureRequest = inngest.createFunction(
  {
    id: 'clarify-feature-request',
    triggers: [{ event: 'feature-request/created' }],
  },
  async ({ event, step }) => {
    const { featureRequestId } = event.data
    const res = await step.run('execute-clarification', () => executeClarificationForRequest(featureRequestId))
    
    if (res.status === 'ready') {
      await step.sendEvent('trigger-prd-generation', {
        name: 'prd/generate',
        data: { featureRequestId },
      })
    }
    
    return res
  }
)


export const recheckClarification = inngest.createFunction(
  {
    id: 'recheck-clarification',
    triggers: [{ event: 'feature-request/clarification-answered' }],
  },
  async ({ event, step }) => {
    const { featureRequestId } = event.data

    const context = await step.run('gather-context', async () => {
      const featureRequest = await prisma.featureRequest.findUniqueOrThrow({
        where: { id: featureRequestId },
      })
      const questions = await prisma.clarificationQuestion.findMany({
        where: { featureRequestId },
      })
      return { featureRequest, questions, count: questions.length }
    })

    if (context.count >= 5) {
      await step.run('mark-ready', async () => {
        await prisma.featureRequest.update({
          where: { id: featureRequestId },
          data: { status: 'READY' },
        })
      })

      await step.sendEvent('trigger-prd-generation', {
        name: 'prd/generate',
        data: { featureRequestId },
      })

      return { status: 'ready', followUpsAsked: 0 }
    }

    const maxAllowed = Math.min(5, 5 - context.count)

    const aiResult = await step.run('recheck-with-ai', async () => {
      const qaText = context.questions
        .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
        .join('\n\n')

      const { object } = await generateObject({
        model: clarificationModel,
        schema: clarifyResultSchema,
        prompt: `${buildClarifyPrompt(
          context.featureRequest.title,
          context.featureRequest.description,
          maxAllowed
        )}\n\nHere's what's already been answered:\n${qaText}\n\nGiven these answers, is there still missing information? Only ask NEW questions not already covered above.`,
      })
      return object
    })

    const newQuestions = aiResult.questions.slice(0, maxAllowed)

    if (!aiResult.needsClarification || newQuestions.length === 0) {
      await step.run('mark-ready', async () => {
        await prisma.featureRequest.update({
          where: { id: featureRequestId },
          data: { status: 'READY' },
        })
      })

      await step.sendEvent('trigger-prd-generation', {
        name: 'prd/generate',
        data: { featureRequestId },
      })

      return { status: 'ready', followUpsAsked: 0 }
    }

    await step.run('save-followup-questions', async () => {
      await prisma.clarificationQuestion.createMany({
        data: newQuestions.map((q: string) => ({
          question: q,
          featureRequestId,
          organizationId: context.featureRequest.organizationId,
        })),
      })
    })

    return { status: 'clarifying', followUpsAsked: newQuestions.length }
  }
)