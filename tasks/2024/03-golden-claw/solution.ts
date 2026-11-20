// CoderGames 2024, task 3: the Golden Claw. A pyramid of m-faced pillars must show the faces of the
// sketch on the door. Turning a pillar also turns the two pillars below it the same way, and so on
// down to the bottom row.
//
// Let total(i, j) be how far pillar j of row i turns in the end. It is its own manual turn plus the
// totals of the (up to two) pillars directly above it:
//     total(i, j) = manual(i, j) + total(i-1, j-1) + total(i-1, j)
// A pillar is only affected by pillars above it, so we can go row by row from the top: the total
// a pillar needs is (target - initial) mod m, so its manual turn is that minus what arrives from
// above, mod m. One pass, O(n). Of the equivalent turns we print the shortest (e.g. -1, not +3).
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0)

const mod = (a: number, m: number) => ((a % m) + m) % m
const shortest = (a: number, m: number) => {
  const r = mod(a, m)
  return r > m / 2 ? r - m : r
}

const out: string[] = []
for (let at = 0; at + 2 < lines.length; at += 3) {
  const m = Number(lines[at])
  const initial = lines[at + 1]!.split(/\s+/).map(Number)
  const target = lines[at + 2]!.split(/\s+/).map(Number)
  const manual: number[] = []
  let above: number[] = [] // totals of the previous row
  for (let row = 0, start = 0; start < initial.length; row++, start += row) {
    const totals: number[] = []
    for (let j = 0; j <= row; j++) {
      const fromAbove = (above[j - 1] ?? 0) + (above[j] ?? 0)
      const need = mod(target[start + j]! - initial[start + j]!, m)
      const turn = shortest(need - fromAbove, m)
      manual.push(turn)
      totals.push(turn + fromAbove)
    }
    above = totals
  }
  out.push(`[${manual.join(', ')}]`)
}
console.log(out.join('\n'))
