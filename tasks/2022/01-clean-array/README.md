# Clean the array

**CoderGames 2022 · Task 1** · counting, hash map

## The task

Given an array of integers, what is the smallest number of deletions that leaves only one distinct value? For `[1, 2, 2, 3]`, keeping the two 2s costs 2 deletions, which is the best. The input has 100 arrays.

## The idea

Whatever value we keep, we must delete everything else. So keep the value that appears **most often**:

> deletions = n − (count of the most frequent value)

Count with a hash map in one pass: O(n).

## Answer

100 values: 0, 1, 2, 3, 3, 4, 5, 5, 6, 7, … (see [`answer.txt`](answer.txt)).
