export type ReviewTask = {
  id: string
  title: string
  description: string
}

export function buildReviewPrompt(tasks: ReviewTask[], diff: { filename: string; content: string }) {
  const taskBoard = tasks.map((task) =>
    'TASK ' + task.id + '\nTitle: ' + task.title + '\nDescription: ' + task.description
  ).join('\n\n')

  return [
    'You are reviewing one pull-request diff chunk against an approved Kanban task board.',
    '',
    'TASK BOARD (the only allowed scope):',
    taskBoard,
    '',
    'PULL REQUEST DIFF CHUNK:',
    diff.content,
    '',
    'Strict review rules:',
    '- Evaluate only whether the implementation in this diff chunk fulfills the supplied tasks.',
    '- Every issue must cite exactly one task id from the task board.',
    '- Do not report style preferences, generic best practices, unrelated refactors, or concerns that cannot be traced to a supplied task.',
    '- Return task verdicts only for tasks that this chunk provides evidence about. Use NOT_ADDRESSED only when this chunk clearly shows that a task is missing or contradicted; do not mark a task NOT_ADDRESSED merely because it belongs to another diff chunk.',
    '- Issues must use the supplied file and an exact changed (added) line number. If no exact changed line exists, do not return that issue.',
    '- A task is DONE only when the relevant implementation shown here is correct and complete for the task evidence available in this chunk. Use NEEDS_FIX for a concrete defect or incomplete implementation.',
    '',
    'Return only the requested structured object.',
  ].join('\n')
}