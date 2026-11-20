// Build-time data: all 10,000 machines (weight, value) as Float32 and which ones are packed.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const title = 'All 10,000 machines'
export const caption =
  'Each dot is a machine: size to the right, usefulness up. The packed ones (pink) are the machines above the dashed line through the origin, the best usefulness per unit of size, plus a few small ones below it that fill the last gaps. Machines near the line are where the hard decisions are.'

export function data(dir: string) {
  const { items, capacity } = JSON.parse(readFileSync(join(dir, 'input.json'), 'utf8')) as {
    items: { id: number; value: number; weight: number }[]
    capacity: number
  }
  const order = [...items.keys()].sort((a, b) => items[b]!.value / items[b]!.weight - items[a]!.value / items[a]!.weight)
  const chosen = new Uint8Array(items.length)
  let room = capacity
  let value = 0
  let breakRatio = 0
  for (const i of order) {
    if (items[i]!.weight <= room) {
      chosen[i] = 1
      room -= items[i]!.weight
      value += items[i]!.value
    } else if (!breakRatio) breakRatio = items[i]!.value / items[i]!.weight
  }
  const wv = new Float32Array(items.length * 2)
  items.forEach((it, i) => ((wv[2 * i] = it.weight), (wv[2 * i + 1] = it.value)))
  const bits = new Uint8Array(Math.ceil(items.length / 8))
  chosen.forEach((c, i) => c && (bits[i >> 3]! |= 1 << (i & 7)))
  return {
    count: items.length,
    capacity,
    wv: Buffer.from(wv.buffer).toString('base64'),
    chosen: Buffer.from(bits).toString('base64'),
    value,
    used: capacity - room,
    breakRatio,
    bound: 743533.7826484649,
  }
}

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Mind a 10 000 gép',
  caption:
    'Minden pont egy gép: jobbra a méret, felfelé a hasznosság. A bepakoltak (rózsaszín) az origón átmenő szaggatott vonal fölötti gépek, vagyis amelyeknek a legjobb a méretegységre jutó hasznossága, plusz néhány kicsi alatta, ami kitölti az utolsó réseket. A vonal közelében vannak a nehéz döntések.',
}
