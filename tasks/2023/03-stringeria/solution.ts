// CoderGames 2023, task 3: longest common subsequence (LCS) of two strings of ~1000 letters.
// Classic dynamic programming: L[i][j] = LCS length of the first i letters of s1 and the first j
// of s2. If s1[i-1] == s2[j-1] that letter extends L[i-1][j-1], otherwise take the better of
// L[i-1][j] and L[i][j-1]. Then walk back from the corner to read one LCS.
import { readFileSync } from 'node:fs'

const input = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
const [s1, s2] = [...input.matchAll(/s\d\s*=\s*"([^"]*)"/g)].map((m) => m[1]!) as [string, string]

const n = s1.length
const m = s2.length
const W = m + 1
const L = new Uint16Array((n + 1) * W)
for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++)
    L[i * W + j] = s1[i - 1] === s2[j - 1] ? L[(i - 1) * W + j - 1]! + 1 : Math.max(L[(i - 1) * W + j]!, L[i * W + j - 1]!)

const out: string[] = []
for (let i = n, j = m; i > 0 && j > 0; ) {
  if (s1[i - 1] === s2[j - 1]) {
    out.push(s1[i - 1]!)
    i--
    j--
  } else if (L[(i - 1) * W + j]! >= L[i * W + j - 1]!) i--
  else j--
}

const lcs = out.reverse().join('')
console.log(`Longest Common Subsequence: ${lcs}`)
console.log(`Length: ${lcs.length}`)
