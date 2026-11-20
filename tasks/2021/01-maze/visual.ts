import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Breadth-first search, ring by ring'
export const caption =
  'BFS spreads from S one step at a time; the colour shows how many steps away a cell is. When the wave reaches E, the path is traced back.'

export const data = (dir: string) => inputText(dir)!.split('\n').filter((l) => l.length > 0)

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Szélességi keresés, gyűrűről gyűrűre',
  caption:
    'A BFS S-ből indulva egyszerre egy lépéssel terjed; a szín azt mutatja, hány lépésre van egy cella. Amikor a hullám eléri E-t, visszafelé kirajzolódik az út.',
}
