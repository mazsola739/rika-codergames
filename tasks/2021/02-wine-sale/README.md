# Selling wine

**CoderGames 2021 · Task 2** · dynamic programming over intervals

## The task

A shelf holds *n* bottles of wine, and you can only take one from either end. You sell exactly one bottle a year, starting in year 1. A bottle with price *cᵢ* sold in year *t* earns *t · cᵢ*. Find the order that earns the most. The input has 30 shelves with up to a few hundred bottles each.

Example: `10 25 27 28 1 1 8` → `536, 1*8 + 2*1 + 3*1 + 4*10 + 5*25 + 6*27 + 7*28`

## Why greedy fails

"Always sell the cheaper end" sounds right, but it can't see what's behind each end. You might want to sell an expensive bottle early to reach an even more expensive one later. The organisers wrote that many fast answers were wrong. This task rewarded being careful over being quick.

## The idea

At any moment, the bottles still on the shelf form one contiguous block *i..j*. The year is already fixed by how many bottles are gone: *t = n − (j − i)*. So the whole future depends only on *(i, j)*:

```
best(i, j) = max( t · c[i] + best(i+1, j),     sell the left end
                  t · c[j] + best(i, j−1) )    sell the right end
```

The program fills `best` from short blocks to long ones, which is O(n²) states with O(1) work each, and records which end each state chose. Then it replays those choices from the full shelf to print the order.

## Checking it

The official answer lists the 30 best totals. Several orders can earn the same total, so [`check.ts`](check.ts) compares the totals and replays the program's order to make sure it's legal (every bottle taken from an end) and really adds up.

## Answer

The 30 totals in [`answer.txt`](answer.txt), starting with 4163, 15010383, 17417190…
