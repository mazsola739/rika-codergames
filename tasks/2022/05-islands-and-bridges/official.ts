// A line-by-line TypeScript port of the organisers' published Python solution, used only to
// explain why their answers differ from solution.ts. `pythonIndexing` keeps one detail of
// Python: grid[-1] is the LAST row (and row[-1] the last column) instead of an error. In their
// flood fill this makes land on the top and left edges continue on the bottom and right edges,
// so islands that are far apart get merged. With pythonIndexing = false, -1 is out of the grid.
type Coord = string // "row,col"
interface Bridge {
  islands: Set<number>
  length: number
}

const key = (r: number, c: number): Coord => `${r},${c}`
const neighbors = (r: number, c: number): [number, number][] => [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]

// create_map + flood_island. Keys are "row,col"; with Python indexing some keys lie outside the
// map (negative rows or columns), because the flood fill walks off the top or left edge.
export function labelIslands(grid: string[][], pythonIndexing: boolean): Map<Coord, number> {
  const height = grid.length
  const width = grid[0]?.length ?? 0
  // grid[r][c] the way Python evaluates it: negative indexes count from the end,
  // anything past the end raises IndexError (which their code catches and skips).
  const cell = (r: number, c: number): string | undefined => {
    const row = r < 0 ? (pythonIndexing ? grid[height + r] : undefined) : grid[r]
    if (!row) return undefined
    return c < 0 ? (pythonIndexing ? row[row.length + c] : undefined) : row[c]
  }
  // Note: dict.update overwrites labels from earlier floods.
  const islandsMap = new Map<Coord, number>()
  let nextId = 0
  for (let row = 0; row < height; row++)
    for (let col = 0; col < width; col++) {
      if (grid[row]![col] !== '1' || islandsMap.has(key(row, col))) continue
      const id = nextId++
      const flood = new Map<Coord, number>([[key(row, col), id]])
      const queue: [number, number][] = [[row, col]]
      for (let head = 0; head < queue.length; head++) {
        const [r, c] = queue[head]!
        for (const [nr, nc] of neighbors(r, c)) {
          if (!flood.has(key(nr, nc)) && cell(nr, nc) === '1') {
            flood.set(key(nr, nc), id)
            queue.push([nr, nc])
          }
        }
      }
      for (const [k, v] of flood) islandsMap.set(k, v)
    }
  return islandsMap
}

export function officialAnswers(input: string, pythonIndexing: boolean): number[] {
  const lines = input.replace(/\r/g, '').split('\n')
  let at = 0
  const T = Number(lines[at++]!.trim())
  const results: number[] = []
  for (let t = 0; t < T; t++) {
    const [height, width] = lines[at++]!.trim().split(/\s+/).map(Number) as [number, number]
    const grid: string[][] = []
    for (let i = 0; i < height; i++) grid.push([...lines[at++]!.trim()])

    const islandsMap = labelIslands(grid, pythonIndexing)
    const islands = new Set(islandsMap.values())

    // find_available_bridges
    const bridges: Bridge[] = []
    for (const [coordinate, islandId] of islandsMap) {
      const [r, c] = coordinate.split(',').map(Number) as [number, number]
      for (const [nr, nc] of neighbors(r, c)) {
        if (islandsMap.has(key(nr, nc))) continue
        const [dr, dc] = [nr - r, nc - c]
        let [pr, pc] = [nr, nc]
        for (let i = 0; i < 3; i++) {
          ;[pr, pc] = [pr + dr, pc + dc]
          const other = islandsMap.get(key(pr, pc))
          if (other !== undefined && other !== islandId) {
            bridges.push({ islands: new Set([islandId, other]), length: i + 1 })
            break
          }
        }
      }
    }

    // find_minimum_spanning_tree: Prim's algorithm grown from island 0.
    const tree = new Set([0])
    let remaining = bridges
    const chosen: Bridge[] = []
    while (remaining.length) {
      if (!remaining.some((b) => [...b.islands].some((i) => tree.has(i)))) break
      const sorted = [...remaining].sort((a, b) => a.length - b.length)
      for (const b of sorted) {
        if ([...b.islands].filter((i) => tree.has(i)).length === 1) {
          chosen.push(b)
          for (const i of b.islands) tree.add(i)
          remaining = remaining.filter((x) => ![...x.islands].every((i) => tree.has(i)))
          break
        }
      }
    }
    const materials = chosen.reduce((s, b) => s + b.length, 0)
    results.push(chosen.length !== islands.size - 1 ? -1 : materials)
  }
  return results
}
