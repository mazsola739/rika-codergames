// CoderGames 2021, task 4: pay an amount with as few coins as possible (coin change).
// Greedy fails for odd coin systems (30 with 25, 10, 1: greedy pays 25 + 5x1 = 6 coins, the best
// is 3x10), so we use dynamic programming over every amount from 0 to X.
import { readFileSync } from 'node:fs'

const lines = readFileSync(process.argv[2] ?? 'input.txt', 'utf8').trim().split(/\r?\n/)
const cases = Number(lines[0])
const out: string[] = []

for (let k = 0; k < cases; k++) {
  const amount = Number(lines[1 + 2 * k])
  const coins = lines[2 + 2 * k]!.trim().split(/\s+/).map(Number)

  // fewest[x]: fewest coins that make x; last[x]: index of the coin used last for that.
  const fewest = new Int32Array(amount + 1).fill(0x7fffffff)
  const last = new Int8Array(amount + 1).fill(-1)
  fewest[0] = 0
  for (let x = 1; x <= amount; x++) {
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i]!
      if (coin > x || fewest[x - coin] === 0x7fffffff) continue
      if (fewest[x - coin]! + 1 < fewest[x]!) {
        fewest[x] = fewest[x - coin]! + 1
        last[x] = i
      }
    }
  }

  out.push(String(amount))
  if (fewest[amount] === 0x7fffffff) {
    out.push('INF')
    continue
  }
  const used = coins.map(() => 0)
  for (let x = amount; x > 0; x -= coins[last[x]!]!) used[last[x]!]!++
  out.push(String(fewest[amount]))
  coins.forEach((coin, i) => used[i] && out.push(`${coin}: ${used[i]}`))
}
console.log(out.join('\n'))
