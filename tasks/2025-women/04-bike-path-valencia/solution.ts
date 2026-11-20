// CoderGames for Women 2025, task 4: the fastest bike route across Valencia during Las Fallas,
// when some roads are closed at certain times and you may wait for them to reopen.
//
// Dijkstra's algorithm on arrival times instead of distances. It still works because waiting is
// allowed: arriving earlier at a station never makes you arrive later anywhere else (the
// "first in, first out" property). A road only has to be open when you set off on it: if you
// reach it during a closure, you wait until the closure ends. (Requiring the whole ride to avoid
// closures gives 105 instead of the official 90 in set 3.)
import { readFileSync } from 'node:fs'

interface Road {
  to: number
  minutes: number
  closed: [number, number][] // [start, end) intervals
}

// Earliest time >= t at which the road is open (closures are [start, end) and may touch).
function departure(t: number, road: Road): number {
  let d = t
  for (let moved = true; moved; ) {
    moved = false
    for (const [s, e] of road.closed) {
      if (s <= d && d < e) {
        d = e
        moved = true
      }
    }
  }
  return d
}

function earliestArrival(n: number, roads: Road[][], start: number): number {
  const best = new Array(n + 1).fill(Infinity)
  best[1] = start
  const done = new Array(n + 1).fill(false)
  for (;;) {
    let u = -1
    for (let v = 1; v <= n; v++) if (!done[v] && best[v] < Infinity && (u < 0 || best[v] < best[u])) u = v
    if (u < 0) break
    if (u === n) return best[n]
    done[u] = true
    for (const road of roads[u]!) {
      const arrive = departure(best[u], road) + road.minutes
      if (arrive < best[road.to]) best[road.to] = arrive
    }
  }
  return -1
}

// Sets start with "# Set ..." lines; each set is "N M T" followed by M road lines.
const sets: string[][] = []
for (const raw of readFileSync(process.argv[2] ?? 'input.txt', 'utf8').split(/\r?\n/)) {
  const line = raw.trim()
  if (line.startsWith('#')) sets.push([])
  else if (line) {
    if (sets.length === 0) sets.push([])
    sets.at(-1)!.push(line)
  }
}

const out: string[] = []
sets.forEach((lines, i) => {
  const [n, m, t] = lines[0]!.split(/\s+/).map(Number) as [number, number, number]
  const roads: Road[][] = Array.from({ length: n + 1 }, () => [])
  for (const line of lines.slice(1, 1 + m)) {
    const [u, v, minutes, k, ...rest] = line.split(/\s+/).map(Number) as number[]
    const closed: [number, number][] = []
    for (let j = 0; j < k!; j++) closed.push([rest[2 * j]!, rest[2 * j + 1]!])
    roads[u!]!.push({ to: v!, minutes: minutes!, closed })
    roads[v!]!.push({ to: u!, minutes: minutes!, closed })
  }
  out.push(`# Set ${i + 1} Output`, String(earliestArrival(n, roads, t)))
})
console.log(out.join('\n'))
