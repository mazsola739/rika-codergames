// CoderGames 2022, task 1: fewest deletions that leave only one distinct value in an array.
// Keep the most frequent value and delete everything else: n - (highest count).
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0)

function cleanArray(numbers: number[]): number {
  const counts = new Map<number, number>()
  for (const x of numbers) counts.set(x, (counts.get(x) ?? 0) + 1)
  return numbers.length - Math.max(...counts.values())
}

// The file is pairs of lines: n, then n numbers.
const out: number[] = []
for (let i = 0; i + 1 < lines.length; i += 2) out.push(cleanArray(lines[i + 1]!.split(/\s+/).map(Number)))
console.log(out.join('\n'))
