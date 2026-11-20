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
