import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'The universe and its centres'
export const caption =
  'The 200 × 200 torus; darker cells hold larger values. Green rings are stable gravitational centres, pink ones unstable. Click a ring (or pick one from the list) to see its 16 axis values and which pairs break the symmetry.'

export function data(dir: string) {
  const lines = inputText(dir)!.split('\n').map((l) => l.trim()).filter(Boolean)
  const [rows, cols] = lines[0]!.split(/\s+/).map(Number) as [number, number]
  const flat = lines.slice(1, 1 + rows).flatMap((l) => l.split(/\s+/).map(Number))
  return { rows, cols, values: Buffer.from(Uint8Array.from(flat)).toString('base64') }
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Az univerzum és a középpontjai',
  caption:
    'A 200 × 200-as tórusz; a sötétebb cellákban nagyobb érték áll. A zöld gyűrűk stabil gravitációs középpontok, a rózsaszínek instabilak. Kattints egy gyűrűre (vagy válassz egyet a listából), hogy lásd a 16 tengelyértékét, és hogy mely párok törik meg a szimmetriát.',
}
