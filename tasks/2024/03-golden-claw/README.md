# The Golden Claw

**CoderGames 2024 · Task 3** · simulation, modular arithmetic · country: **Greece**

## The task

In the Temple of Delphi, a stone door opens only when a pyramid of pillars shows the same faces as the sketch on the door. Each pillar has *m* faces (2 < m < 10). Turning a pillar also turns **the two pillars below it** the same way, and those turn the ones below them, all the way down. For each of about 100 pyramids (up to 210 pillars), give the manual turn for every pillar.

Example (m = 4): from `2 / 1 1 / 3 3 2` to `1 / 2 1 / 3 1 0`, one answer is `[-1, 2, 1, 3, 1, -2]`.

## The idea

Notice that pillars in the middle are reached by **several** paths: in the example, turning the top pillar moves the middle pillar of row 3 twice. Following every cascade literally gets expensive. Instead, think about each pillar's **total** turn:

> total(i, j) = manual(i, j) + total(i−1, j−1) + total(i−1, j)

That is, its own turn plus whatever arrives from the (up to two) pillars directly above it. A pillar is only affected by pillars **above** it. So go **row by row from the top**: for each pillar we already know what arrives from above, and the total it needs is (target − initial) mod m. Its manual turn is the difference, mod m. One pass, O(n), and there's never a choice to undo.

Turning by +3 and by −1 is the same on a 4-faced pillar, so many answers are correct (the official answers mix both). The program prints the **shortest** turn for each pillar, between −m/2 and m/2.

## Checking it

[`check.ts`](check.ts) doesn't use the formula above. It replays every manual turn **exactly as the story describes it**, with a recursive cascade down both pillars below, and checks that the final pyramid matches the sketch. Some pyramids have m = 2 or m = 10, outside the stated limits. The organisers accepted answers that pointed this out, and the program handles any m.

## Answer

One list per pyramid, for example `[1, -1, 0, 1, 0, -1]`, `[1, -1, -1, 1, -1, 1]`, `[2, -2, 1]`, … The country is **Greece** (Delphi).
