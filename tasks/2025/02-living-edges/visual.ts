import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Corridors appear one by one'
export const caption =
  'Replay the events. Houses that are connected share a colour; a component turns cursed (pink ring) the moment an edge closes a cycle. The counter is the answer to each “?”.'

export function data(dir: string) {
  const lines = inputText(dir)!.split('\n').map((l) => l.trim()).filter(Boolean)
  const [n] = lines[0]!.split(/\s+/).map(Number)
  const events = lines.slice(1).map((l) => (l === '?' ? '?' : l.split(/\s+/).slice(1).map(Number))).filter((e) => e === '?' || e.length === 2)
  return { n, events }
}
