export type ReviewTask = {
  id: string
  title: string
  description: string
}

export function buildReviewPrompt(
  tasks: ReviewTask[],
  diff: { filename: string; content: string },
  previousVerdicts?: { taskId: string; status: string; reasoning: string }[],
  previousIssues?: { file: string; line: number; message: string; resolved: boolean }[]
) {
  const taskBoard = tasks.map((task) =>
    'TASK ' + task.id + '\nTitle: ' + task.title + '\nDescription: ' + task.description
  ).join('\n\n')

  const lines = [
    'You are reviewing one pull-request diff chunk against an approved Kanban task board.',
    '',
    'TASK BOARD (the only allowed scope):',
    taskBoard,
    '',
  ]

  if (previousVerdicts && previousVerdicts.length > 0) {
    lines.push(
      'PREVIOUS REVIEW CONTEXT (VERDICTS):',
      JSON.stringify(previousVerdicts, null, 2),
      '',
      'A previous review of this PR exists. The new review should explicitly state what is now resolved, what is still outstanding, and flag any regressions on previously-fine tasks.',
      ''
    )
  }

  if (previousIssues && previousIssues.length > 0) {
    lines.push(
      'PREVIOUS ISSUES (STILL UNRESOLVED):',
      JSON.stringify(previousIssues, null, 2),
      '',
      'These issues were flagged in the last review and are not yet resolved.',
      'Check specifically whether each of these issues is now fixed in the provided diff.',
      'If an issue is NOW FIXED, you MUST acknowledge it as resolved and DO NOT output it again in the issues list.',
      'If an issue is STILL PRESENT and not fixed, you MUST output it again.',
      ''
    )
  }

  lines.push(
    'PULL REQUEST DIFF CHUNK:',
    diff.content,
    '',
    'Strict review rules:',
    '- DO NOT invent, assume, or speculate about code you cannot see in this exact diff chunk.',
    '- Your review MUST be grounded STRICTLY in two things and nothing else: (a) the actual diff content provided, and (b) the specific tasks on the board.',
    '- Evaluate only whether the implementation in this diff chunk fulfills the supplied tasks.',
    '- Every issue must cite exactly one task id from the task board. If an issue cannot be tied to a real line in the diff AND a real task, it MUST NOT appear in the output.',
    '- Do not report style preferences, generic best practices, unrelated refactors, or concerns that cannot be traced to a supplied task.',
    '- Return task verdicts only for tasks that this chunk provides evidence about. Use NOT_ADDRESSED only when this chunk clearly shows that a task is missing or contradicted; do not mark a task NOT_ADDRESSED merely because it belongs to another diff chunk.',
    '- Issues must use the supplied file and an exact changed (added) line number. If no exact changed line exists, do not return that issue. Every issue must describe a concrete task-completion defect; non-blocking suggestions are allowed only when they directly affect a supplied task.',
    '- A task is DONE only when the relevant implementation shown here is correct and complete for the task evidence available in this chunk. Do not infer or mention generic style, security, maintainability, or best-practice concerns outside the supplied task. Use NEEDS_FIX for a concrete defect or incomplete implementation.',
    '',
    'Return only the requested structured object.'
  )

  return lines.join('\n')
}