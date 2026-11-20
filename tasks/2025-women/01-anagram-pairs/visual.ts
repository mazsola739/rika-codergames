import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Count the letters'
export const caption = 'For the chosen pair: letters of the first word count up, letters of the second count down. Anagrams leave every one of the 26 counters at zero.'

export const data = (dir: string) =>
  inputText(dir)!
    .split('\n')
    .map((l) => l.trim().split(/\s+/))
    .filter((w) => w[0])

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Számold meg a betűket',
  caption:
    'A kiválasztott párnál az első szó betűi felfelé, a másodikéi lefelé számolnak. Anagrammáknál mind a 26 számláló nullán marad.',
}
