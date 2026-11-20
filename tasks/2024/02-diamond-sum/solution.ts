// CoderGames 2024, task 2: "diamond sum" of an N x N grid filled with 1..N^2 row by row: add the
// numbers on the diamond through the midpoints of the four sides. N can be up to 10^18, so we
// need a formula, not a loop.
//
// With m = (N-1)/2 (the middle index), row r holds r*N + c + 1 in column c. The top and bottom
// rows touch the diamond once, in the middle column; every other row twice, at columns
// m - d and m + d, which add up to 2m. Summing that over all rows simplifies to
//
//     diamond(N) = (N - 1) * (N^2 + 1)          (N = 5: 4 * 26 = 104)
//
// computed with BigInt, modulo 987654321.
import { readFileSync } from 'node:fs'

const MOD = 987654321n
const out: string[] = []
for (const line of readFileSync(process.argv[2] ?? 'input.txt', 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue
  const N = BigInt(line.trim())
  if (N % 2n === 0n || N < 3n) {
    out.push(`${N} is not an odd size >= 3, so there is no diamond`)
    continue
  }
  out.push(String(((N - 1n) % MOD) * ((N * N + 1n) % MOD) % MOD))
}
console.log(out.join('\n'))
