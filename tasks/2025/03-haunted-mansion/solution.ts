// CoderGames 2025, task 3: the haunted mansion (20,000 rooms, one-way passages, no cycles).
// 1. The main entrance has no passage leading into it: a room with in-degree 0.
// 2. The botched spell: every room with passages to at least two of the vanished rooms vanishes
//    too, but only this once, with no chain reaction. ("Connected to" means the room's own
//    passages: counting passages in both directions gives 32 extra rooms, the official answer 9.)
// 3. Count the rooms reachable from the entrance without entering a vanished room (a BFS).
// This mansion has four rooms without an incoming passage, so it is ambiguous which one is the
// main entrance. The official answer lists the result for each of them, and so do we.
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0)
const n = Number(lines[0])
const m = Number(lines[1])

const out = new Map<number, number[]>()
const inDegree = new Int32Array(n + 1)
for (const line of lines.slice(2, 2 + n)) {
  const [room, ...to] = line.split(',').map(Number) as [number, ...number[]]
  out.set(room, to)
  for (const t of to) inDegree[t]!++
}
const firstRound = new Set(lines.slice(2 + n, 2 + n + m).map(Number))

const extra = new Set<number>()
for (const [room, to] of out) {
  if (firstRound.has(room)) continue
  if (new Set(to.filter((t) => firstRound.has(t))).size >= 2) extra.add(room)
}
const gone = (room: number) => firstRound.has(room) || extra.has(room)

function reachable(entrance: number): number {
  if (gone(entrance)) return 0
  const seen = new Set([entrance])
  const queue = [entrance]
  for (let head = 0; head < queue.length; head++) {
    for (const next of out.get(queue[head]!) ?? []) {
      if (seen.has(next) || gone(next)) continue
      seen.add(next)
      queue.push(next)
    }
  }
  return seen.size
}

const entrances: number[] = []
for (let room = 1; room <= n; room++) if (inDegree[room] === 0) entrances.push(room)

const results = entrances.map((e, i) => `Result${i + 1}:\n${e}\n${extra.size}\n${reachable(e)}`)
console.log(entrances.length === 1 ? results[0]!.split('\n').slice(1).join('\n') : results.join('\n\n'))
