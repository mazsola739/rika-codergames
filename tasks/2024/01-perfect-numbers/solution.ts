// CoderGames 2024, task 1: the perfect numbers between 2 and 100,000,000.
// Checking the divisors of all 10^8 numbers is far too slow (or needs a 400 MB sieve). Euclid and
// Euler did the work 2000 years ago: an even number is perfect exactly when it is
// 2^(p-1) * (2^p - 1) with 2^p - 1 prime (a Mersenne prime), and no odd perfect number is known
// (none exists below 10^1500). So: try p = 2, 3, 4, ..., test 2^p - 1 for primality, and confirm
// each candidate by adding up its divisors.
const LIMIT = 100_000_000

const isPrime = (n: number) => {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}
const divisorSum = (n: number) => {
  let s = 1
  for (let d = 2; d * d <= n; d++) if (n % d === 0) s += d + (d * d === n ? 0 : n / d)
  return s
}

const perfect: number[] = []
for (let p = 2; 2 ** (p - 1) * (2 ** p - 1) <= LIMIT; p++) {
  const n = 2 ** (p - 1) * (2 ** p - 1)
  if (isPrime(2 ** p - 1) && divisorSum(n) === n) perfect.push(n)
}
console.log(perfect.join('\n'))
