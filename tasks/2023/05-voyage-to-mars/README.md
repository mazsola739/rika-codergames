# Voyage to Mars

**CoderGames 2023 · Task 5** · knapsack, branch and bound, greedy

## The task

The rocket to Mars leaves tomorrow. There are 10,000 machines, each with a *usefulness* (value) and a *size* (weight, a real number). The payload limit is 10,000. Choose machines to maximise the total usefulness without going over the limit. The story stresses that there is no time for the perfect solution: be quick.

## The idea

This is the **0/1 knapsack problem**. The textbook DP works over integer capacities, but these weights are real numbers like 71.13353423971505, so it doesn't apply directly. Two simpler ideas work very well here:

1. **Greedy by density.** Sort the machines by value per unit of weight and take them in that order whenever they still fit. That's instant and already very good.
2. **Branch and bound** (the Horowitz–Sahni scheme) turns that into a *proven* optimum. Explore "take / don't take" decisions in density order, and for every partial choice compute an **upper bound**: fill the remaining room greedily, allowing a *fraction* of the first machine that doesn't fit. If that bound can't beat the best packing found so far, the whole branch is skipped. Prefix sums and a binary search make each bound O(log n).

On this input the greedy packing (743,529.61) is already optimal. Branch and bound proves it after visiting only **1,248** search nodes (0.2 s). The fractional bound is just 4.17 higher. Random instances like this are usually easy, which is why the bound is so effective. To be sure the search is right, it was also compared against brute force on 60 small random instances.

## The official answer is not a valid packing

The published solution claims a total value of **745,306.61**, above our optimum. But its list of 1,114 machines contains **machine 5996 twice and machine 9777 twice**, and each machine exists only once. Without the duplicates the list is worth 743,380.37 at weight 9,996.80, a little *worse* than plain greedy. So their algorithm must have allowed an item to be packed twice.

[`check.ts`](check.ts) therefore checks the packing from the input itself: the machines exist and are distinct, the total weight fits, the printed totals are correct, and the value reaches the proven optimum.

## Answer

- Total value: **743529.6098448576** (provably optimal)
- Total weight: 9999.90135840852
- 1,111 machines (the list is in the program's output)
