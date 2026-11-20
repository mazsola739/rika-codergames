// The official answer lists the best earnings for all 30 shelves. Several selling orders can earn
// the same, so for the order we only check that it is legal and really adds up to that amount.
import { normalize } from '../../../scripts/tasks.ts'

export default function check(output: string, ctx: { input: string | null; answer: string | null }): string | null {
  const got = normalize(output).split('\n')
  const want = normalize(ctx.answer ?? '').split('\n')
  const shelves = normalize(ctx.input ?? '').split('\n').slice(1)
  if (got.length !== want.length) return `expected ${want.length} lines, got ${got.length}`
  for (let k = 0; k < want.length; k++) {
    const [total, expr] = got[k]!.split(', ') as [string, string]
    if (total !== want[k]) return `case ${k + 1}: expected ${want[k]}, got ${total}`
    // Replay the order: each sold price must come from one end of what is left on the shelf.
    // When both ends hold the same price, either could be meant, so search both (memoised).
    const shelf = shelves[k]!.trim().split(/\s+/).map(Number)
    const terms = expr.split(' + ').map((t) => t.split('*').map(Number) as [number, number])
    if (terms.length !== shelf.length) return `case ${k + 1}: ${terms.length} sales for ${shelf.length} bottles`
    if (terms.some(([year], i) => year !== i + 1)) return `case ${k + 1}: years are not 1, 2, 3, ...`
    const seen = new Set<number>()
    const legal = (i: number, j: number): boolean => {
      if (i > j) return true
      const key = i * shelf.length + j
      if (seen.has(key)) return false
      seen.add(key)
      const price = terms[i + shelf.length - 1 - j]![1]
      return (shelf[i] === price && legal(i + 1, j)) || (shelf[j] === price && legal(i, j - 1))
    }
    if (!legal(0, shelf.length - 1)) return `case ${k + 1}: the order is not a legal way to empty the shelf`
    const sum = terms.reduce((s, [year, price]) => s + year * price, 0)
    if (String(sum) !== total) return `case ${k + 1}: the order earns ${sum}, not ${total}`
  }
  return null
}
