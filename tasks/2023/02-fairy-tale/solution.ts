// CoderGames 2023, task 2: the fairies' language is "encrypted with a password", which points to
// a Vigenère cipher: letter i is shifted by the i-th letter of a repeating key. Break it in two
// steps without knowing the key:
//  1. Key length: split the text into k columns (every k-th letter). With the right k each column
//     is plain English shifted by one letter, so its index of coincidence (the chance that two
//     random letters are equal) is close to English's 0.066 instead of random text's 0.038.
//  2. Each column is then a Caesar cipher: try all 26 shifts and keep the one whose letter
//     counts look most like English (smallest chi-squared distance).
import { readFileSync } from 'node:fs'

const text = readFileSync(process.argv[2] ?? 'input.txt', 'utf8').toUpperCase().replace(/[^A-Z]/g, '')

// Letter frequencies of English text, A..Z, in percent.
const ENGLISH = [
  8.17, 1.49, 2.78, 4.25, 12.7, 2.23, 2.02, 6.09, 6.97, 0.15, 0.77, 4.03, 2.41, 6.75, 7.51, 1.93, 0.1, 5.99, 6.33,
  9.06, 2.76, 0.98, 2.36, 0.15, 1.97, 0.07,
]
const codes = [...text].map((ch) => ch.charCodeAt(0) - 65)
const column = (k: number, j: number) => codes.filter((_, i) => i % k === j)

function coincidence(letters: number[]): number {
  const counts = Array(26).fill(0)
  for (const c of letters) counts[c]++
  const n = letters.length
  return counts.reduce((s, x) => s + x * (x - 1), 0) / (n * (n - 1))
}

// The shortest length whose columns look like English (multiples of it would look English too).
let keyLength = 1
for (let k = 1; k <= 20; k++) {
  const avg = [...Array(k).keys()].reduce((s, j) => s + coincidence(column(k, j)), 0) / k
  if (avg > 0.06) {
    keyLength = k
    break
  }
}

function bestShift(letters: number[]): number {
  let best = 0
  let bestScore = Infinity
  for (let shift = 0; shift < 26; shift++) {
    const counts = Array(26).fill(0)
    for (const c of letters) counts[(c - shift + 26) % 26]++
    const score = counts.reduce((s, x, i) => {
      const expected = (ENGLISH[i]! / 100) * letters.length
      return s + (x - expected) ** 2 / expected
    }, 0)
    if (score < bestScore) [best, bestScore] = [shift, score]
  }
  return best
}

const key = [...Array(keyLength).keys()].map((j) => bestShift(column(keyLength, j)))
const plain = codes.map((c, i) => String.fromCharCode(65 + ((c - key[i % keyLength]! + 26) % 26))).join('')

console.log(plain)
console.log(`Key: ${key.map((s) => String.fromCharCode(65 + s)).join('')}`)
