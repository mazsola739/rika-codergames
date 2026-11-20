# Shortest paths

**CoderGames 2021 · Task 3** · breadth-first search, graphs

## The task

For a directed graph with unweighted edges, find the length of the shortest path **to** one target vertex from every other vertex. Vertex names are strings (`A`, `hawk`, `206`). Print the vertices in alphabetical order, with `INF` if the target can't be reached. There are four graphs: letters, a food chain (*grass → grasshopper → hawk*…), numbers and vegetables.

## The idea

Running a BFS from every vertex would work, but it's wasteful. **Reverse every edge** and run a single BFS *from* the target instead. A path *v → … → target* in the original graph is a path *target → … → v* in the reversed one, so the BFS distances are exactly what we need. Vertices that BFS never reaches get `INF`.

- Time: O(V + E) per graph.

Two details:

- The ordering is plain character order, so `10` comes before `100`, `100` before `11`, and digits before letters. The expected output uses the same order.
- The task description mentions a count on the first line, but the file starts directly with the first target. The program reads the file as pairs of lines (target, edge list).

## Answer

The four distance tables in [`answer.txt`](answer.txt). They match the official results.
