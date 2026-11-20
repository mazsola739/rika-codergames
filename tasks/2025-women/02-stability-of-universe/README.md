# Stability of the universe

**CoderGames for Women 2025 · Task 2** · grids, torus, symmetry

## The task

The universe is a 200 × 200 grid of numbers on the surface of a sphere, really a **torus**: the last column is next to the first, and the last row next to the first. A **gravitational centre** is a cell *P* whose value is strictly larger than the 16 values on its four axes at distance 1 and 2:

```
x2'  .   a2  .   y2
 .  x1'  a1  y1  .
b2' b1'  P   b1  b2
 .  y1'  a1' x1  .
y2'  .   a2' .   x2
```

A centre is **stable** if every axis is balanced: a1 = a1′, a2 = a2′, and the same for b, x and y. Count the stable and the unstable centres.

## The idea

Only the 16 axis cells matter, and the pairs (a1, a1′), (b2, b2′), … are mirror images through *P*. So list **half** of the directions, (−1, 0), (−2, 0), (0, 1), (0, 2), (1, 1), (2, 2), (−1, 1), (−2, 2), and use each direction *d* together with its opposite −*d*:

- **centre:** P > value(P + d) and P > value(P − d) for all 8 directions,
- **stable:** value(P + d) = value(P − d) for all 8 directions.

The wrap-around is just indexes taken modulo the grid size (with care for negative numbers). One pass over the 40,000 cells, 16 lookups each.

## Answer

**31 stable, 21 unstable** (`31 21`).
