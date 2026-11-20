// CoderGames 2024, task 5: CCTV. Camera images sit in an h x w grid; the arrow buttons shift every
// image one cell, wrapping around at the edges. Make the bounding box of all images as small as
// possible, with as few presses as possible.
//
// Up/down only change rows and left/right only change columns, and the box area is
// (rows spanned) x (columns spanned). So rows and columns can be solved separately, each on a
// circle of size h (or w):
// - the occupied rows split the circle into gaps; cutting the circle at the largest gap leaves the
//   shortest block that covers them all: span = h - largest gap;
// - that block has to end up not wrapping around the edge; the presses needed are the circular
//   distance from where it starts to the nearest start that fits. With several largest gaps,
//   take the cheapest one.
import { readFileSync } from 'node:fs'

function solveAxis(positions: number[], size: number): { span: number; moves: number } {
  const occupied = [...new Set(positions)].sort((a, b) => a - b)
  let best = { span: size, moves: 0 }
  if (occupied.length === size) return best
  for (let i = 0; i < occupied.length; i++) {
    // Gap between occupied[i] and the next occupied position going forward around the circle.
    const next = occupied[(i + 1) % occupied.length]!
    const gap = (next - occupied[i]! - 1 + size) % size
    const span = size - gap
    const start = next // the block begins right after this gap
    // Starts that don't wrap: 0 .. size - span. Distance on the circle to the closest of them.
    let moves = Infinity
    for (const t of [0, size - span]) {
      const d = Math.abs(start - t)
      moves = Math.min(moves, d, size - d)
    }
    if (start <= size - span) moves = 0
    if (span < best.span || (span === best.span && moves < best.moves)) best = { span, moves }
  }
  return best
}

// Cases: "h; w; k", then k lines "r; c" (1-based), separated by blank lines.
const numbers = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0)
  .map((l) => l.split(/[;\s]+/).map(Number))

const out: string[] = []
for (let at = 0; at < numbers.length; ) {
  const [h, w, k] = numbers[at++]! as [number, number, number]
  const cells = numbers.slice(at, at + k)
  at += k
  const rows = solveAxis(cells.map(([r]) => r! - 1), h)
  const cols = solveAxis(cells.map(([, c]) => c! - 1), w)
  out.push(`${rows.span * cols.span}; ${rows.moves + cols.moves}`)
}
console.log(out.join('\n'))
