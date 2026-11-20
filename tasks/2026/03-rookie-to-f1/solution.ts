// CoderGames 2026, task 3: from rookie to Formula 1. Count the paths from node 1 to node N in a
// directed acyclic graph. Process the nodes in topological order (Kahn's algorithm) and push
// path counts forward: ways[1] = 1, and every edge a -> b adds ways[a] to ways[b]. Because the
// graph has no cycles, ways[a] is final before any of its edges are used. O(N + M).
// Counts can exceed 64 bits on bigger graphs, so they are BigInts.
import { readFileSync } from 'node:fs'

const nums = readFileSync(process.argv[2] ?? 'input.txt', 'utf8').trim().split(/\s+/).map(Number)
const [n, m] = nums as [number, number]
const out: number[][] = Array.from({ length: n + 1 }, () => [])
const inDegree = new Int32Array(n + 1)
for (let i = 0; i < m; i++) {
  const a = nums[2 + 2 * i]!
  const b = nums[3 + 2 * i]!
  out[a]!.push(b)
  inDegree[b]!++
}

const ways: bigint[] = new Array(n + 1).fill(0n)
ways[1] = 1n
const queue: number[] = []
for (let v = 1; v <= n; v++) if (inDegree[v] === 0) queue.push(v)
for (let head = 0; head < queue.length; head++) {
  const a = queue[head]!
  for (const b of out[a]!) {
    ways[b] = ways[b]! + ways[a]!
    if (--inDegree[b]! === 0) queue.push(b)
  }
}
console.log(ways[n]!.toString())
