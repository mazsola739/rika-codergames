// CoderGames 2023, task 4: visit as many trail points as possible, each at most once.
// That is the longest simple path in an undirected graph, which is NP-hard in general: no known
// algorithm is fast on every graph. But this one (100 points, 361 trails) has a path through
// every point, and a depth-first search with a good move order finds one almost instantly:
// - Warnsdorff's rule: go next to the neighbour with the fewest unvisited neighbours, so the
//   hard-to-reach points get used before they are cut off;
// - start from the points with the lowest degree, which must be near an end of the path;
// - backtrack when stuck, remembering the longest path seen, within a time budget.
import { readFileSync } from 'node:fs'

const input = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
const adj = new Map<number, Set<number>>()
for (const [, a, b] of input.matchAll(/\{\s*(\d+)\s*,\s*(\d+)\s*[}\)]/g)) {
  const u = Number(a)
  const v = Number(b)
  if (u === v) continue
  if (!adj.has(u)) adj.set(u, new Set())
  if (!adj.has(v)) adj.set(v, new Set())
  adj.get(u)!.add(v)
  adj.get(v)!.add(u)
}
const nodes = [...adj.keys()]
const deadline = Date.now() + 10_000

let best: number[] = []
const visited = new Set<number>()
const path: number[] = []

function freeDegree(v: number): number {
  let d = 0
  for (const u of adj.get(v)!) if (!visited.has(u)) d++
  return d
}

function search(v: number): boolean {
  visited.add(v)
  path.push(v)
  if (path.length > best.length) best = [...path]
  if (best.length === nodes.length) return true // visits every point: can't do better
  const next = [...adj.get(v)!].filter((u) => !visited.has(u)).sort((a, b) => freeDegree(a) - freeDegree(b) || a - b)
  for (const u of next) {
    if (Date.now() > deadline) break
    if (search(u)) return true
  }
  visited.delete(v)
  path.pop()
  return false
}

for (const start of [...nodes].sort((a, b) => adj.get(a)!.size - adj.get(b)!.size || a - b)) {
  if (search(start) || Date.now() > deadline) break
}

console.log(`Number of visited nodes: ${best.length}`)
console.log(`Path: ${best.slice(1).map((v, i) => `(${best[i]}, ${v})`).join(', ')}`)
