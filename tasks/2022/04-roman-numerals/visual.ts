import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Shorten a numeral'
export const caption =
  'Type any Roman numeral, or pick one from the input. It is read as a value (smaller before larger means subtract) and written back in the shortest form. The chart shows how many characters each of the 1000 lines saves.'

export const data = (dir: string) => inputText(dir)!.split('\n').map((l) => l.trim()).filter(Boolean)
