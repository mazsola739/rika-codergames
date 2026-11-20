import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Greedy vs. the fewest coins'
export const caption =
  'Pick a coin set and an amount. Greedy (largest coin first) is shown next to the optimal answer from dynamic programming. The chart below marks every amount up to 200 where greedy needs more coins.'

export function data(dir: string) {
  const lines = inputText(dir)!.trim().split('\n')
  const sets: number[][] = []
  for (let k = 0; k < Number(lines[0]); k++) sets.push(lines[2 + 2 * k]!.trim().split(/\s+/).map(Number))
  return [[1, 5, 10, 25], [5, 10, 25], [2, 12, 15, 24], ...sets.filter((s, i, a) => a.findIndex((x) => x.join() === s.join()) === i)]
}
