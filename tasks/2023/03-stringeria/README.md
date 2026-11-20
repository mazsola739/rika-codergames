# Stringeria

**CoderGames 2023 · Task 3** · dynamic programming, longest common subsequence

## The task

To break the curse on the land of Stringeria, find the **longest common subsequence** of two magic strings `s1` and `s2` (1000 capital letters each). A subsequence keeps the order of the letters but doesn't need them to be next to each other. Print one such subsequence and its length.

Example: `ABECF` and `AEEDC` → `AEC`, length 3.

## The idea

The classic DP. Let **L[i][j]** be the LCS length of the first *i* letters of `s1` and the first *j* letters of `s2`:

```
L[i][j] = L[i−1][j−1] + 1                if s1[i−1] = s2[j−1]
        = max(L[i−1][j], L[i][j−1])      otherwise
```

Fill the table row by row (1000 × 1000, a million cells, in a flat `Uint16Array`). Then walk back from the bottom-right corner: on a match, take the letter and go diagonally, otherwise step towards the larger neighbour. Reading the collected letters backwards gives one LCS.

- Time and memory: O(n · m).

## Checking it

Many different strings can reach the maximum length, so the official string is only one possibility. [`check.ts`](check.ts) accepts any string that is a subsequence of both inputs and has the official length.

## Answer

Length **319**.
