# Perfect numbers

**CoderGames 2024 · Task 1** · number theory, Mersenne primes · country: **Czechia**

## The task

The story follows Jára Cimrman, the great Czech "inventor" who never existed, as he discovers perfect numbers and designs an astronomical clock for the capital (Prague's has stood there since 1410). Find the first five perfect numbers between 2 and 100,000,000. A **perfect number** equals the sum of its divisors other than itself: 6 = 1 + 2 + 3, 28 = 1 + 2 + 4 + 7 + 14.

## The idea

Summing the divisors of every number up to 10⁸ means either a sieve of 10⁸ entries (400 MB) or O(√n) work for each of 10⁸ numbers. Mathematics gives a shortcut:

- **Euclid** proved that if 2ᵖ − 1 is prime, then 2ᵖ⁻¹ · (2ᵖ − 1) is perfect.
- **Euler** proved the converse: **every even** perfect number has that form.
- **No odd perfect number is known.** It's one of the oldest open problems in mathematics, and none exists below 10¹⁵⁰⁰.

So the program tries p = 2, 3, 4, … while 2ᵖ⁻¹(2ᵖ − 1) ≤ 10⁸, keeps the p where 2ᵖ − 1 is a prime (a *Mersenne prime*), and double-checks each candidate by actually summing its divisors. That's a handful of loop iterations instead of 100 million.

| p | 2ᵖ − 1 | perfect number |
|---|---|---|
| 2 | 3 | 6 |
| 3 | 7 | 28 |
| 5 | 31 | 496 |
| 7 | 127 | 8128 |
| 13 | 8191 | 33,550,336 |

## Answer

6, 28, 496, 8128, 33550336. The country is **Czechia**.
