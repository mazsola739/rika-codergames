import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Keep the tallest bar'
export const caption = 'How often each value occurs in the chosen array. Keep the most frequent value and delete everything else.'

export function data(dir: string) {
  const lines = inputText(dir)!.split('\n').map((l) => l.trim()).filter(Boolean)
  const arrays: number[][] = []
  for (let i = 0; i + 1 < lines.length; i += 2) arrays.push(lines[i + 1]!.split(/\s+/).map(Number))
  return arrays
}
