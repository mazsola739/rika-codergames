# Tourist rescue net

**CoderGames 2023 · Task 4** · graphs, longest path, backtracking, Warnsdorff's rule

## The task

A family is lost at one of the tourist spots around Charmington. The rescue team wants a route that visits **as many spots as possible, each at most once**, starting anywhere. The trails (pairs of spots) can be walked both ways. Print the number of spots visited and the route. The network has 100 spots and 361 trails.

## Why this is hard, and why it isn't here

This is the **longest simple path** problem. It's NP-hard: no known algorithm solves every graph quickly, and if a path through *all* spots exists, it's a Hamiltonian path. Brute force is hopeless on 100 nodes.

But real inputs are friendlier than the worst case. A depth-first search with backtracking and a good **move order** finds a path through all 100 spots almost instantly:

- **Warnsdorff's rule** (known from the knight's tour): always move next to the neighbour with the **fewest unvisited neighbours**. Points that are hard to reach get used before the route cuts them off.
- **Start at a low-degree point.** A point with few trails is likely to be an end of the path anyway.
- **Backtrack** when stuck, remember the longest path seen, and stop early once all 100 spots are on the path, since nothing can beat that. A 10-second budget guards against bad inputs.

## Checking it

Many routes are equally good. [`check.ts`](check.ts) checks that every step is a real trail, the route is connected, no spot appears twice, and the length equals the official one.

## Answer

**100** spots, so every spot is visited. One route starts `(3, 24), (24, 58), (58, 55), …`. The official route is a different one with the same length.
