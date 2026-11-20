// CoderGames 2022, task 2: the second smallest positive number divisible by every number 1..21.
// Every common multiple of 1..21 is a multiple of their least common multiple (LCM), so the
// smallest is the LCM itself and the second smallest is twice the LCM. No search needed.
const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? a : gcd(b, a % b))
const lcm = (a: bigint, b: bigint) => (a / gcd(a, b)) * b

let l = 1n
for (let k = 1n; k <= 21n; k++) l = lcm(l, k)
console.log((2n * l).toString())
