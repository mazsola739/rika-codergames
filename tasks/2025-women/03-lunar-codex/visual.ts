import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Which shift fits each line'
export const caption =
  'One row per line of the poem, one column per Caesar shift; darker means more English-looking. The circles are each line’s own favourite, the pink path is the choice made for all lines together, paying a penalty for every change of key.'

export const data = (dir: string) =>
  inputText(dir)!
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() && !/^-+.*MESSAGE.*-+$/.test(l.trim()))

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Melyik eltolás illik az egyes sorokhoz',
  caption:
    'Soronként a költemény egy-egy sora, oszloponként egy-egy Caesar-eltolás; a sötétebb angolosabbat jelent. A körök az egyes sorok saját kedvencei, a rózsaszín út az összes sorra együtt meghozott döntés, ami minden kulcsváltásért büntetést fizet.',
}
