# From rookie to Formula 1

**CoderGames 2026 · Task 3** · graphs, topological order, path counting · country: **Hungary**

## The task

A driver's career is a directed acyclic graph of trainings and races. Node 1 is the complete beginner and node N the Formula 1 professional. Count the different paths from 1 to N. The count may not fit in 32 bits. The input has 50 nodes and 962 edges. Country hint: the first three winners at "our track" were Nelson Piquet, Nelson Piquet and Ayrton Senna.

## The idea

Listing paths is hopeless: there are trillions. **Counting** them is easy with dynamic programming in **topological order**:

- ways[1] = 1,
- every edge a → b adds ways[a] to ways[b],
- process the nodes in an order where every edge goes forward (Kahn's algorithm: repeatedly take a node with no unprocessed incoming edges), so ways[a] is final before its edges are used.

O(N + M). The counts are `BigInt`s, so even far larger graphs can't overflow.

## The country

Nelson Piquet won the first two **Hungarian Grands Prix** at the Hungaroring (1986, 1987), and Ayrton Senna the third (1988).

## Answer

**4768729922192** paths. The country is **Hungary**.
