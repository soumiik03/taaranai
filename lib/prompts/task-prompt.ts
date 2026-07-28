// lib/prompts/task-prompt.ts

export type PrdPromptData = {
  id: string
  problemStatement?: string | null
  goals?: unknown
  nonGoals?: unknown
  userStories?: unknown
  acceptanceCriteria?: unknown
  edgeCases?: unknown
  successMetrics?: unknown
  featureRequest?: {
    title: string
    description: string
  } | null
}

export function buildTaskPrompt(prd: PrdPromptData): string {
  const title = prd.featureRequest?.title || 'Feature Request'
  const description = prd.featureRequest?.description || ''

  const stringifySection = (val: unknown): string => {
    if (!val) return 'None specified'
    if (typeof val === 'string') return val
    if (Array.isArray(val)) {
      return val
        .map((item) => {
          if (typeof item === 'object' && item !== null) {
            if ('role' in item && 'story' in item) {
              return `- As a ${item.role}: ${item.story}`
            }
            return `- ${JSON.stringify(item)}`
          }
          return `- ${item}`
        })
        .join('\n')
    }
    return JSON.stringify(val, null, 2)
  }

  return `You are a Principal Software Architect breaking down an approved Product Requirement Document (PRD) into discrete, actionable implementation tasks for an engineering team.

FEATURE TITLE:
${title}

FEATURE DESCRIPTION:
${description}

PROBLEM STATEMENT:
${prd.problemStatement || 'N/A'}

GOALS:
${stringifySection(prd.goals)}

NON-GOALS:
${stringifySection(prd.nonGoals)}

USER STORIES:
${stringifySection(prd.userStories)}

ACCEPTANCE CRITERIA:
${stringifySection(prd.acceptanceCriteria)}

EDGE CASES:
${stringifySection(prd.edgeCases)}

SUCCESS METRICS:
${stringifySection(prd.successMetrics)}

INSTRUCTIONS:
1. Break down this feature into actionable development tasks.
2. Provide at least 5 and MAXIMUM 10 tasks total.
3. Order tasks sequentially from foundational infrastructure/database models to backend APIs/Server Actions, and finally frontend UI components and integration (DB → API → UI).
4. Each task must have:
   - "title": Concise, action-oriented title (e.g. "Create database model for Task and PRD relations")
   - "description": Concrete technical implementation details explaining what files or components to build/modify.
   - "priority": One of "low", "medium", or "high" based on dependency critical path.

Generate the structured JSON response matching the required schema.`
}
