// CoderGames 2025, task 1: two chocolates whose weights add up to the target (two-sum).
// "First" means: the pair whose second chocolate comes earliest. So walk left to right and, for
// each chocolate, ask whether its partner (target - weight) was already seen. A map from weight
// to the first index it appeared at answers that in O(1), so the whole scan is O(n).
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0)

function firstPair(weights: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>()
  for (let j = 0; j < weights.length; j++) {
    const i = seen.get(target - weights[j]!)
    if (i !== undefined) return [i, j]
    if (!seen.has(weights[j]!)) seen.set(weights[j]!, j)
  }
  return null
}

const out: string[] = []
for (let at = 0; at + 1 < lines.length; at += 2) {
  const weights: number[] = JSON.parse(lines[at]!)
  const pair = firstPair(weights, Number(lines[at + 1]))
  out.push(pair ? `[${pair[0]}, ${pair[1]}]` : 'null')
}
console.log(out.join('\n'))
