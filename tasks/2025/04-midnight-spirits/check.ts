// Two paths can be equally safe, so accept any path that starts top left, only moves right or
// down, ends bottom right and adds up to the official minimum.
import { normalize } from '../../../scripts/tasks.ts'

export default function check(output: string, ctx: { input: string | null; answer: string | null }): string | null {
  const grids: number[][][] = (ctx.input ?? '')
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/,\s*\]$/, ']'))
    .filter((l) => l.startsWith('['))
    .map((l) => JSON.parse(l))
  const got = normalize(output).split(/\n\s*\n/)
  const want = normalize(ctx.answer ?? '').split(/\n\s*\n/)
  if (got.length !== grids.length) return `expected ${grids.length} cases, got ${got.length}`
  for (let k = 0; k < grids.length; k++) {
    const grid = grids[k]!
    const [total, ...cells] = got[k]!.split('\n')
    if (total !== want[k]!.split('\n')[0]) return `case ${k + 1}: expected ${want[k]!.split('\n')[0]}, got ${total}`
    const path = cells.map((c) => JSON.parse(c) as [number, number])
    let sum = 0
    for (let i = 0; i < path.length; i++) {
      const [r, c] = path[i]!
      if (i === 0 ? r !== 0 || c !== 0 : r + c !== path[i - 1]![0] + path[i - 1]![1] + 1 || r < path[i - 1]![0] || c < path[i - 1]![1])
        return `case ${k + 1}: illegal step to [${r}, ${c}]`
      sum += grid[r]![c]!
    }
    const [lr, lc] = path.at(-1)!
    if (lr !== grid.length - 1 || lc !== grid[0]!.length - 1) return `case ${k + 1}: the path does not end bottom right`
    if (String(sum) !== total) return `case ${k + 1}: the path adds up to ${sum}, not ${total}`
  }
  return null
}
