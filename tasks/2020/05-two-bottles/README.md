# Two bottles, a thousand floors

**CoderGames 2020 · Task 5** · dynamic programming, egg drop

## The task

A new 1000-storey dormitory opens in Košice. Two students want to find the lowest floor from which their (very sturdy) bottle breaks, and they only have two bottles. What strategy needs the fewest drops in the worst case, and how many drops is that?

## The idea

This is the classic **two-egg problem**.

- With **one** bottle you have no choice: go up one floor at a time.
- With **two**, use the first bottle to narrow the range quickly and the second one to finish floor by floor. If the first bottle breaks after *k* drops, the second one must cover the gap below, so each gap must be **one floor smaller than the previous one**. That way the total number of drops stays the same, however far up you get.

So if the worst case is *d* drops, the first bottle goes to floor *d*, then *d + (d−1)*, then *+ (d−2)*, and so on. Together these steps cover *d(d+1)/2* floors. The smallest *d* with *d(d+1)/2 ≥ 1000* is **45** (45·46/2 = 1035).

Halving the range (first drop at floor 500) is a trap: if the bottle breaks, the second bottle has to try floors 1 to 499 one by one. According to the organisers, that was the most common answer.

## The program

[`solution.ts`](solution.ts) uses the general recurrence. With *b* bottles and *d* drops you can cover

reach(b, d) = reach(b−1, d−1) + 1 + reach(b, d−1)

floors: the first drop either breaks the bottle (one bottle fewer for the floors below) or doesn't (the same bottles for the floors above). The program finds the smallest *d* with reach(2, d) ≥ 1000 and prints where the first bottle is dropped.

## Answer

**45 drops**, with the first bottle dropped from floors 45, 89, 132, 174, 215, 255, … 980, 990, 999. When it breaks, go back to the last safe floor and continue one floor at a time with the second bottle.
