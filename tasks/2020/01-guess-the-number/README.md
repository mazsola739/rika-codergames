# Guess the number

**CoderGames 2020 · Task 1** · logic

## The task

Michal reads out five numbers: 13, 14, 22, 23 and 32, then secretly picks one. He whispers its first digit to Peter and its second digit to Janka.

- Peter: "I know that Janka can't work out the number."
- Janka: "True, I didn't know it. But now I do."

Which number did Michal pick?

## How to think about it

Each statement is a filter on the five candidates. It's the same kind of puzzle as the famous "Cheryl's birthday" one.

1. **What can Janka know on her own?** The second digits are 3, 4, 2, 3, 2. Only 4 appears once. If Janka had heard 4, she would know straight away that the number is 14.
2. **Peter is sure Janka can't know.** So Peter's digit can't be one that could go with 14. If he had heard 1, the number could be 13 or 14, and he couldn't be sure. So his digit is 2 or 3, which leaves **22, 23 and 32**.
3. **Now Janka knows.** Among 22, 23 and 32, the second digit 2 still fits two numbers, but 3 fits only 23.

## The program

[`solution.ts`](solution.ts) writes each step as a filter over the list, the same way as above, so it would also work for a different set of numbers.

## Answer

**23**
