// CoderGames 2023, task 1: Buggy's master password.
// 1. Each {row,col} pair picks a character from an 8x8 matrix: 0-9, a-z, A-Z, ',' and '.'.
// 2. That spells words separated by commas (or dots).
// 3. Join the words: where the end of one word matches the start of the next (ignoring case),
//    drop the matching part from the next word. Track what was dropped.
import { readFileSync } from 'node:fs'

const MATRIX = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.'
const input = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')

const decoded = [...input.matchAll(/\{\s*(\d+)\s*,\s*(\d+)\s*\}/g)]
  .map(([, r, c]) => MATRIX[Number(r) * 8 + Number(c)])
  .join('')
const words = decoded.split(/[,.]/).filter((w) => w.length > 0)

// Longest k such that the last k characters of `a` equal the first k of `b`, ignoring case.
function overlap(a: string, b: string): number {
  const A = a.toLowerCase()
  const B = b.toLowerCase()
  for (let k = Math.min(A.length, B.length); k > 0; k--) if (A.endsWith(B.slice(0, k))) return k
  return 0
}

let password = words[0] ?? ''
const removed: string[] = []
for (let i = 1; i < words.length; i++) {
  const k = overlap(words[i - 1]!, words[i]!)
  if (k) removed.push(words[i]!.slice(0, k))
  password += words[i]!.slice(k)
}

const longest = removed.reduce((best, s) => (s.length > best.length ? s : best), '')
console.log(`Password: "${password}"`)
console.log(`Removed characters: "${removed.join('')}"`)
console.log(`Number of removed characters: ${removed.join('').length}`)
console.log(`The longest removed string: "${longest}"`)
