# Inconsistent array

**CoderGames 2021 · Task 5** · *Nekonzistentné pole* · math, arrays

## The task

An array of size *N* contains the numbers 0 … N−2, so one of them must appear twice, and exactly one does. Find it. Each input line is `N;a,b,c,…`.

## The idea

There are several ways to do it: sort and look for neighbours (O(N log N)), or keep a set of seen numbers (O(N) memory). The neatest needs **one pass and no extra memory**:

- The numbers 0 … N−2 add up to (N−2)(N−1)/2.
- The array has all of them plus the duplicate once more.
- So **duplicate = sum of the array − (N−2)(N−1)/2**.

(XOR works the same way, if you're worried about overflow in other languages.)

The organisers wrote that this was the easiest task of the week: it had the most fully correct answers and the fastest submissions.

## Answer

0, 4, 12, 9, 1
