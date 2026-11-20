# Claim a spot

**CoderGames 2026 · Task 1** · optimisation, thresholds, brute-force cross-check · country: **Spain**

## The task

At the Grand Prix in a city famous for one architect's style, an unfinished basilica and street blocks with their corners cut off (Barcelona: Gaudí, the Sagrada Família, the Eixample), a row of *N* stalls sells identical team merchandise. You want to open one more stall: choose **where** (after existing stall *L*, never first or last) and at **what price** *P*, to maximise the expected revenue.

Fans behave in a fixed way. A fan with patience *K* walks past exactly *K* stalls, then goes back to the cheapest one seen. On a tie, they go to the one **nearest to where they stopped**. Half the fans walk from left to right, half from right to left, and *B_K* percent of fans have patience *K*. On equal revenue, the smallest *L* wins, then the smallest *P*. The task adds: "brute force is not an option".

## The idea

Fix the position *L* and look at one type of fan (direction and *K*). That fan buys from **us** exactly when they reach our stall and our price is

- **at most** the cheapest price they saw *before* us (on a tie we were seen later, so we're nearer to where they stop and we win), and
- **strictly below** every price they see *after* us (on a tie, that stall is nearer, so it wins).

So every fan type is either lost, or gives a **price ceiling**: it buys from us exactly when P ≤ ceiling. As P rises, fans drop out one ceiling at a time, and between two ceilings a higher price only earns more. So **the best price is always one of the ceilings**. For each L there are at most 2N candidates instead of 9,999 prices. Evaluating each candidate is O(N), which gives O(N³) overall, instant for N ≤ 100.

## Checking it

[`simulate.ts`](simulate.ts) is the brute force the task warns about, and it's perfect for testing. For every position and every price, it builds the row and walks every fan along it exactly as the story says. It shares no logic with the ceiling argument. [`check.ts`](check.ts) requires the official answer **and** agreement with the simulation.

## The example in the task looks wrong

For the example (prices `73 418 126 905 200`, shares `23 11 49 16 1`), the task says the answer is **`2 199`**. But at position 2 nobody can buy at 199. Left-to-right fans pass the 73 first, and right-to-left fans pass the 126 first. Both the program and the brute-force simulation find **`4 200`**: between 905 and 200, right-to-left fans with K = 2 or 3 buy there, for an expected revenue of 60.0. Other readings of the rules (ties always lost, 0-based positions, …) don't produce `2 199` either. For the real input, all of them agree with the official result.

## Answer

**`1 6`**: after the first stall, at price 6. The country is **Spain** (the Spanish Grand Prix in Barcelona).
