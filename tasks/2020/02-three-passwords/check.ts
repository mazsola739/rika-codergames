// The official answer is one strategy; the program lists every strategy that works.
// Accept the output if the official strategy is among them and nothing else is wrong.
import { normalize } from '../../../scripts/tasks.ts'

export default function check(output: string, { answer }: { answer: string | null }): string | null {
  const lines = normalize(output).split('\n')
  const official = normalize(answer ?? '')
  if (!lines.includes(official)) return `the official strategy is missing: ${official}`
  if (lines.at(-1) !== '6 of 81 strategies always find a right password') return `unexpected summary: ${lines.at(-1)}`
  return null
}
