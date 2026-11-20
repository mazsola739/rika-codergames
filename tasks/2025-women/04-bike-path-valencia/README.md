# Bike path in Valencia during Las Fallas

**CoderGames for Women 2025 · Task 4** · Dijkstra, time-dependent shortest path · country: **Spain**

## The task

During Las Fallas in Valencia some streets close at certain times. You ride a shared bike from station 1 to station N, starting at time T (minutes after midnight). Each road takes a fixed number of minutes and has a list of closed intervals [s, e). If a road is closed when you want to use it, you wait until it reopens. What is the earliest possible arrival? There are six sets, from "simple" to "extreme".

## The idea

This is **Dijkstra's algorithm on arrival times** instead of distances. Normally a road's cost depends on the time you reach it, which breaks shortest-path algorithms. Here it doesn't, because **waiting is allowed**: reaching a station earlier can never make you arrive anywhere later, since you could always wait. That's the *FIFO property*, and with it Dijkstra stays correct:

- take the unfinished station with the earliest arrival time,
- for each road out of it: departure = the first moment at or after arrival when the road is open, arrival at the other end = departure + travel time,
- stop when station N is taken (or print `−1` if it's unreachable).

The stations are few, so the program uses the simple O(N²) version of Dijkstra without a heap.

## A detail the example gets wrong

What does "closed at your intended time of travel" mean: closed when you **set off**, or closed at **any moment of the ride**? The example says the 1 → 2 closure from 110 to 130 "would force a wait" for a ride starting at 100 (arriving at 120). That suggests the whole ride counts. But with that rule, set 3 comes out as 105, while the official answer is **90**. Only "the road must be open when you set off" reproduces all six official results, so that's what the program does. In set 1 the answer is 145 either way.

## Answer

145, 90, 90, 305, 145, 105. The country is **Spain**.
