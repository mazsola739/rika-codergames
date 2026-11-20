# Missing numbers

**CoderGames 2024 · Task 4** · arrays, counting · country: **Slovakia**

## The task

In a village below the Tatras, where the outlaw Jánošík took from the rich and gave to the poor, numbers must form an unbroken sequence. Given an array of integers, find how many numbers are missing between the smallest and the largest, and list them in ascending order. `4 3 6 8` → `2: 5, 7`. The input has 4,182 numbers.

## The idea

Sorting and scanning for gaps works in O(n log n). Since the values sit in a small range, a **presence table** is even simpler: mark every value in a byte array indexed by `value − min`, then walk from min to max and collect the unmarked ones. That's O(n + range), no sorting needed.

## Answer

**202** missing numbers: 24, 42, 43, 54, 60, 70, 81, … 3907, 3980 (the full list is in [`answer.txt`](answer.txt)). The country is **Slovakia** (Poland was accepted too).
