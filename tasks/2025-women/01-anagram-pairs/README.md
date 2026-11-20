# Anagram pairs

**CoderGames for Women 2025 · Task 1** · strings, counting · country: **Slovakia**

## The task

In a story set between the Tatras, Bratislava Castle and Spiš Castle, Janko has to check pairs of words. For each line of two lowercase words, print `YES` if they are **anagrams** of each other (the same letters, rearranged) and `NO` otherwise. `listen silent` → `YES`. The input has 35 pairs, some of them long.

## The idea

Sorting both words and comparing works in O(n log n). Counting is simpler and linear:

- Different lengths: `NO` straight away.
- Otherwise keep 26 counters. Add 1 for each letter of the first word and subtract 1 for each letter of the second. Anagrams leave every counter at **zero**.

O(length) per pair, with a fixed 26-element array.

## Answer

The country is **Slovakia**. The 35 results are in [`answer.txt`](answer.txt). The organisers accepted both answers for two pairs where identical strings could count as "trivial" anagrams.
