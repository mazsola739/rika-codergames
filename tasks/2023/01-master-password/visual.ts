import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'From coordinates to the password'
export const caption =
  'Each {row,col} pair picks a character from the 8 × 8 matrix. The words are then chained: the overlap with the previous word (ignoring case) is dropped, shown struck through.'

export const data = (dir: string) => inputText(dir)!
