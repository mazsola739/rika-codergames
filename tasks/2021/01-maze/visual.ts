import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Breadth-first search, ring by ring'
export const caption =
  'BFS spreads from S one step at a time; the colour shows how many steps away a cell is. When the wave reaches E, the path is traced back.'

export const data = (dir: string) => inputText(dir)!.split('\n').filter((l) => l.length > 0)
