import { generateObject } from 'ai'
import { z } from 'zod'
import { clarificationModel } from '@/lib/ai/openrouter'
import { buildReviewPrompt } from '@/lib/prompts/review-prompt'
import type { DiffChunk } from '@/lib/github/chunk-code'

const reviewIssueSchema = z.object({
  severity: z.enum(['blocking', 'non-blocking']),
  title: z.string().min(1),
  body: z.string().min(1),
  file: z.string().min(1),
  line: z.number().int().positive().nullable(),
})
const reviewResponseSchema = z.object({ issues: z.array(reviewIssueSchema).max(20) })
export type GeneratedReviewIssue = z.infer<typeof reviewIssueSchema>

export async function reviewDiffChunk(
  prd: Parameters<typeof buildReviewPrompt>[0], chunk: DiffChunk
): Promise<GeneratedReviewIssue[]> {
  const { object } = await generateObject({ model: clarificationModel, schema: reviewResponseSchema, prompt: buildReviewPrompt(prd, chunk) })
  return object.issues.map((issue) => ({
    ...issue,
    file: issue.file === chunk.filename ? issue.file : chunk.filename,
    line: issue.line && chunk.changedLines.includes(issue.line) ? issue.line : null,
  }))
}
