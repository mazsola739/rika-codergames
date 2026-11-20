// CoderGames 2025, task 2: corridors only ever appear; after each "?" report how many connected
// components contain a cycle. A union-find (disjoint set union) handles "edges only get added"
// perfectly. Each set also remembers whether it already has a cycle:
// - an edge inside one set closes a cycle: if that set had none, one more cursed component;
// - an edge between two sets merges them: if both were cursed, two cursed components become one.
// With path compression and union by size every event is practically O(1).
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8').split(/\r?\n/)
const [n] = lines[0]!.trim().split(/\s+/).map(Number) as [number]

const parent = Int32Array.from({ length: n + 1 }, (_, i) => i)
const size = new Int32Array(n + 1).fill(1)
const cyclic = new Uint8Array(n + 1)
const find = (x: number): number => {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]!]!
    x = parent[x]!
  }
  return x
}

let cursed = 0
const out: number[] = []
for (const raw of lines.slice(1)) {
  const line = raw.trim()
  if (line === '?') {
    out.push(cursed)
    continue
  }
  const [op, a, b] = line.split(/\s+/)
  if (op !== '+' || a === undefined || b === undefined) continue // blank or broken line
  const u = Number(a)
  const v = Number(b)
  if (u === v) continue // self-loops are ignored, as the task allows
  let ru = find(u)
  let rv = find(v)
  if (ru === rv) {
    if (!cyclic[ru]) {
      cyclic[ru] = 1
      cursed++
    }
    continue
  }
  if (size[ru]! < size[rv]!) [ru, rv] = [rv, ru]
  parent[rv] = ru
  size[ru]! += size[rv]!
  if (cyclic[ru] && cyclic[rv]) cursed--
  cyclic[ru] = cyclic[ru] || cyclic[rv] ? 1 : 0
}
console.log(out.join('\n'))
