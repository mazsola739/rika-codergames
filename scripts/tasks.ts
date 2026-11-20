// Shared helpers: find editions and tasks, run a solution, compare its output.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

export const ROOT = resolve(import.meta.dirname, '..')
export const TASKS_DIR = join(ROOT, 'tasks')

export interface Edition {
  id: string
  title: string
  dates: string
  theme: string
  source: string
  summary: string
}

export interface TaskMeta {
  number: number
  title: string
  original?: string
  /** One sentence for the website: what the task asks. */
  summary?: string
  /** The answer in a few words, for the website. */
  result?: string
  /** How hard the task is, 1 (a few lines) to 5 (needs a real idea). */
  difficulty?: number
  topics: string[]
  country?: string
  /** File name of the input, or null when the task has no input file. */
  input?: string | null
  /** File name of the official answer, or null when there is none. */
  answer?: string | null
  /** URL to download the input from when it is too large for git. */
  fetch?: string
  /** 'exact' compares the output to the answer line by line; 'custom' uses check.ts. */
  check?: 'exact' | 'custom'
  /** Seconds before the run is aborted. */
  timeout?: number
  status?: 'solved' | 'pending'
}

export interface Task extends TaskMeta {
  edition: Edition
  id: string
  dir: string
}

export function loadEditions(): Edition[] {
  return readdirSync(TASKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(TASKS_DIR, d.name, 'edition.json')))
    .map((d) => ({ id: d.name, ...JSON.parse(readFileSync(join(TASKS_DIR, d.name, 'edition.json'), 'utf8')) }))
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function loadTasks(edition: Edition): Task[] {
  const dir = join(TASKS_DIR, edition.id)
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, 'task.json')))
    .map((d) => {
      const meta: TaskMeta = JSON.parse(readFileSync(join(dir, d.name, 'task.json'), 'utf8'))
      return { ...meta, edition, id: `${edition.id}/${meta.number}`, dir: join(dir, d.name) }
    })
    .sort((a, b) => a.number - b.number)
}

export function allTasks(): Task[] {
  return loadEditions().flatMap(loadTasks)
}

export const inputPath = (t: Task) => (t.input === null ? null : join(t.dir, t.input ?? 'input.txt'))
export const answerPath = (t: Task) => (t.answer === null ? null : join(t.dir, t.answer ?? 'answer.txt'))

/** Same text modulo line endings, trailing spaces and trailing blank lines. */
export function normalize(text: string): string {
  return text
    .replace(/^﻿/, '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim()
}

export interface RunResult {
  output: string
  stderr: string
  ms: number
  error?: string
}

export function runSolution(t: Task, input: string | null = inputPath(t)): RunResult {
  const args = ['--experimental-strip-types', '--no-warnings', '--stack-size=65500', 'solution.ts']
  if (input) args.push(input)
  const start = performance.now()
  const r = spawnSync(process.execPath, args, {
    cwd: t.dir,
    encoding: 'utf8',
    timeout: (t.timeout ?? 60) * 1000,
    maxBuffer: 256 * 1024 * 1024,
  })
  const ms = performance.now() - start
  const error = r.error
    ? r.error.message
    : r.status !== 0
      ? `exit code ${r.status}${r.stderr ? `\n${r.stderr.trim()}` : ''}`
      : undefined
  return { output: r.stdout ?? '', stderr: r.stderr ?? '', ms, error }
}

/** Returns null when the output is accepted, otherwise a short reason. */
export async function check(t: Task, output: string): Promise<string | null> {
  const input = inputPath(t)
  const answer = answerPath(t)
  const ctx = {
    input: input && existsSync(input) ? readFileSync(input, 'utf8') : null,
    answer: answer && existsSync(answer) ? readFileSync(answer, 'utf8') : null,
  }
  if (t.check === 'custom') {
    const mod = await import(pathToFileURL(join(t.dir, 'check.ts')).href)
    return mod.default(output, ctx)
  }
  if (ctx.answer === null) return null
  const got = normalize(output).split('\n')
  const want = normalize(ctx.answer).split('\n')
  for (let i = 0; i < Math.max(got.length, want.length); i++) {
    if (got[i] !== want[i]) {
      return `line ${i + 1}: expected ${JSON.stringify(want[i] ?? '<end>')}, got ${JSON.stringify(got[i] ?? '<end>')}`
    }
  }
  return null
}
