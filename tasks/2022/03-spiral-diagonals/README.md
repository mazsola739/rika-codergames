# Spiral diagonals

**CoderGames 2022 · Task 3** · math, patterns

## The task

Write the numbers 1, 2, 3, … in a clockwise spiral starting from the centre:

```
21 22 23 24 25
20  7  8  9 10
19  6  1  2 11
18  5  4  3 12
17 16 15 14 13
```

The numbers on the two diagonals of this 5 × 5 spiral add up to 101. What is the sum for a 501 × 501 spiral?

## The idea

There's no need to build the spiral. Look at it **ring by ring**: the ring of side *n* (odd) ends with *n²* in one corner, and its other three corners come before that, each *n − 1* apart:

> n², n² − (n−1), n² − 2(n−1), n² − 3(n−1) → sum **4n² − 6(n − 1)**

The total is 1 (the centre) plus that sum for n = 3, 5, …, 501, which is 250 terms. A closed formula exists too, but the loop is already instant.

Check: for 5 × 5, 1 + (36 − 12) + (100 − 24) = 101. ✓

## Answer

**83960501**
