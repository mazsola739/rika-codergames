// CoderGames for Women 2025, task 3: the Lunar Codex. The message is a poem whose stanzas were
// each encrypted with a different Caesar shift, and the stanzas are not marked. So:
// 1. score every line under every shift: how English does it look (log-likelihood under English
//    letter frequencies)?
// 2. Picking the best shift line by line is fragile: "Mount Olympus, proud and tall" scores
//    better with a wrong shift. So choose the shifts for all lines together (Viterbi-style
//    dynamic programming), paying a penalty each time the shift changes from one line to the
//    next. The stanzas then come out whole, and each stanza's shift is a key.
// The keys are printed first, one per line, then the decrypted poem.
import { readFileSync } from 'node:fs'

const ENGLISH = [
  8.17, 1.49, 2.78, 4.25, 12.7, 2.23, 2.02, 6.09, 6.97, 0.15, 0.77, 4.03, 2.41, 6.75, 7.51, 1.93, 0.1, 5.99, 6.33,
  9.06, 2.76, 0.98, 2.36, 0.15, 1.97, 0.07,
].map((p) => Math.log(p / 100))

const shift = (text: string, k: number) =>
  text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97
    return String.fromCharCode(base + ((ch.charCodeAt(0) - base - k + 26) % 26))
  })

function lineScores(line: string): number[] {
  const letters = line.toLowerCase().replace(/[^a-z]/g, '')
  return Array.from({ length: 26 }, (_, k) => {
    let score = 0
    for (const ch of letters) score += ENGLISH[(ch.charCodeAt(0) - 97 - k + 26) % 26]!
    return score
  })
}

// Cost of switching to a new key between two lines, in the same units as the scores.
const CHANGE_PENALTY = 25

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trimEnd())
  .filter((l) => l.trim().length > 0 && !/^-+.*MESSAGE.*-+$/.test(l.trim()))

// best[i][k]: best total score for lines 0..i with line i using shift k; from[i][k]: shift of line i-1.
const scores = lines.map(lineScores)
const best: number[][] = [scores[0]!]
const from: number[][] = [scores[0]!.map(() => -1)]
for (let i = 1; i < lines.length; i++) {
  const prev = best[i - 1]!
  const top = prev.indexOf(Math.max(...prev))
  best.push(scores[i]!.map((s, k) => s + Math.max(prev[k]!, prev[top]! - CHANGE_PENALTY)))
  from.push(scores[i]!.map((_, k) => (prev[k]! >= prev[top]! - CHANGE_PENALTY ? k : top)))
}
const shifts: number[] = []
for (let i = lines.length - 1, k = best.at(-1)!.indexOf(Math.max(...best.at(-1)!)); i >= 0; k = from[i--]![k]!) {
  shifts.unshift(k)
}

const keys = shifts.filter((k, i) => k !== shifts[i - 1])
const plain = lines.map((line, i) => shift(line, shifts[i]!))

console.log(keys.join('\n'))
console.log()
console.log(plain.join('\n'))
