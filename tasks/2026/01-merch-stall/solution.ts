// CoderGames 2026, task 1: where to open a merchandise stall in the fan zone, and at what price.
//
// A fan with patience K walks past K stalls, then buys at the cheapest one seen; on a tie, at the
// one nearest to where they stopped, i.e. the one seen LAST. Half the fans walk left to right,
// half right to left, and B[K] percent have patience K. Our stall goes after existing stall L.
//
// For a fixed L, a fan with patience K buys from us exactly when they reach our stall and our
// price P is
//   - at most the lowest price they saw BEFORE our stall (on a tie we were seen later: we win),
//   - and strictly below every price they see AFTER it (on a tie that one is nearer: it wins).
// So every fan type gives a price ceiling (or never buys), and the share of buyers drops in steps
// as P rises. Between two ceilings raising P only earns more, so the best P is always one of the
// ceilings: per L we try at most 2N candidate prices instead of all 9999. O(N^3) overall.
import { readFileSync } from 'node:fs'

const nums = readFileSync(process.argv[2] ?? 'gp.in', 'utf8').trim().split(/\s+/).map(Number)
const n = nums[0]!
const price = nums.slice(1, 1 + n) // price[0..n-1]
const share = nums.slice(1 + n, 1 + 2 * n) // share[K-1] = B_K percent

const minOf = (from: number, to: number) => {
  let m = Infinity
  for (let i = from; i <= to; i++) m = Math.min(m, price[i]!)
  return m
}

// Ceilings for fans walking in one direction. `before` / `after` give the existing stalls a fan
// passes before and after ours (as index ranges), and `seenAt` how many stalls they need to pass
// to reach ours.
interface Fan {
  weight: number // fraction of all fans
  ceiling: number // highest price at which they still buy from us
}

function fansFor(L: number): Fan[] {
  const fans: Fan[] = []
  for (let K = 1; K <= n; K++) {
    const weight = share[K - 1]! / 200 // half of the fans walk each way
    if (weight === 0) continue
    // Left to right: stalls 0..L-1, then ours (the (L+1)-th), then L .. K-2.
    if (K >= L + 1) fans.push({ weight, ceiling: Math.min(minOf(0, L - 1), minOf(L, K - 2) - 1) })
    // Right to left: stalls n-1 .. L, then ours (the (n-L+1)-th), then L-1 down to L-1-(K-(n-L+1))+1.
    const seenAt = n - L + 1
    if (K >= seenAt) fans.push({ weight, ceiling: Math.min(minOf(L, n - 1), minOf(L - (K - seenAt), L - 1) - 1) })
  }
  return fans
}

let best = { revenue: -1, L: 0, P: 0 }
for (let L = 1; L < n; L++) {
  const fans = fansFor(L)
  const candidates = [...new Set(fans.map((f) => f.ceiling))].filter((p) => p >= 1).sort((a, b) => a - b)
  for (const P of candidates) {
    const revenue = P * fans.reduce((s, f) => s + (f.ceiling >= P ? f.weight : 0), 0)
    // Strictly better only: ties keep the smaller L (outer loop) and smaller P (ascending order).
    if (revenue > best.revenue + 1e-9) best = { revenue, L, P }
  }
}
console.log(`${best.L} ${best.P}`)
