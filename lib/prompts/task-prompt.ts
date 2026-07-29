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
1. Break down this feature into the smallest practical set of direct code implementation tasks.
2. Provide 1 to 3 tasks total maximum. For simple features or small UI/CSS tweaks, output ONLY 1 focused task. Never create extra tasks to fill a quota.
3. Focus strictly on working code implementation (e.g. core UI change, backend logic, or schema change).
4. STRICT RULES - ABSOLUTELY FORBIDDEN TASKS:
   - DO NOT create separate tasks for manual testing, cross-device testing, responsive testing, or QA.
   - DO NOT create separate tasks for writing documentation, updating development logs, or writing changelogs.
   - DO NOT create separate tasks for generic code reviews, deployment, or minor cleanup.
5. Each task must have:
   - "title": Concise, direct title (e.g. "Update global styles for dark background")
   - "description": Complete, clear, self-contained implementation instructions explaining exact code changes required. NEVER end descriptions with "..." or truncate thoughts.
   - "priority": One of "low", "medium", or "high" based on technical importance.

Generate the structured JSON response matching the required schema.`
}
