import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Open the door'
export const caption =
  'Each pillar shows its face (number and colour); the small number below is the face on the door sketch. Step through the manual turns from the top: each one cascades down both sides, and a pillar is done (✓) once nothing above it will move again.'

export function data(dir: string) {
  const lines = inputText(dir)!.split('\n').map((l) => l.trim()).filter(Boolean)
  const cases: { m: number; initial: number[]; target: number[] }[] = []
  for (let at = 0; at + 2 < lines.length; at += 3)
    cases.push({ m: Number(lines[at]), initial: lines[at + 1]!.split(/\s+/).map(Number), target: lines[at + 2]!.split(/\s+/).map(Number) })
  const pick = [0, 1, 7, 13, 16].filter((i) => i < cases.length)
  return [{ m: 4, initial: [2, 1, 1, 3, 3, 2], target: [1, 2, 1, 3, 1, 0], name: 'Example' }, ...pick.map((i) => ({ ...cases[i]!, name: `Case ${i + 1}` }))]
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Nyisd ki az ajtót',
  caption:
    'Minden oszlop mutatja a lapját (számmal és színnel); az alatta lévő kis szám az ajtórajzon látható lap. Lépkedj végig a kézi forgatásokon felülről lefelé: mindegyik végiggyűrűzik mindkét oldalon, és egy oszlop akkor kész (✓), ha fölötte már semmi sem mozdul.',
}
