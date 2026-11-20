// CoderGames 2026, task 2: the Braille signal. A shuffled telemetry log holds the dots of a
// 110 x 46 raster of 8-dot Braille cells. Rows 0-42 are a picture, rows 43-45 are metadata in
// plain (uncontracted) Braille: the location, who/what is depicted, and the artist.
//
// 1. Keep only VALID records and set bit `dot` of cell (row, column). The task numbers the dots
//    exactly like the bits of Unicode Braille (U+2800 + bits), so each cell is one character.
// 2. Read the metadata rows letter by letter with the standard Braille alphabet.
// 3. The country is not in the data: the location names a race track, and the track's country
//    is the answer.
// Run with --image to print the picture itself as Unicode Braille.
import { readFileSync } from 'node:fs'

const COLS = 110
const ROWS = 46
const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith('--')) ?? 'input.txt'
const lines = readFileSync(file, 'utf8').split(/\r?\n/)

const cells = new Uint8Array(ROWS * COLS)
for (const line of lines.slice(1)) {
  const [, row, col, dot, value, status] = line.trim().split(';')
  if (status !== 'VALID' || value !== '1') continue
  cells[Number(row) * COLS + Number(col)]! |= 1 << Number(dot)
}
const braille = (r: number) => String.fromCodePoint(...[...cells.subarray(r * COLS, (r + 1) * COLS)].map((b) => 0x2800 + b))

// Six-dot Braille letters, as Unicode bit masks (dot 1 = bit 0, ..., dot 6 = bit 5).
const dots = (...d: number[]) => d.reduce((m, x) => m | (1 << (x - 1)), 0)
const LETTERS = new Map<number, string>([
  [dots(1), 'a'], [dots(1, 2), 'b'], [dots(1, 4), 'c'], [dots(1, 4, 5), 'd'], [dots(1, 5), 'e'],
  [dots(1, 2, 4), 'f'], [dots(1, 2, 4, 5), 'g'], [dots(1, 2, 5), 'h'], [dots(2, 4), 'i'], [dots(2, 4, 5), 'j'],
  [dots(1, 3), 'k'], [dots(1, 2, 3), 'l'], [dots(1, 3, 4), 'm'], [dots(1, 3, 4, 5), 'n'], [dots(1, 3, 5), 'o'],
  [dots(1, 2, 3, 4), 'p'], [dots(1, 2, 3, 4, 5), 'q'], [dots(1, 2, 3, 5), 'r'], [dots(2, 3, 4), 's'],
  [dots(2, 3, 4, 5), 't'], [dots(1, 3, 6), 'u'], [dots(1, 2, 3, 6), 'v'], [dots(2, 4, 5, 6), 'w'],
  [dots(1, 3, 4, 6), 'x'], [dots(1, 3, 4, 5, 6), 'y'], [dots(1, 3, 5, 6), 'z'], [dots(3, 4), '/'], [0, ' '],
  // Dots 2-3-4-6 is not a plain letter. It stands between the two riders' names, where an "and"
  // belongs, so it is shown as '&'.
  [dots(2, 3, 4, 6), '&'],
])
const text = (r: number) =>
  [...cells.subarray(r * COLS, (r + 1) * COLS)]
    .map((b) => LETTERS.get(b) ?? `<${(0x2800 + b).toString(16)}>`)
    .join('')
    .trimEnd()

// Venues the clue can lead to, with their countries. This is the one step that needs knowledge
// from outside the input: the AVUS is the old race track in Berlin.
const VENUE_COUNTRY: Record<string, [venue: string, country: string]> = { avus: ['AVUS', 'Germany'] }

if (args.includes('--image')) {
  for (let r = 0; r < ROWS; r++) console.log(braille(r))
  process.exit(0)
}

const location = text(43)
const depicted = text(44)
const artist = text(45)
const venueKey = Object.keys(VENUE_COUNTRY).find((k) => location.includes(k))
const [venue, country] = venueKey ? VENUE_COUNTRY[venueKey]! : [location, '?']
// The artist row reads "skulptur von <name>" (German for "sculpture by <name>").
const name = artist.replace(/^.*\bvon\s+/, '')
const capitalise = (s: string) => s.replace(/(^|\s)(\p{L})/gu, (_, space: string, c: string) => space + c.toUpperCase())

console.error(`location: ${location}\ndepicted: ${depicted}\nartist:   ${artist}`)
console.log(JSON.stringify({ country, location: venue, artist: capitalise(name) }))
