// CoderGames for Women 2025, task 2: stability of the universe.
// The grid wraps around in both directions (a torus). A gravitational centre P is a cell whose
// value is strictly bigger than the 16 cells on its four axes at distance 1 and 2: vertical (a),
// horizontal (b), diagonal (x) and the other diagonal (y). P is stable when every axis is
// symmetric around it, i.e. the cell at P + d equals the cell at P - d for all 8 directions d.
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0)
const [rows, cols] = lines[0]!.split(/\s+/).map(Number) as [number, number]
const grid = lines.slice(1, 1 + rows).map((l) => l.split(/\s+/).map(Number))
const at = (r: number, c: number) => grid[((r % rows) + rows) % rows]![((c % cols) + cols) % cols]!

// Half of the directions; the other half are their opposites.
const HALF: [number, number][] = [
  [-1, 0], [-2, 0], // a: vertical
  [0, 1], [0, 2], // b: horizontal
  [1, 1], [2, 2], // x: diagonal
  [-1, 1], [-2, 2], // y: the other diagonal
]

let stable = 0
let unstable = 0
for (let r = 0; r < rows; r++)
  for (let c = 0; c < cols; c++) {
    const p = at(r, c)
    const isCentre = HALF.every(([dr, dc]) => p > at(r + dr, c + dc) && p > at(r - dr, c - dc))
    if (!isCentre) continue
    const symmetric = HALF.every(([dr, dc]) => at(r + dr, c + dc) === at(r - dr, c - dc))
    if (symmetric) stable++
    else unstable++
  }
console.log(`${stable} ${unstable}`)
