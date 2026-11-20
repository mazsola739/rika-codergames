// CoderGames for Women 2025, task 1: are the two words on each line anagrams of each other?
// Two words are anagrams when every letter occurs equally often in both. Count the letters of
// the first word up and of the second word down; anagrams leave all 26 counters at zero.
// O(length) per line, no sorting.
import { readFileSync } from 'node:fs'

function isAnagram(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  const counts = new Int32Array(26)
  for (let i = 0; i < a.length; i++) {
    counts[a.charCodeAt(i) - 97]!++
    counts[b.charCodeAt(i) - 97]!--
  }
  return counts.every((c) => c === 0)
}

const out: string[] = []
for (const line of readFileSync(process.argv[2] ?? 'input.txt', 'utf8').split(/\r?\n/)) {
  const words = line.trim().split(/\s+/).filter((w) => w.length > 0)
  if (words.length === 0) continue
  out.push(isAnagram(words[0]!, words[1] ?? '') ? 'YES' : 'NO')
}
console.log(out.join('\n'))
