# CCTV

**CoderGames 2024 · Task 5** · circular arrays, independent axes · country: **Spain**

## The task

A security guard at a Mercadona supermarket watches camera feeds in an h × w grid of screen cells. The arrow buttons shift **every** image one cell left, right, up or down, wrapping around at the edges. *Compactness* is the area of the smallest rectangle that contains all images. Find the minimum compactness and the fewest button presses that achieve it. Searching all shift combinations is possible, but the task asks for something better.

## The idea

Two observations make it easy:

1. **Rows and columns are independent.** Up/down only changes row numbers, left/right only column numbers, and the area is *(rows spanned) × (columns spanned)*. The minimum area needs both spans to be minimal, so each axis can be solved on its own and the press counts added.
2. **Each axis is a circle.** The occupied rows split the circle of *h* rows into gaps of empty rows. Cut the circle at the **largest gap** and what remains is the shortest block covering all images: **span = h − largest gap**.

The block must then end up **not wrapping** around the screen edge. Its start has to land in 0 … h − span, and the presses needed are the circular distance from its current start to the nearest such position, which is 0 if it already fits. When several gaps tie for largest, take the one needing the fewest presses.

Example: a 3 × 4 grid with images at (1, 1), (3, 4), (1, 4). Rows {1, 3} on a circle of 3: span 2, needs 1 press. Columns {1, 4} on a circle of 4: span 2, needs 1 press. So compactness **4** with **2** presses.

## Answer

`4; 2` and `6; 0`. The country is **Spain** (Mercadona).
