import type { PullRequestFile } from './pr-files'

export type DiffChunk = {
  filename: string
  content: string
  changedLines: number[]
}

const HUNK_HEADER = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/

function annotatePatch(filename: string, patch: string) {
  let newLine = 0
  const changedLines: number[] = []
  const annotated: string[] = [`FILE: ${filename}`]

  for (const line of patch.split(/\r?\n/)) {
    const hunk = line.match(HUNK_HEADER)
    if (hunk) {
      newLine = Number(hunk[1])
      annotated.push(line)
      continue
    }
    if (line.startsWith('+') && !line.startsWith('+++')) {
      changedLines.push(newLine)
      annotated.push(`L${newLine} | ${line}`)
      newLine += 1
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      annotated.push(`L- | ${line}`)
    } else {
      if (line.startsWith(' ') || line === '') newLine += 1
      annotated.push(`L${newLine - 1} | ${line}`)
    }
  }
  return { annotated, changedLines }
}

export function chunkPullRequestFiles(files: PullRequestFile[], maxLines = 100): DiffChunk[] {
  if (maxLines < 1) throw new Error('maxLines must be positive')
  const chunks: DiffChunk[] = []
  for (const file of files) {
    if (!file.patch) continue
    const { annotated, changedLines } = annotatePatch(file.filename, file.patch)
    for (let start = 0; start < annotated.length; start += maxLines) {
      const content = annotated.slice(start, start + maxLines).join('\n')
      const chunkLines = content
        .split('\n')
        .map((line) => line.match(/^L(\d+) \|/))
        .filter((match): match is RegExpMatchArray => Boolean(match))
        .map((match) => Number(match[1]))
      chunks.push({ filename: file.filename, content, changedLines: changedLines.filter((line) => chunkLines.includes(line)) })
    }
  }
  return chunks
}
