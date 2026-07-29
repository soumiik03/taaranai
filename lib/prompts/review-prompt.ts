export type ReviewTask = {
  id: string
  title: string
  description: string
}

export function buildReviewPrompt(
  tasks: ReviewTask[],
  diff: { filename: string; content: string },
  isReReview: boolean,
  previousVerdicts?: { taskId: string; status: string; reasoning: string }[],
  previousIssues?: { file: string; line: number; message: string; resolved: boolean }[]
) {
  const taskBoard = tasks.map((task) =>
    'TASK ' + task.id + '\nTitle: ' + task.title + '\nDescription: ' + task.description
  ).join('\n\n')

  const lines = [
    'You are a strict code reviewer. You are reviewing ONE diff chunk from a pull request.',
    'Your job is to check whether the code VISIBLE in this diff chunk correctly implements the tasks from the Kanban board.',
    '',
    'TASK BOARD (the only allowed scope):',
    taskBoard,
    '',
  ]

  if (isReReview && previousIssues && previousIssues.length > 0) {
    lines.push(
      '=== RE-REVIEW MODE ===',
      'This is a re-review. A previous review flagged the issues listed below.',
      'Your ONLY job is to check whether these specific previously-flagged issues are now fixed.',
      '',
      'PREVIOUSLY FLAGGED ISSUES:',
      JSON.stringify(previousIssues, null, 2),
      '',
      'CRITICAL RE-REVIEW RULES:',
      '- If a previously flagged issue is NOW FIXED in this diff, mark the corresponding task as DONE. Do NOT re-output the issue.',
      '- If a previously flagged issue is STILL BROKEN in this diff, mark the task as NEEDS_FIX and re-output the issue.',
      '- DO NOT look for new issues. DO NOT flag anything that was not flagged in the previous review.',
      '- The ONLY exception: if the developer\'s fix introduced a direct regression or new bug ON THE SAME LINE they changed to fix the previous issue, you may flag that. But do NOT go hunting for unrelated new problems.',
      '- If none of the previously flagged issues relate to this diff chunk, return empty issues and mark all tasks NOT_ADDRESSED.',
      ''
    )

    if (previousVerdicts && previousVerdicts.length > 0) {
      lines.push(
        'PREVIOUS VERDICTS (for context only):',
        JSON.stringify(previousVerdicts, null, 2),
        ''
      )
    }
  }

  lines.push(
    'DIFF CHUNK TO REVIEW:',
    '```',
    diff.content,
    '```',
    '',
    'STRICT RULES (you MUST follow ALL of these):',
    '',
    '1. ONLY flag issues with code that IS PRESENT and VISIBLE in the diff above.',
    '   DO NOT flag the absence of code. If a task\'s code is not in this chunk, that is fine — it may be in another chunk. Mark that task NOT_ADDRESSED and move on.',
    '',
    '2. DO NOT invent, assume, imagine, or speculate about code you cannot see.',
    '   If you cannot point to a specific added line (a line starting with "+") that contains the defect, you have no issue to report.',
    '',
    '3. Every issue MUST have:',
    '   - A taskId from the task board above',
    '   - The exact filename of THIS chunk',
    '   - An exact line number of a CHANGED (added/"+") line in the diff',
    '   - A message that describes the SPECIFIC defect in the code on that line (NOT just the task title)',
    '',
    '4. The "message" field must describe what is WRONG with the actual code on that line.',
    '   BAD message: "Update global styles for dark background" (this is just the task title)',
    '   GOOD message: "background-color is set to #333 but the task requires pure black (#000000)"',
    '',
    '5. If this diff chunk contains no defects, return an EMPTY issues array [].',
    '   Returning zero issues is a perfectly valid outcome. Do NOT manufacture issues to fill the array.',
    '',
    '6. Do not report style preferences, best practices, or suggestions unrelated to the task board.',
    '',
    '7. A task is DONE if the code in this chunk correctly implements it.',
    '   A task is NEEDS_FIX ONLY if you see actual wrong code for that task in this chunk.',
    '   A task is NOT_ADDRESSED if this chunk has no code related to that task — this is NOT a problem.',
    '',
    'Return only the requested structured JSON object.'
  )

  return lines.join('\n')
}