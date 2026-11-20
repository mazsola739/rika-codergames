# Islands and bridges

**CoderGames 2022 · Task 5** · flood fill, minimum spanning tree, union-find

## The task

A map is a grid of `1` (land) and `0` (water). An island is a group of land cells connected horizontally or vertically. Connect **all** islands with bridges, using as little material as possible:

- a bridge is a straight horizontal or vertical line of 1, 2 or 3 water cells between two islands,
- every bridge cell costs one unit of material,
- bridges may cross (the crossing cell costs 2, one for each bridge).

Print the material needed, or `-1` if the islands can't all be connected. The input has 103 maps, up to 100 × 100.

## The idea

Crossings are allowed, so bridges never get in each other's way, and the problem turns into a graph problem:

1. **Find the islands** with a flood fill. Each island becomes a node.
2. **List every possible bridge.** From each land cell, look right and down: skip 1–3 water cells, and if you land on a different island, that's an edge, weighted by the number of water cells.
3. **Connect everything as cheaply as possible.** That's a **minimum spanning tree**. Kruskal's algorithm sorts the bridges by length and takes each one that joins two not-yet-connected groups, tracked with a union-find. If it ends with more than one group, the answer is `-1`.

With *k* candidate bridges this is O(cells + k log k).

## The official answers have a bug

My answers matched the official ones on only **10 of the 103 maps**. The organisers published their Python solution, and it explains why. Its flood fill checks neighbours like this:

```python
try:
    if neighbour not in map and grid[n_row][n_col] == "1":
        ...
except IndexError:
    pass
```

The `try/except IndexError` is meant to catch neighbours outside the map. That works past the bottom and right edges. But above the top edge `n_row` is `-1`, and in Python `grid[-1]` doesn't fail: it's the **last row**. The same happens with `-1` for the left edge. So the flood fill leaves the map through the top or left edge, continues on a "copy" of the bottom or right edge, and can come back in somewhere else. Islands that are far apart get merged, and the result needs fewer bridges than it should.

A 3 × 3 example:

```
101      three islands: the two top cells and the bottom row
000      correct answer: 2 (two bridges of length 1)
111      official program: 1 (it thinks the two top cells are one island)
```

To be sure this is the only difference, [`official.ts`](official.ts) is a line-by-line port of the published program with a switch for Python's negative indexing:

- **with** Python's behaviour, it reproduces **all 103** published answers exactly;
- **without** it (`-1` treated as outside the map), it agrees with [`solution.ts`](solution.ts) on **all 103** maps.

[`check.ts`](check.ts) verifies both. One more detail: when a map has no land at all, the official program prints `-1`. My solution follows that convention.

## Answer

The 103 results in the output of `npm run solve -- 2022/5`. The published (buggy) ones are in [`answer.txt`](answer.txt).
