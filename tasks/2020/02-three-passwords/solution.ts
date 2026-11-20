// CoderGames 2020, task 2: three face-down notes, two with the right password, one wrong.
// Point at one note and ask one yes/no question about a note. The answer is true if you point
// at a right note and random if you point at the wrong one. Which strategies always work?
//
// A strategy is: point at card p, ask "is card q the right password?", take card `onYes` or `onNo`.
// We try all 3^4 = 81 of them against every place the wrong note can be and every random answer.
const cards = [0, 1, 2]
const name = (c: number) => ['left', 'middle', 'right'][c]

const working: string[] = []
let tried = 0
for (const p of cards)
  for (const q of cards)
    for (const onYes of cards)
      for (const onNo of cards) {
        tried++
        const alwaysRight = cards.every((wrong) => {
          // Answers that can come back: the truth, or anything when pointing at the wrong card.
          const truth = q !== wrong
          const answers = p === wrong ? [true, false] : [truth]
          return answers.every((yes) => (yes ? onYes : onNo) !== wrong)
        })
        if (alwaysRight) {
          working.push(
            `point at ${name(p)}, ask "is ${name(q)} right?": yes -> take ${name(onYes)}, no -> take ${name(onNo)}`,
          )
        }
      }

console.log(working.join('\n'))
console.log(`${working.length} of ${tried} strategies always find a right password`)
