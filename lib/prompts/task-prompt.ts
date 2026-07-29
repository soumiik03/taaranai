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
1. Break down this feature into the smallest practical set of actionable implementation tasks.
2. Provide 2 to 5 tasks total. Prefer fewer tasks when the feature is small; never create tasks just to fill a quota.
3. Keep each task focused on one user-visible outcome or tightly related implementation change. Do not force database, API, UI, testing, or documentation layers when they are not required.
4. Each task must have:
   - "title": Concise, action-oriented title (e.g. "Create database model for Task and PRD relations")
   - "description": Short, clear implementation context explaining what needs to change and how it fulfills the requirement. Keep it understandable to a teammate, not a design document.
   - "priority": One of "low", "medium", or "high" based on importance.

5. Do not create separate tasks solely for tests, documentation, code review, deployment, or generic cleanup unless the PRD explicitly requires them.

Generate the structured JSON response matching the required schema.`
}
