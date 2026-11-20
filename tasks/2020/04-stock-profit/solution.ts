// CoderGames 2020, task 4: best single buy and sell in one pass over 10 million prices.
// Prices are unsigned 64-bit, more than a JavaScript number holds exactly, so each price is
// kept as two exact parts: value = hi * 1e10 + lo. Comparing and subtracting the pairs avoids
// creating 10 million BigInts; the file is streamed in chunks so it is never one big string.
import { openSync, readSync, closeSync } from 'node:fs'

const BASE = 1e10
type Pair = [hi: number, lo: number]
const less = (a: Pair, b: Pair) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])
const minus = (a: Pair, b: Pair): Pair => {
  let hi = a[0] - b[0]
  let lo = a[1] - b[1]
  if (lo < 0) {
    lo += BASE
    hi -= 1
  }
  return [hi, lo]
}
const show = (p: Pair) => (BigInt(p[0]) * BigInt(BASE) + BigInt(p[1])).toString()

interface Trade {
  buy: Pair
  sell: Pair
  profit: Pair
}
let lowest = null as Pair | null // cheapest price seen so far
let best = null as Trade | null

function price(p: Pair) {
  if (lowest === null || less(p, lowest)) {
    lowest = p
    return
  }
  const profit = minus(p, lowest)
  if (best === null || less(best.profit, profit)) best = { buy: lowest, sell: p, profit }
}

const fd = openSync(process.argv[2] ?? 'input.txt', 'r')
const buf = Buffer.alloc(1 << 24)
let hi = 0
let lo = 0
let digits = 0
for (let n; (n = readSync(fd, buf, 0, buf.length, null)) > 0; ) {
  for (let i = 0; i < n; i++) {
    const c = buf[i]!
    if (c >= 48 && c <= 57) {
      const l = lo * 10 + (c - 48) // below 1e11, still exact
      hi = hi * 10 + Math.floor(l / BASE)
      lo = l % BASE
      digits++
    } else if (digits) {
      price([hi, lo])
      hi = lo = digits = 0
    }
  }
}
if (digits) price([hi, lo])
closeSync(fd)

if (best === null) console.log('No profitable trade')
else console.log(`Buy: ${show(best.buy)}\nSell: ${show(best.sell)}`)
