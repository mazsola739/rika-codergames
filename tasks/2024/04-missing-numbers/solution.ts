// CoderGames 2024, task 4: the numbers missing between the smallest and largest value of an array.
// Mark every value that is present, then list the unmarked ones from min to max.
// O(n + (max - min)) time, no sorting needed.
import { readFileSync } from 'node:fs'

const values = readFileSync(process.argv[2] ?? 'input.txt', 'utf8').trim().split(/\s+/).map(Number)
const min = Math.min(...values)
const max = Math.max(...values)
const present = new Uint8Array(max - min + 1)
for (const v of values) present[v - min] = 1

const missing: number[] = []
for (let v = min; v <= max; v++) if (!present[v - min]) missing.push(v)
console.log(`${missing.length}: ${missing.join(', ')}`)
