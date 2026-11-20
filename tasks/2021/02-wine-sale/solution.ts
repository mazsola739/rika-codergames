// CoderGames 2021, task 2: sell one bottle a year, always from one end of the shelf; in year t a
// bottle with price c earns t * c. Interval dynamic programming: best[i][j] is the most we can
// earn from the bottles i..j that are still on the shelf, which also tells us the current year.
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8').trim().split(/\r?\n/)
const cases = Number(lines[0])

for (let k = 1; k <= cases; k++) {
  const c = lines[k]!.trim().split(/\s+/).map(Number)
  const n = c.length
  // best[i * n + j]: max earnings for bottles i..j, sold in years n - (j - i), ..., n.
  const best = new Float64Array(n * n)
  const takeLeft = new Uint8Array(n * n)
  for (let len = 1; len <= n; len++) {
    const year = n - len + 1
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1
      if (len === 1) {
        best[i * n + j] = year * c[i]!
        takeLeft[i * n + j] = 1
        continue
      }
      const left = year * c[i]! + best[(i + 1) * n + j]!
      const right = year * c[j]! + best[i * n + j - 1]!
      takeLeft[i * n + j] = left >= right ? 1 : 0
      best[i * n + j] = Math.max(left, right)
    }
  }
  // Replay the choices to print the selling order.
  const terms: string[] = []
  for (let i = 0, j = n - 1, year = 1; i <= j; year++) {
    if (takeLeft[i * n + j]) terms.push(`${year}*${c[i++]}`)
    else terms.push(`${year}*${c[j--]}`)
  }
  console.log(`${best[n - 1]}, ${terms.join(' + ')}`)
}
