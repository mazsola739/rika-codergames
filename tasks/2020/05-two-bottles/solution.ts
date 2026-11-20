// CoderGames 2020, task 5: lowest floor of a 1000-floor building from which a bottle breaks,
// with only two bottles, in as few drops as possible in the worst case.
//
// With b bottles and d drops you can cover reach(b, d) floors: drop once, and either the bottle
// breaks (b - 1 bottles, d - 1 drops for the floors below) or it doesn't (b bottles, d - 1 drops
// for the floors above). So reach(b, d) = reach(b - 1, d - 1) + 1 + reach(b, d - 1).
const FLOORS = 1000
const BOTTLES = 2

const reach = (b: number, d: number): number => (b === 0 || d === 0 ? 0 : reach(b - 1, d - 1) + 1 + reach(b, d - 1))

let drops = 0
while (reach(BOTTLES, drops) < FLOORS) drops++

// The first bottle goes up in steps of drops, drops - 1, drops - 2, ... so that whenever it breaks,
// the second bottle can walk the floors in between, one by one, within the same total.
const floors: number[] = []
for (let floor = 0, left = drops; left > 0 && floor + left <= FLOORS; left--) {
  floor += left
  floors.push(floor)
}

console.log(drops)
console.log(floors.join(', '))
