# Diamond sum

**CoderGames 2024 · Task 2** · math, closed formula, big integers · country: **Hungary**

## The task

An N × N grid (N odd) is filled with 1, 2, …, N² row by row. The **diamond sum** is the sum of the numbers on the diamond whose corners are the midpoints of the four sides. For N = 5:

```
 1  2 [3] 4  5
 6 [7] 8 [9]10
[11]12 13 14[15]
16[17]18[19]20
21 22[23]24 25      3+7+9+11+15+17+19+23 = 104
```

Compute it modulo 987,654,321 for N up to **10¹⁸**. The country hint is the first underground railway in continental Europe, opened in 1896: Budapest's Millennium Underground.

## The idea

10¹⁸ rules out any loop, so we need a formula. Let m = (N − 1)/2 be the middle index. Row *r* holds r·N + c + 1 in column *c*.

- The **top and bottom rows** touch the diamond once, in the middle column: (m + 1) and N(N − 1) + m + 1.
- **Every other row** touches it twice, at columns m − d and m + d. Their column numbers add up to 2m, so that row adds 2(rN + 1 + m).

Summing over r = 1 … N − 2 and simplifying (2m = N − 1):

> **diamond(N) = (N − 1)(N² + 1)**

Check: N = 5 → 4 · 26 = 104 ✓. The program evaluates it with `BigInt`, reducing each factor modulo 987,654,321.

## The faulty input

The original input file contained 1000, 1000000 and 10000000000000: all **even**, so there is no middle cell and no diamond. The organisers cancelled the task and gave everyone full points. They then published corrected inputs (137, 31415, 20241223) with results, which is what [`input.txt`](input.txt) uses. The original is kept in [`input-original.txt`](input-original.txt).

## Answer

2552720, 77391374, 464692980. The country is **Hungary**.
