// CoderGames 2022, task 3: sum of both diagonals of a 501x501 number spiral.
// Ring by ring: the ring of side n (odd) ends at n^2 in its top right corner, and the other three
// corners are n - 1 apart going backwards: n^2, n^2 - (n-1), n^2 - 2(n-1), n^2 - 3(n-1).
// Together that is 4n^2 - 6(n - 1). Add those for n = 3, 5, ..., 501, plus the 1 in the middle.
const SIZE = 501
let sum = 1
for (let n = 3; n <= SIZE; n += 2) sum += 4 * n * n - 6 * (n - 1)
console.log(sum)
