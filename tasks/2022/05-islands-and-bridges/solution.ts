// CoderGames 2022, task 5: connect all islands with straight bridges of 1-3 water cells, using as
// little material as possible. Islands are the graph's nodes, every possible bridge is an edge
// weighted by its length, and the cheapest way to connect everything is a minimum spanning tree
// (Kruskal's algorithm with a union-find). Bridges may cross, so they never block each other.
import { readFileSync } from 'node:fs'

const MAX_BRIDGE = 3
const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0)

let at = 0
const cases = Number(lines[at++])
const out: number[] = []

for (let t = 0; t < cases; t++) {
  // "N M", then N rows of 0/1 (written with or without spaces).
  const [h, w] = lines[at++]!.split(/\s+/).map(Number) as [number, number]
  const grid = lines.slice(at, at + h).map((row) => row.replace(/\s+/g, ''))
  at += h

  // Label islands with a flood fill.
  const island = new Int32Array(h * w).fill(-1)
  let islands = 0
  for (let start = 0; start < h * w; start++) {
    if (grid[Math.floor(start / w)]![start % w] !== '1' || island[start] !== -1) continue
    const stack = [start]
    island[start] = islands
    while (stack.length) {
      const cell = stack.pop()!
      const r = Math.floor(cell / w)
      const c = cell % w
      for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]] as const) {
        if (nr < 0 || nr >= h || nc < 0 || nc >= w || grid[nr]![nc] !== '1') continue
        if (island[nr * w + nc] === -1) {
          island[nr * w + nc] = islands
          stack.push(nr * w + nc)
        }
      }
    }
    islands++
  }

  // Every possible bridge: from a land cell, go right or down over 1-3 water cells to other land.
  const bridges: [length: number, a: number, b: number][] = []
  for (let r = 0; r < h; r++)
    for (let c = 0; c < w; c++) {
      const from = island[r * w + c]!
      if (from === -1) continue
      for (const [dr, dc] of [[0, 1], [1, 0]] as const) {
        for (let len = 1; len <= MAX_BRIDGE + 1; len++) {
          const nr = r + dr * len
          const nc = c + dc * len
          if (nr >= h || nc >= w) break
          const to = island[nr * w + nc]!
          if (to === -1) continue // still water
          if (len > 1 && to !== from) bridges.push([len - 1, from, to])
          break // reached land: either a bridge or our own coast
        }
      }
    }

  // Kruskal: take the shortest bridges first, skip any that join already connected islands.
  const parent = Array.from({ length: islands }, (_, i) => i)
  const root = (x: number): number => (parent[x] === x ? x : (parent[x] = root(parent[x]!)))
  bridges.sort((a, b) => a[0] - b[0])
  let material = 0
  let joined = 0
  for (const [len, a, b] of bridges) {
    const ra = root(a)
    const rb = root(b)
    if (ra === rb) continue
    parent[ra] = rb
    material += len
    joined++
  }
  // Like the official solution, an empty map (no islands at all) counts as "cannot connect".
  out.push(islands > 0 && joined === islands - 1 ? material : -1)
}
console.log(out.join('\n'))

