import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Counting paths, layer by layer'
export const caption =
  'Nodes are arranged by depth (the longest way to reach them from node 1). Step through the topological order: each node passes its count of paths to every node it points to. Colour shows the count on a log scale.'

export function data(dir: string) {
  const nums = inputText(dir)!.trim().split(/\s+/).map(Number)
  const [n, m] = nums as [number, number]
  const edges: [number, number][] = []
  for (let i = 0; i < m; i++) edges.push([nums[2 + 2 * i]!, nums[3 + 2 * i]!])
  return { n, edges }
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Utak számolása rétegenként',
  caption:
    'A csúcsok mélység szerint állnak (az 1-es csúcsból hozzájuk vezető leghosszabb út szerint). Lépkedj végig a topologikus sorrenden: minden csúcs továbbadja az útjai számát mindenkinek, akire mutat. A szín a darabszámot mutatja, logaritmikus skálán.',
}
