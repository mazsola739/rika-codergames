// The cipher text and the word list from solution.ts, so the page can run the same search live.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const title = 'Crack it live'
export const caption =
  'Press “Crack it”: your browser runs the same frequency + hill-climbing search as solution.ts and replays every improvement. Letters that changed in a step are highlighted.'

export function data(dir: string) {
  const source = readFileSync(join(dir, 'solution.ts'), 'utf8')
  const words = source.match(/new Set\(\s*`([^`]*)`/)![1]!.split(/\s+/).filter(Boolean)
  return { cipher: readFileSync(join(dir, 'input.txt'), 'utf8').trim(), words }
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Törd fel élőben',
  caption:
    'Nyomd meg a „Feltörés” gombot: a böngésződ ugyanazt a gyakoriságelemzést és hegymászó keresést futtatja, mint a solution.ts, és visszajátssza az összes javulást. A lépésenként megváltozott betűk ki vannak emelve.',
}
