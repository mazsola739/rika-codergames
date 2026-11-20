# Money

**CoderGames 2021 · Task 4** · *Peniaze* · dynamic programming, coin change

## The task

On an exotic holiday, the coins have strange values, like a 25. Given an amount *X* and the coin values, pay *X* with the fewest coins. Print how many of each coin are needed, or `INF` if *X* can't be paid at all. The amounts go up to 7,432,134.

## Why greedy fails

With coins 1, 10 and 25, greedy pays 30 as 25 + 1+1+1+1+1 (6 coins), but 10+10+10 is only 3. Greedy only works for "nice" coin systems like the euro.

## The idea

Classic **coin-change DP**. Let `fewest[x]` be the fewest coins that make *x*:

```
fewest[0] = 0
fewest[x] = 1 + min over coins c ≤ x of fewest[x − c]
```

The program fills it for every *x* from 1 to *X* and also stores which coin it used last for each *x*. Walking back from *X* then gives the coins.

- Time: O(X · number of coins), about 37 million steps for the largest case. It runs in about half a second, using typed arrays.
- Memory: two arrays of size *X*, about 37 MB for 7.4 million.

## Answer

| X | coins | breakdown |
|---|---|---|
| 30 | 3 | 10 × 3 |
| 134123 | 1605 | 1 × 2, 25 × 9, 84 × 1594 |
| 5432134 | 113173 | 3 × 2, 8 × 2, 48 × 113169 |
| 2131231 | 60894 | 12 × 2, 22 × 1, 35 × 60891 |
| 7432134 | 88482 | 25 × 6, 84 × 88476 |
