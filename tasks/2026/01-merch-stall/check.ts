// The output must equal the official answer, and an independent brute-force simulation of every
// position, price and fan (simulate.ts) must agree that it is the best choice.
import { normalize } from '../../../scripts/tasks.ts'
import { simulate } from './simulate.ts'

export default function check(output: string, ctx: { input: string | null; answer: string | null }): string | null {
  const got = normalize(output)
  if (got !== normalize(ctx.answer ?? '')) return `expected ${normalize(ctx.answer ?? '')}, got ${got}`
  const brute = simulate(ctx.input ?? '')
  if (`${brute.L} ${brute.P}` !== got) return `the brute-force simulation prefers ${brute.L} ${brute.P}`
  return null
}
