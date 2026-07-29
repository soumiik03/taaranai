import { generateObject } from 'ai'
import { z } from 'zod'
import { clarificationModel } from '@/lib/ai/openrouter'
import { buildReviewPrompt, type ReviewTask } from '@/lib/prompts/review-prompt'
import type { DiffChunk } from '@/lib/github/chunk-code'

const taskVerdictSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(['DONE', 'NEEDS_FIX', 'NOT_ADDRESSED']),
  reasoning: z.string().min(1),
})

const lineIssueSchema = z.object({
  taskId: z.string().min(1),
  file: z.string().min(1),
  line: z.number().int().positive(),
  severity: z.enum(['blocking', 'non-blocking']),
  message: z.string().min(1),
})

const reviewResponseSchema = z.object({
  taskVerdicts: z.array(taskVerdictSchema).max(100),
  issues: z.array(lineIssueSchema).max(50),
  overallVerdict: z.enum(['READY', 'NEEDS_FIX']),
})

export type GeneratedTaskVerdict = z.infer<typeof taskVerdictSchema>
export type GeneratedReviewIssue = z.infer<typeof lineIssueSchema>
export type GeneratedChunkReview = z.infer<typeof reviewResponseSchema>

export async function reviewDiffChunk(
  tasks: ReviewTask[],
  chunk: DiffChunk,
): Promise<GeneratedChunkReview> {
  const { object } = await generateObject({
    model: clarificationModel,
    schema: reviewResponseSchema,
    prompt: buildReviewPrompt(tasks, chunk),
  })

  const taskIds = new Set(tasks.map((task) => task.id))
  const changedLines = new Set(chunk.changedLines)

  return {
    taskVerdicts: object.taskVerdicts.filter((verdict) => taskIds.has(verdict.taskId)),
    issues: object.issues
      .filter((issue) => taskIds.has(issue.taskId))
      .filter((issue) => issue.file === chunk.filename && changedLines.has(issue.line)),
    overallVerdict: object.overallVerdict,
  }
}