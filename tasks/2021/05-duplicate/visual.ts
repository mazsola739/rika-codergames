import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Find the extra number'
export const caption = 'The array holds 0 … N−2 plus one number twice. Its sum is exactly that number larger than 0 + 1 + … + (N−2).'

export const data = (dir: string) =>
  inputText(dir)!
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => ({ n: Number(l.split(';')[0]), values: l.split(';')[1]!.split(',').map(Number) }))
