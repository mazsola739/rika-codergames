# Trick or treat!

**CoderGames 2025 · Task 1** · hash map, two-sum

## The task

Domi may eat only two chocolates, and his dad decides how heavy they must be together. Given a list of chocolate weights and a target, find the indexes of the **first** two chocolates that add up to the target, or `null` if no pair does. "First" means the pair whose **second** chocolate appears earliest: in `[1, 2, 3, 4]` with target 5, the answer is `[1, 2]`, not `[0, 3]`.

## The idea

This is the classic **two-sum** problem. Checking every pair is O(n²). Better: walk through the list once and, for each chocolate *j*, ask *"have I already seen a chocolate weighing target − weight[j]?"* A hash map from weight to the first index where it appeared answers that in O(1).

Walking left to right means the first hit is exactly the pair with the earliest second chocolate. Storing only the *first* index of each weight gives the earliest partner for it. O(n) overall.

## Answer

`[2, 3]`, `[1, 2]`, `[0, 2]`, `[3, 4]`, `[2, 4]`, `[0, 2]`, `[1, 2]`, `null`, `[5, 8]`
