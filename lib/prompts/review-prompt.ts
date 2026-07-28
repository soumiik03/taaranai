export type ReviewPrd = {
  problemStatement: string
  goals: unknown
  nonGoals: unknown
  userStories: unknown
  acceptanceCriteria: unknown
  edgeCases: unknown
  successMetrics: unknown
  featureRequest?: { title: string; description: string } | null
}

export function formatPrdForReview(prd: ReviewPrd) {
  return JSON.stringify({ feature: prd.featureRequest, problemStatement: prd.problemStatement, goals: prd.goals, nonGoals: prd.nonGoals, userStories: prd.userStories, acceptanceCriteria: prd.acceptanceCriteria, edgeCases: prd.edgeCases, successMetrics: prd.successMetrics }, null, 2)
}

export function buildReviewPrompt(prd: ReviewPrd, diff: { filename: string; content: string }) {
  return `You are a meticulous senior QA engineer reviewing a pull request against its Product Requirements Document (PRD).

PRD (source of truth):
${formatPrdForReview(prd)}

PULL REQUEST DIFF CHUNK:
${diff.content}

Review only the implementation shown in this chunk. Identify concrete defects or omissions related to:
- functional requirements and acceptance criteria
- security, authorization, validation, and data isolation
- edge cases and failure handling
- maintainability and code quality when it affects correctness

Do not report style preferences, hypothetical issues without evidence, or requirements absent from the PRD. Report each issue at most once. The line must be a changed line from the supplied diff and should be the numeric line after L. Use null when no exact changed line is available.

Return a JSON object with an issues array. Each issue must contain:
- severity: exactly "blocking" or "non-blocking"
- title: short actionable summary
- body: clear explanation and recommended fix
- file: the supplied filename
- line: a changed-line number or null`
}
