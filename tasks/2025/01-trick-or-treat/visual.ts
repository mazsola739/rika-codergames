import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'One pass with a memory'
export const caption =
  'Walk through the bucket once. For each chocolate, look up its partner (target − weight) among the weights already seen; the first hit is the pair whose second chocolate comes earliest.'

export function data(dir: string) {
  const lines = inputText(dir)!.split('\n').map((l) => l.trim()).filter(Boolean)
  const cases: { weights: number[]; target: number }[] = []
  for (let i = 0; i + 1 < lines.length; i += 2) cases.push({ weights: JSON.parse(lines[i]!), target: Number(lines[i + 1]) })
  return cases
}
