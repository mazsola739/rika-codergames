import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Breaking the Vigenère cipher'
export const caption =
  'Left: the index of coincidence for every guessed key length; English text gives about 0.066, random letters 0.038, and length 10 is the first to look English. Then each of the 10 columns is a Caesar cipher: pick a column to see its letter counts against English.'

export const data = (dir: string) => inputText(dir)!.toUpperCase().replace(/[^A-Z]/g, '')

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'A Vigenère-titkosítás feltörése',
  caption:
    'Balra: a koincidenciaindex minden kulcshossz-tippre; angol szövegnél kb. 0,066, véletlen betűknél 0,038, és a 10-es hossz az első, ami angolnak tűnik. Ezután a 10 oszlop mindegyike egy-egy Caesar-titkosítás: válassz egy oszlopot, és nézd meg a betűgyakoriságait az angolhoz képest.',
}
