import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'The ride on a timeline'
export const caption =
  'Pick a set. The map shows the stations and the fastest route; the timeline shows each road on the route with its closures (hatched), your riding time (pink) and any waiting (grey).'

export function data(dir: string) {
  const sets: { name: string; lines: string[] }[] = []
  for (const raw of inputText(dir)!.split('\n')) {
    const line = raw.trim()
    if (line.startsWith('#')) sets.push({ name: line.replace(/^#\s*/, ''), lines: [] })
    else if (line) sets.at(-1)?.lines.push(line)
  }
  return sets
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Az út egy idővonalon',
  caption:
    'Válassz egy készletet. A térkép az állomásokat és a leggyorsabb útvonalat mutatja; az idővonalon az útvonal minden útja látszik a lezárásaival (sraffozva), a menetidőddel (rózsaszín) és az esetleges várakozással (szürke).',
}
