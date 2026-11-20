import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Which shift fits each line'
export const caption =
  'One row per line of the poem, one column per Caesar shift; darker means more English-looking. The circles are each line’s own favourite, the pink path is the choice made for all lines together, paying a penalty for every change of key.'

export const data = (dir: string) =>
  inputText(dir)!
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() && !/^-+.*MESSAGE.*-+$/.test(l.trim()))
