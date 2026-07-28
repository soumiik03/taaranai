// lib/prompts/prd-prompt.ts
type ClarificationPair = { question: string; answer: string | null }

export function buildPrdPrompt(
  title: string,
  description: string,
  clarifications: ClarificationPair[]
) {
  const qaText = clarifications
    .map((c) => `Q: ${c.question}\n${c.answer ? `A: ${c.answer}` : 'A: (No answer provided)'}`)
    .join('\n\n')

  return `You are a senior product manager writing a PRD for engineering.

Feature request: ${title}
Description: ${description}

${qaText ? `Additional context from clarification:\n${qaText}` : 'No clarification was needed — this request was already clear.'}

Write a complete, specific PRD. Avoid vague language — every acceptance
criterion should be testable, every user story should name a real user
role and a real action. Do not pad sections with filler just to seem
thorough; a short accurate list beats a long vague one.`
}
