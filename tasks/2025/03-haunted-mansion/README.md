# Haunted mansion

**CoderGames 2025 · Task 3** · graphs, in-degree, breadth-first search

## The task

Tom has a map of a haunted mansion: 20,000 numbered rooms joined by one-way secret passages, with no way to walk in a circle. Some rooms (35 here) have vanished. A botched spell made a few more vanish: every room "connected to" at least two vanished rooms disappeared too, but only once, with no chain reaction. Answer three questions:

1. Which room is the **main entrance**? No passage leads into it.
2. How many rooms vanished **additionally** because of the spell?
3. How many rooms can still be reached from the entrance, including the entrance?

## The idea

Three small graph steps:

1. **Entrance = in-degree 0.** Count incoming passages for every room. Any room with none is a candidate entrance.
2. **The spell, in one round.** For each room that is still there, count how many of its passages lead to a vanished room. Two or more, and it vanishes. The check only looks at the first-round vanished rooms, so there's no chain reaction.
3. **Reachability** is a BFS from the entrance that never steps into a vanished room.

All of it is O(rooms + passages).

## Two ambiguities

- **What does "connected to" mean?** If passages in *both* directions count, 32 rooms vanish additionally. If only the room's *own* passages count (the ones leading out of it), it's 9, which matches the official answer and the task's example. The task's input format also describes each room by the passages it has *to* other rooms.
- **Which entrance?** This mansion has **four** rooms with no incoming passage: 6496, 7741, 15415 and 16841. The official answer lists all four results, and so does the program.

## Answer

| entrance | extra vanished | reachable |
|---|---|---|
| 6496 | 9 | 19953 |
| 7741 | 9 | 19950 |
| 15415 | 9 | 1348 |
| 16841 | 9 | 19952 |
