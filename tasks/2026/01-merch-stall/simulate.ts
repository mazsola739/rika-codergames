// A literal simulation of the fan zone, used to double-check solution.ts: for every position and
// every price, build the row of stalls, walk every kind of fan along it exactly as the story says,
// and add up what the new stall earns. Far too slow for the real contest limits in general, but
// fine for these inputs, and it shares no logic with the threshold argument in solution.ts.
export function simulate(input: string): { L: number; P: number; revenue: number } {
  const nums = input.trim().split(/\s+/).map(Number)
  const n = nums[0]!
  const price = nums.slice(1, 1 + n)
  const share = nums.slice(1 + n, 1 + 2 * n)
  // Our stall is never first or last, so every fan who reaches it has passed an existing stall:
  // a price above the most expensive stall can never sell.
  const maxPrice = Math.max(...price)
  let best = { L: 0, P: 0, revenue: -1 }
  for (let L = 1; L < n; L++)
    for (let P = 1; P <= maxPrice; P++) {
      const row = [...price.slice(0, L), P, ...price.slice(L)]
      let revenue = 0
      for (const leftToRight of [true, false])
        for (let K = 1; K <= n; K++) {
          if (!share[K - 1]) continue
          let choice = -1
          for (let step = 0; step < K; step++) {
            const i = leftToRight ? step : row.length - 1 - step
            // Cheapest so far; on a tie the later one wins, being nearer to where the fan stops.
            if (choice < 0 || row[i]! <= row[choice]!) choice = i
          }
          if (choice === L) revenue += (P * share[K - 1]!) / 200
        }
      if (revenue > best.revenue + 1e-9) best = { L, P, revenue }
    }
  return best
}
