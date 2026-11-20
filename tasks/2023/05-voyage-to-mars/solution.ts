// CoderGames 2023, task 5: pack the Mars rocket. 10,000 machines with a usefulness (value) and a
// size (weight, a real number); total size at most 10,000. This is the 0/1 knapsack problem.
//
// The usual DP needs integer weights, and these are floats, so we use branch and bound instead
// (the Horowitz-Sahni scheme):
// - sort the machines by value per unit of weight, best first;
// - the greedy packing (take them in that order while they fit) is a good first answer;
// - for any partial choice, the "fractional" bound (fill the rest greedily, allowing a fraction of
//   the first machine that doesn't fit) is an upper limit on what that choice can still reach,
//   so whole branches that can't beat the best answer so far are skipped.
// Prefix sums plus a binary search make each bound O(log n).
import { readFileSync } from 'node:fs'

interface Item {
  id: number
  value: number
  weight: number
}
const data: { items: Item[]; capacity: number } = JSON.parse(readFileSync(process.argv[2] ?? 'input.json', 'utf8'))
const capacity = data.capacity
const items = data.items.filter((it) => it.weight <= capacity).sort((a, b) => b.value / b.weight - a.value / a.weight)
const n = items.length
const W = new Float64Array(n + 1) // W[i] = weight of items[0..i-1]
const V = new Float64Array(n + 1)
for (let i = 0; i < n; i++) {
  W[i + 1] = W[i]! + items[i]!.weight
  V[i + 1] = V[i]! + items[i]!.value
}
const EPS = 1e-9

// Most value reachable from items i..n-1 with `room` left, allowing one fractional item.
function bound(i: number, room: number): number {
  // largest j >= i with W[j] - W[i] <= room
  let lo = i
  let hi = n
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (W[mid]! - W[i]! <= room + EPS) lo = mid
    else hi = mid - 1
  }
  let b = V[lo]! - V[i]!
  if (lo < n) b += ((room - (W[lo]! - W[i]!)) * items[lo]!.value) / items[lo]!.weight
  return b
}

const take = new Uint8Array(n)
let best = -1
let bestTake = new Uint8Array(n)
let value = 0
let room = capacity
let i = 0
let nodes = 0
const deadline = Date.now() + 20_000
let proven = true

search: for (;;) {
  nodes++
  if (i < n && value + bound(i, room) <= best + EPS) {
    // cannot beat the best: backtrack below
  } else {
    // Forward: take items in order while they fit, skip the ones that don't.
    for (; i < n; i++) {
      if (items[i]!.weight <= room + EPS) {
        take[i] = 1
        room -= items[i]!.weight
        value += items[i]!.value
      } else {
        take[i] = 0
        if (value + bound(i + 1, room) <= best + EPS) break
      }
    }
    if (value > best + EPS) {
      // Only take[0..i] belongs to this branch; anything after it is left over from older ones.
      best = value
      bestTake = new Uint8Array(n)
      bestTake.set(take.subarray(0, Math.min(i + 1, n)))
    }
  }
  if ((nodes & 0xffff) === 0 && Date.now() > deadline) {
    proven = false
    break
  }
  // Backtrack: undo the last taken item and try the branch without it.
  let k = Math.min(i, n) - 1
  while (k >= 0 && !take[k]) k--
  if (k < 0) break search
  take[k] = 0
  room += items[k]!.weight
  value -= items[k]!.value
  i = k + 1
}

const chosen = items.filter((_, j) => bestTake[j]).sort((a, b) => a.id - b.id)
const totalWeight = chosen.reduce((s, it) => s + it.weight, 0)
console.log(`Total value: ${best}`)
console.log(`Total weight: ${totalWeight}`)
console.log('items:')
for (const it of chosen) console.log(it.id)
console.error(`${nodes} search nodes, ${proven ? 'optimal' : 'time limit reached, best found'}; upper bound ${bound(0, capacity)}`)
