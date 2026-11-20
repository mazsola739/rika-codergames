import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'The safest way home'
export const caption =
  'Each cell shows its danger. Switch to “Best so far” to see the DP table: the cheapest total from the top-left corner to that cell. The pink path is read back from the bottom-right corner.'

export const data = (dir: string) =>
  inputText(dir)!
    .split('\n')
    .map((l) => l.trim().replace(/,\s*\]$/, ']'))
    .filter((l) => l.startsWith('['))
    .map((l) => JSON.parse(l) as number[][])

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'A legbiztonságosabb út haza',
  caption:
    'Minden cella a veszélyességét mutatja. Kapcsolj a „Legjobb eddig” nézetre, hogy lásd a DP-táblázatot: a bal felső saroktól az adott celláig vezető legolcsóbb összeget. A rózsaszín út a jobb alsó sarokból visszafelé olvasható ki.',
}
