// CoderGames 2021, task 3: shortest distance from every vertex to one target in an unweighted,
// directed graph. One breadth-first search from the target over the reversed edges gives all
// distances at once.
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0)

// The cases are pairs of lines: target vertex, then "a,b;c,d;..." edges.
// (The task mentions a count on the first line; the file has none, so we just read pairs.)
const out: string[] = []
for (let i = 0; i + 1 < lines.length; i += 2) {
  const target = lines[i]!
  const reversed = new Map<string, string[]>()
  const vertices = new Set<string>([target])
  for (const edge of lines[i + 1]!.split(';')) {
    if (!edge.trim()) continue
    const [a, b] = edge.split(',').map((v) => v.trim()) as [string, string]
    vertices.add(a).add(b)
    if (!reversed.has(b)) reversed.set(b, [])
    reversed.get(b)!.push(a)
  }

  const dist = new Map<string, number>([[target, 0]])
  const queue = [target]
  for (let head = 0; head < queue.length; head++) {
    const v = queue[head]!
    for (const u of reversed.get(v) ?? []) {
      if (dist.has(u)) continue
      dist.set(u, dist.get(v)! + 1)
      queue.push(u)
    }
  }

  out.push(target)
  // Plain character order, as in the expected output ("10" < "100" < "11" < "a").
  for (const v of [...vertices].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) {
    if (v !== target) out.push(`${v} ${dist.get(v) ?? 'INF'}`)
  }
}
console.log(out.join('\n'))
