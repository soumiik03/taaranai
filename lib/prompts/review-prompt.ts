export type ReviewPrd = {
  problemStatement: string
  goals: unknown
  nonGoals: unknown
  userStories: unknown
  acceptanceCriteria: unknown
  edgeCases: unknown
  successMetrics: unknown
  featureRequest?: { title: string; description: string } | null
  reviewMode?: 'prd' | 'general'
}

export function formatPrdForReview(prd: ReviewPrd) {
  return JSON.stringify({ reviewMode: prd.reviewMode ?? 'prd', feature: prd.featureRequest, problemStatement: prd.problemStatement, goals: prd.goals, nonGoals: prd.nonGoals, userStories: prd.userStories, acceptanceCriteria: prd.acceptanceCriteria, edgeCases: prd.edgeCases, successMetrics: prd.successMetrics }, null, 2)
}

export function buildReviewPrompt(prd: ReviewPrd, diff: { filename: string; content: string }) {
  const reviewScope = prd.reviewMode === 'general'
    ? 'You are a meticulous senior software engineer performing a general pull request review. No product PRD is linked, so assess only concrete defects, security risks, correctness issues, and maintainability problems evidenced by the diff. Do not invent product requirements.'
    : 'You are a meticulous senior QA engineer reviewing a pull request against its Product Requirements Document (PRD).'
  return `${reviewScope}

PRD (source of truth, or review mode context):
${formatPrdForReview(prd)}

PULL REQUEST DIFF CHUNK:
${diff.content}

Review only the implementation shown in this chunk. Identify concrete defects or omissions related to:
- functional requirements and acceptance criteria
- security, authorization, validation, and data isolation
- edge cases and failure handling
- maintainability and code quality when it affects correctness

Do not report style preferences, hypothetical issues without evidence, or requirements absent from the supplied review context. Report each issue at most once. The line must be a changed line from the supplied diff and should be the numeric line after L. Use null when no exact changed line is available.

Return a JSON object with an issues array. Each issue must contain:
- severity: exactly "blocking" or "non-blocking"
- title: short actionable summary
- body: clear explanation and recommended fix
- file: the supplied filename
- line: a changed-line number or null`
}
