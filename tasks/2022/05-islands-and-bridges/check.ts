// The published answers come from the organisers' Python program, which has an indexing bug
// (see official.ts and README.md). So instead of comparing with them directly, this check:
//  1. re-runs a faithful port of the official program and confirms it reproduces every published
//     answer, which shows the bug explains the differences, and
//  2. runs the same port with the bug fixed and requires solution.ts to agree with it everywhere.
import { normalize } from '../../../scripts/tasks.ts'
import { officialAnswers } from './official.ts'

export default function check(output: string, ctx: { input: string | null; answer: string | null }): string | null {
  const input = ctx.input ?? ''
  const published = normalize(ctx.answer ?? '').split('\n').map(Number)
  const buggy = officialAnswers(input, true)
  const fixed = officialAnswers(input, false)
  const mine = normalize(output).split('\n').map(Number)
  const bad = buggy.findIndex((x, i) => x !== published[i])
  if (bad >= 0) return `the port of the official program gives ${buggy[bad]} for case ${bad + 1}, published ${published[bad]}`
  const wrong = fixed.findIndex((x, i) => x !== mine[i])
  if (wrong >= 0) return `case ${wrong + 1}: expected ${fixed[wrong]} (official algorithm, bug fixed), got ${mine[wrong]}`
  return null
}
