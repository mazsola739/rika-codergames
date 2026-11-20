import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Distances to the target'
export const caption =
  'Every vertex is placed in the column of its distance to the target (right). One BFS over the reversed edges fills all columns at once; unreachable vertices are on the left, marked INF.'

export function data(dir: string) {
  const lines = inputText(dir)!.split('\n').map((l) => l.trim()).filter((l) => l.length > 0)
  const cases: { target: string; edges: [string, string][] }[] = []
  for (let i = 0; i + 1 < lines.length; i += 2)
    cases.push({ target: lines[i]!, edges: lines[i + 1]!.split(';').filter(Boolean).map((e) => e.split(',').map((v) => v.trim()) as [string, string]) })
  return cases
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Távolságok a célig',
  caption:
    'Minden csúcs abban az oszlopban áll, ahány lépésre van a céltól (jobbra). Egyetlen BFS a megfordított éleken egyszerre tölti ki az összes oszlopot; az elérhetetlen csúcsok bal oldalon vannak, INF jelzéssel.',
}
