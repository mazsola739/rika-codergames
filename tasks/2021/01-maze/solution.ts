// CoderGames 2021, task 1: shortest way out of a maze. Breadth-first search from S finds the
// shortest path to E; then every '.' on that path is replaced by '*'.
import { readFileSync } from 'node:fs'

const grid = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .filter((line) => line.length > 0)
  .map((line) => [...line])
const rows = grid.length
const cols = grid[0]!.length

const find = (ch: string): [number, number] => {
  for (let r = 0; r < rows; r++) {
    const c = grid[r]!.indexOf(ch)
    if (c >= 0) return [r, c]
  }
  throw new Error(`no ${ch} in the maze`)
}
const [sr, sc] = find('S')
const [er, ec] = find('E')

// BFS: cells are visited in order of distance from S; `from` remembers how we got to each cell.
const from = new Int32Array(rows * cols).fill(-1)
const queue = [sr * cols + sc]
from[queue[0]!] = queue[0]!
for (let head = 0; head < queue.length; head++) {
  const cell = queue[head]!
  const r = Math.floor(cell / cols)
  const c = cell % cols
  for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
    const nr = r + dr
    const nc = c + dc
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr]![nc] === '#') continue
    const next = nr * cols + nc
    if (from[next] !== -1) continue
    from[next] = cell
    queue.push(next)
  }
}

const exit = er * cols + ec
if (from[exit] === -1) console.log('Trapped')
else {
  // Walk back from E to S and mark the path.
  for (let cell = from[exit]!; grid[Math.floor(cell / cols)]![cell % cols] !== 'S'; cell = from[cell]!) {
    grid[Math.floor(cell / cols)]![cell % cols] = '*'
  }
  console.log(grid.map((row) => row.join('')).join('\n'))
}
