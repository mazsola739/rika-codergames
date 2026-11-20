import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Sell the shelf year by year'
export const caption =
  'Each year one bottle leaves from an end of the shelf and earns year × price. Compare the optimal order (dynamic programming) with the tempting greedy rule "always sell the cheaper end".'

export function data(dir: string) {
  const lines = inputText(dir)!.trim().split('\n')
  return [
    { name: 'Example', prices: [10, 25, 27, 28, 1, 1, 8] },
    ...lines.slice(1, 4).map((l, i) => ({ name: `Shelf ${i + 1}`, prices: l.trim().split(/\s+/).map(Number) })),
  ]
}
