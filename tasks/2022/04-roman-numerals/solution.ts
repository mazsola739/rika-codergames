// CoderGames 2022, task 4: rewrite every Roman numeral in its shortest valid form.
// Read the value (a symbol smaller than the next one is subtracted, as in IV or XC), then write it
// back the standard way: thousands as M's, then hundreds, tens and ones with the subtractive pairs.
import { readFileSync } from 'node:fs'

const VALUE: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

function parse(roman: string): number {
  let total = 0
  for (let i = 0; i < roman.length; i++) {
    const v = VALUE[roman[i]!]!
    const next = VALUE[roman[i + 1]!] ?? 0
    total += v < next ? -v : v
  }
  return total
}

const DIGITS = [
  ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
  ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
  ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
]

function write(n: number): string {
  // There is no symbol above M, so 4000 stays MMMM.
  let s = 'M'.repeat(Math.floor(n / 1000))
  for (let place = 2, p = 100; place >= 0; place--, p /= 10) s += DIGITS[place]![Math.floor(n / p) % 10]
  return s
}

const out: string[] = []
for (const line of readFileSync(process.argv[2] ?? 'input.txt', 'utf8').split(/\r?\n/)) {
  if (line.trim()) out.push(write(parse(line.trim())))
}
console.log(out.join('\n'))
