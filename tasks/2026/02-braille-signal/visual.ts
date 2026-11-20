// Build-time data for the visualisation: every record that sets a dot, in file order, so the page
// can replay how the picture appears out of the shuffled log. Noise records are flagged.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const title = 'Watch the picture appear'
export const caption =
  'The log is replayed in file order. Each record drops one dot into its cell; decoys (NOISE) flash and are thrown away. At the end, the three bottom rows are read as Braille text.'

const COLS = 110
const ROWS = 46
const dots = (...d: number[]) => d.reduce((m, x) => m | (1 << (x - 1)), 0)
const LETTERS = new Map<number, string>([
  ...'abcdefghijklmnopqrstuvwxyz'.split('').map((ch, i) => [
    [dots(1), dots(1, 2), dots(1, 4), dots(1, 4, 5), dots(1, 5), dots(1, 2, 4), dots(1, 2, 4, 5), dots(1, 2, 5), dots(2, 4), dots(2, 4, 5),
      dots(1, 3), dots(1, 2, 3), dots(1, 3, 4), dots(1, 3, 4, 5), dots(1, 3, 5), dots(1, 2, 3, 4), dots(1, 2, 3, 4, 5), dots(1, 2, 3, 5),
      dots(2, 3, 4), dots(2, 3, 4, 5), dots(1, 3, 6), dots(1, 2, 3, 6), dots(2, 4, 5, 6), dots(1, 3, 4, 6), dots(1, 3, 4, 5, 6), dots(1, 3, 5, 6)][i]!,
    ch,
  ] as [number, string]),
  [dots(3, 4), '/'],
  [dots(2, 3, 4, 6), '&'],
  [0, ' '],
])

export function data(dir: string) {
  const lines = readFileSync(join(dir, 'input.txt'), 'utf8').split(/\r?\n/).slice(1)
  const positions: number[] = []
  const noise: number[] = []
  const cells = new Uint8Array(ROWS * COLS)
  for (const line of lines) {
    const [, row, col, dot, value, status] = line.trim().split(';')
    if (value !== '1') continue
    const cell = Number(row) * COLS + Number(col)
    if (status === 'VALID') cells[cell]! |= 1 << Number(dot)
    noise.push(status === 'VALID' ? 0 : 1)
    positions.push(cell * 8 + Number(dot))
  }
  const pos = Buffer.from(new Uint16Array(positions).buffer).toString('base64')
  const bits = new Uint8Array(Math.ceil(noise.length / 8))
  noise.forEach((b, i) => b && (bits[i >> 3]! |= 1 << (i & 7)))
  const text = [43, 44, 45].map((r) => ({
    braille: String.fromCodePoint(...[...cells.subarray(r * COLS, (r + 1) * COLS)].map((b) => 0x2800 + b)).replace(/⠀+$/u, ''),
    letters: [...cells.subarray(r * COLS, (r + 1) * COLS)].map((b) => LETTERS.get(b) ?? '?').join('').trimEnd(),
  }))
  return { cols: COLS, rows: ROWS, count: positions.length, pos, noise: Buffer.from(bits).toString('base64'), text }
}
