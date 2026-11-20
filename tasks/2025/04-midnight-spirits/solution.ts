// CoderGames 2025, task 4: the safest way home, moving only right or down through a grid of danger
// values. Minimum path sum, a classic DP: best[r][c] = danger[r][c] + min(best above, best left).
// Remembering which neighbour won lets us walk back from the bottom right to print the path.
import { readFileSync } from 'node:fs'

const maps: number[][][] = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim().replace(/,\s*\]$/, ']'))
  .filter((l) => l.startsWith('['))
  .map((l) => JSON.parse(l))

const out: string[] = []
for (const grid of maps) {
  const rows = grid.length
  const cols = grid[0]!.length
  const best = grid.map((row) => row.map(() => Infinity))
  const fromAbove = grid.map((row) => row.map(() => false))
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const up = r > 0 ? best[r - 1]![c]! : Infinity
      const left = c > 0 ? best[r]![c - 1]! : Infinity
      const prev = r === 0 && c === 0 ? 0 : Math.min(up, left)
      best[r]![c] = grid[r]![c]! + prev
      fromAbove[r]![c] = up < left
    }
  const path: string[] = []
  for (let r = rows - 1, c = cols - 1; ; ) {
    path.push(`[${r}, ${c}]`)
    if (r === 0 && c === 0) break
    if (fromAbove[r]![c]) r--
    else c--
  }
  out.push([String(best[rows - 1]![cols - 1]), ...path.reverse()].join('\n'))
}
console.log(out.join('\n\n'))
