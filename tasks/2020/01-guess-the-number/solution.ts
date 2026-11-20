// CoderGames 2020, task 1: which number is Michal thinking of?
// Peter knows the first digit, Janka the second. Each statement removes candidates.
const numbers = [13, 14, 22, 23, 32]
const first = (n: number) => Math.floor(n / 10)
const second = (n: number) => n % 10
const sameFirst = (pool: number[], n: number) => pool.filter((m) => first(m) === first(n))
const sameSecond = (pool: number[], n: number) => pool.filter((m) => second(m) === second(n))

// Janka can name the number straight away only if her digit appears once.
const jankaKnowsAtOnce = (n: number) => sameSecond(numbers, n).length === 1

// Peter: "I know Janka can't tell." True only if no number with his digit is one Janka could pin down.
const afterPeter = numbers.filter((n) => sameFirst(numbers, n).every((m) => !jankaKnowsAtOnce(m)))

// Janka: "I didn't know, but now I do." Her digit was ambiguous before and is unique after Peter spoke.
const afterJanka = afterPeter.filter((n) => !jankaKnowsAtOnce(n) && sameSecond(afterPeter, n).length === 1)

console.log(afterJanka.join('\n'))
