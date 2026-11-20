# Midnight spirits

**CoderGames 2025 · Task 4** · dynamic programming, minimum path sum

## The task

At midnight spirits fill the streets, and Domi needs the safest way home. The map is a grid of danger values. Go from the top-left corner to the bottom-right one, moving only **right or down**, so that the total danger is as small as possible. Print the total and the cells of the path. The input has eight maps, up to 20 × 20.

## The idea

Every path to a cell comes either from above or from the left, so:

> best[r][c] = danger[r][c] + min(best[r−1][c], best[r][c−1])

Fill the table row by row, one pass, O(rows × columns), and remember which neighbour won in each cell. Walking those choices back from the bottom-right corner gives the path.

(With moves in all four directions this would need Dijkstra's algorithm. "Right or down only" is what makes the simple DP enough.)

## Checking it

When two neighbours tie, two different paths are equally safe. [`check.ts`](check.ts) accepts any path that starts top left, only steps right or down, ends bottom right and adds up to the official minimum.

## Answer

7, 11, 5, 10, 20, 21, 38, 148, each with its path.
