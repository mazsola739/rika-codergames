import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Count the letters'
export const caption = 'For the chosen pair: letters of the first word count up, letters of the second count down. Anagrams leave every one of the 26 counters at zero.'

export const data = (dir: string) =>
  inputText(dir)!
    .split('\n')
    .map((l) => l.trim().split(/\s+/))
    .filter((w) => w[0])
