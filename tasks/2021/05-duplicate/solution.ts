// CoderGames 2021, task 5: an array of size N holds 0..N-2 with exactly one value twice.
// The numbers 0..N-2 add up to (N-2)(N-1)/2, so the duplicate is whatever the real sum has extra.
// One pass, no extra memory.
import { readFileSync } from 'node:fs'

const out: string[] = []
for (const line of readFileSync(process.argv[2] ?? 'input.txt', 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue
  const [size, list] = line.split(';') as [string, string]
  const n = Number(size)
  const sum = list.split(',').reduce((s, v) => s + Number(v), 0)
  out.push(String(sum - ((n - 2) * (n - 1)) / 2))
}
console.log(out.join('\n'))
