# Night of the living edges

**CoderGames 2025 · Task 2** · union-find, cycle detection, online queries

## The task

On Halloween night, ghostly corridors appear one by one between *N* haunted houses (up to 2·10⁵ houses and 2·10⁵ events). Corridors never disappear. After each `?`, report how many **connected components contain a cycle**. These are the cursed ones, the components that aren't trees.

## The idea

When edges are only ever **added**, a **union-find** (disjoint-set union) is the natural tool. Each set also gets one flag: *does this component already contain a cycle?*

- **Edge inside one set** (both ends already connected): it closes a cycle. If the set wasn't cursed yet, it is now: **+1**.
- **Edge between two sets**: merge them. The merged set is cursed if either part was. If **both** were cursed, two cursed components became one: **−1**.
- **`?`**: print the running count.

With path compression and union by size, each event costs practically O(1) (inverse Ackermann). Self-loops are ignored, as the task allows. Repeated corridors are handled automatically: the second copy is an edge inside one set, so it closes a cycle.

## Answer

28 numbers: 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6
