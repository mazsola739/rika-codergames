// Build-time data: the trail network, a force-directed layout and the path through all points.
import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'A route through all 100 points'
export const caption =
  'The trail network drawn with a force-directed layout. Play the route the depth-first search finds with Warnsdorff’s rule: it reaches every point exactly once.'

export function data(dir: string) {
  const edges: [number, number][] = []
  const adj = new Map<number, Set<number>>()
  for (const [, a, b] of inputText(dir)!.matchAll(/\{\s*(\d+)\s*,\s*(\d+)\s*[}\)]/g)) {
    const u = Number(a)
    const v = Number(b)
    if (u === v || adj.get(u)?.has(v)) continue
    for (const [x, y] of [[u, v], [v, u]] as const) {
      if (!adj.has(x)) adj.set(x, new Set())
      adj.get(x)!.add(y)
    }
    edges.push([u, v])
  }
  const nodes = [...adj.keys()].sort((a, b) => a - b)

  // Path: depth-first search, fewest-free-neighbours first (as in solution.ts).
  const visited = new Set<number>()
  const path: number[] = []
  let best: number[] = []
  const free = (v: number) => [...adj.get(v)!].filter((u) => !visited.has(u)).length
  const search = (v: number): boolean => {
    visited.add(v)
    path.push(v)
    if (path.length > best.length) best = [...path]
    if (best.length === nodes.length) return true
    for (const u of [...adj.get(v)!].filter((u) => !visited.has(u)).sort((a, b) => free(a) - free(b) || a - b)) if (search(u)) return true
    visited.delete(v)
    path.pop()
    return false
  }
  for (const start of [...nodes].sort((a, b) => adj.get(a)!.size - adj.get(b)!.size || a - b)) if (search(start)) break

  // Layout: Fruchterman–Reingold from a circle, deterministic.
  const n = nodes.length
  const index = new Map(nodes.map((v, i) => [v, i]))
  const pos = nodes.map((_, i) => [Math.cos((2 * Math.PI * i) / n) * 0.4, Math.sin((2 * Math.PI * i) / n) * 0.4])
  const k = Math.sqrt(1 / n)
  for (let it = 0, t = 0.08; it < 600; it++, t *= 0.993) {
    const disp = pos.map(() => [0, 0])
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i]![0]! - pos[j]![0]!
        const dy = pos[i]![1]! - pos[j]![1]!
        const d = Math.max(1e-4, Math.hypot(dx, dy))
        const f = (k * k) / d
        disp[i]![0]! += (dx / d) * f
        disp[i]![1]! += (dy / d) * f
        disp[j]![0]! -= (dx / d) * f
        disp[j]![1]! -= (dy / d) * f
      }
    for (const [u, v] of edges) {
      const i = index.get(u)!
      const j = index.get(v)!
      const dx = pos[i]![0]! - pos[j]![0]!
      const dy = pos[i]![1]! - pos[j]![1]!
      const d = Math.max(1e-4, Math.hypot(dx, dy))
      const f = (d * d) / k
      disp[i]![0]! -= (dx / d) * f
      disp[i]![1]! -= (dy / d) * f
      disp[j]![0]! += (dx / d) * f
      disp[j]![1]! += (dy / d) * f
    }
    pos.forEach((p, i) => {
      const [dx, dy] = disp[i]!
      const d = Math.max(1e-4, Math.hypot(dx!, dy!))
      p[0] = p[0]! + (dx! / d) * Math.min(d, t) - p[0]! * 0.01
      p[1] = p[1]! + (dy! / d) * Math.min(d, t) - p[1]! * 0.01
    })
  }
  const xs = pos.map((p) => p[0]!)
  const ys = pos.map((p) => p[1]!)
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const norm = pos.map(([x, y]) => [Math.round(((x! - x0) / (x1 - x0)) * 1000) / 1000, Math.round(((y! - y0) / (y1 - y0)) * 1000) / 1000])
  return { nodes, pos: norm, edges, path: best }
}
