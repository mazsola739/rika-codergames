// Helpers for the build-time part of task visualisations (tasks/*/*/visual.ts).
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/** The task's input file as text (CRLF normalised), or null when it isn't there. */
export function inputText(dir: string, file = 'input.txt'): string | null {
  const path = join(dir, file)
  return existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n?/g, '\n') : null
}
