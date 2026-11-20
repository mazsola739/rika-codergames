# Maze

**CoderGames 2021 · Task 1** · *Bludisko* · breadth-first search, grid

## The task

You're lost in a maze of `.` (free) and `#` (rock) cells, starting at `S`. Find the shortest way to the exit `E`, moving only up, down, left or right. Print the maze with every `.` on that path replaced by `*`, or `Trapped` if there's no way out. The real maze is 49 × 39.

## The idea

**Breadth-first search (BFS)** is the standard tool for shortest paths when every step costs the same. It explores the maze in rings: first the cells 1 step from `S`, then 2 steps, and so on. So the first time it reaches a cell, it has used the fewest steps possible. If we also remember *where we came from* for each cell, we can walk back from `E` to `S` along a shortest path and mark it.

- Time: every cell is visited once, so O(rows × columns).
- `Trapped`: if BFS runs out of cells without reaching `E`.

## Answer

The marked maze in [`answer.txt`](answer.txt). It matches the official solution character for character.
