// Build-time data: the example from the task and the real input (the page does the maths).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const title = 'Place the stall, set the price'
export const caption =
  'Move the new stall along the row and change its price. Every kind of fan either never buys from us or has a price ceiling, so revenue rises in a sawtooth and the best price always sits on a ceiling.'

const parse = (text: string) => {
  const nums = text.trim().split(/\s+/).map(Number)
  const n = nums[0]!
  return { prices: nums.slice(1, 1 + n), shares: nums.slice(1 + n, 1 + 2 * n) }
}

export function data(dir: string) {
  return [
    { name: 'Example from the task', ...parse(readFileSync(join(dir, 'example.txt'), 'utf8')), official: '2 199' },
    { name: 'Real input', ...parse(readFileSync(join(dir, 'input.txt'), 'utf8')), official: readFileSync(join(dir, 'answer.txt'), 'utf8').trim() },
  ]
}
