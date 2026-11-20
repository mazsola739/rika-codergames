// Build-time data: the two official cases (the page can also make random ones).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const title = 'Play with the camera grid'
export const caption =
  'Use the arrow buttons (or the arrow keys on the grid) to shift every image, wrapping around the edges. The dashed box is the compactness. The bars on the sides show which rows and columns are occupied; the largest gap is where the circle should be cut.'

export function data(dir: string) {
  const nums = readFileSync(join(dir, 'input.txt'), 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => l.split(/[;\s]+/).map(Number))
  const cases: { name: string; h: number; w: number; cells: number[][] }[] = []
  for (let at = 0; at < nums.length; ) {
    const [h, w, k] = nums[at++] as [number, number, number]
    cases.push({ name: `Case ${cases.length + 1}`, h, w, cells: nums.slice(at, at + k).map(([r, c]) => [r! - 1, c! - 1]) })
    at += k
  }
  return cases
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Játssz a kamerarácson',
  caption:
    'A nyílgombokkal (vagy a rácson a nyílbillentyűkkel) minden képet eltolhatsz, a széleken körbeérve. A szaggatott keret a tömörség. Az oldalsó sávok mutatják, mely sorok és oszlopok foglaltak; a legnagyobb résnél kell felvágni a kört.',
}
