// Build-time data: a few maps with the correct islands and minimum spanning tree of bridges, and
// the islands the official program sees (with Python's negative indexing).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { labelIslands, officialAnswers } from './official.ts'

export const title = 'Correct islands vs. the official program'
export const caption =
  'Each colour is one island, pink lines are the bridges of the minimum spanning tree. Switch to "Official program" to see which islands its flood fill merges by walking off the top or left edge (marked with pink ticks).'

const SHOW = [
  { name: 'Bug demo 3 × 3', rows: ['101', '000', '111'] },
  { name: 'Example 3', rows: ['01100', '10100', '01001'] },
  { name: 'Map 101', index: 101 },
  { name: 'Map 18', index: 18 },
  { name: 'Map 27', index: 27 },
]

function readCases(input: string): string[][] {
  const lines = input.replace(/\r/g, '').split('\n').map((l) => l.trim()).filter((l) => l.length > 0)
  const cases: string[][] = []
  let at = 1
  for (let t = 0; t < Number(lines[0]); t++) {
    const [h] = lines[at++]!.split(/\s+/).map(Number) as [number]
    cases.push(lines.slice(at, at + h).map((r) => r.replace(/\s+/g, '')))
    at += h
  }
  return cases
}

function solve(rows: string[]) {
  const h = rows.length
  const w = rows[0]!.length
  const label = new Array<number>(h * w).fill(-1)
  let islands = 0
  for (let start = 0; start < h * w; start++) {
    if (rows[Math.floor(start / w)]![start % w] !== '1' || label[start] !== -1) continue
    const stack = [start]
    label[start] = islands
    while (stack.length) {
      const cell = stack.pop()!
      const r = Math.floor(cell / w)
      const c = cell % w
      for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]] as const) {
        if (nr < 0 || nr >= h || nc < 0 || nc >= w || rows[nr]![nc] !== '1' || label[nr * w + nc] !== -1) continue
        label[nr * w + nc] = islands
        stack.push(nr * w + nc)
      }
    }
    islands++
  }
  const candidates: { len: number; a: number; b: number; from: [number, number]; to: [number, number]; vertical: number }[] = []
  for (let r = 0; r < h; r++)
    for (let c = 0; c < w; c++) {
      const a = label[r * w + c]!
      if (a < 0) continue
      for (const [dr, dc] of [[0, 1], [1, 0]] as const)
        for (let len = 1; len <= 4; len++) {
          const nr = r + dr * len
          const nc = c + dc * len
          if (nr >= h || nc >= w) break
          const b = label[nr * w + nc]!
          if (b < 0) continue
          if (len > 1 && b !== a) candidates.push({ len: len - 1, a, b, from: [r + dr, c + dc], to: [nr - dr, nc - dc], vertical: dr })
          break
        }
    }
  const parent = Array.from({ length: islands }, (_, i) => i)
  const root = (x: number): number => (parent[x] === x ? x : (parent[x] = root(parent[x]!)))
  const bridges: number[][] = []
  let material = 0
  for (const b of candidates.sort((x, y) => x.len - y.len)) {
    const ra = root(b.a)
    const rb = root(b.b)
    if (ra === rb) continue
    parent[ra] = rb
    material += b.len
    bridges.push([...b.from, ...b.to, b.vertical])
  }
  const connected = islands > 0 && bridges.length === islands - 1
  return { label, islands, bridges, material: connected ? material : -1 }
}

export function data(dir: string) {
  const all = readCases(readFileSync(join(dir, 'input.txt'), 'utf8'))
  return SHOW.map((s) => {
    const rows = s.rows ?? all[s.index! - 1]!
    const mine = solve(rows)
    const map = labelIslands(rows.map((r) => [...r]), true)
    const official = rows.flatMap((r, i) => [...r].map((_, j) => map.get(`${i},${j}`) ?? -1))
    const officialMaterial = officialAnswers(`1\n${rows.length} ${rows[0]!.length}\n${rows.join('\n')}\n`, true)[0]
    return {
      name: s.name,
      rows,
      correct: mine.label,
      islands: mine.islands,
      bridges: mine.bridges,
      material: mine.material,
      official,
      officialIslands: new Set(official.filter((x) => x >= 0)).size,
      officialMaterial,
    }
  })
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Helyes szigetek a hivatalos programmal szemben',
  caption:
    'Minden szín egy sziget, a rózsaszín vonalak a minimális feszítőfa hídjai. Kapcsolj át a „Hivatalos program” nézetre, hogy lásd, mely szigeteket olvasztja össze az elárasztásos kitöltése, mert lelép a felső vagy a bal szélen (rózsaszín jelölés).',
}
