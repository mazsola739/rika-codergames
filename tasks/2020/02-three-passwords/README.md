# Three passwords

**CoderGames 2020 · Task 2** · logic, brute force

## The task

Isabella writes her password on three face-down notes: two show the right password and one shows a wrong one. Paul may point at one note and ask a single yes/no question. If he points at a right note, she answers truthfully. If he points at the wrong note, she answers at random.

1. Which note should Paul point at, and what should he ask, so that he is certain to find the password?
2. Are the two behaving safely?
3. (Not scored) Share your best trick for remembering passwords.

## The idea

The answer you get **while pointing at the wrong note** is worthless. But if you point at the wrong note, both other notes are right. So:

> Point at one note, ask about **another** note ("is that one right?"), and take one of the two notes you are **not** pointing at, depending on the answer.

- If you point at the wrong note: the answer is random, but you take one of the other two notes, and both are right.
- If you point at a right note, the answer is true. "Yes" means the note you asked about is right. "No" means it's the wrong one, so you take the third note.

## The program

[`solution.ts`](solution.ts) doesn't trust the reasoning above. It tries all 81 strategies ("point at *p*, ask about *q*, take *a* on yes and *b* on no") against every position of the wrong note and every random answer. Exactly 6 strategies always work, and they are all the same idea: point at any note, ask about another one, and take one of the two notes you are not pointing at.

## Answer

1. For example: point at the **middle** note and ask *"Is the left note the right password?"* Yes → take the left note, no → take the right one.
2. **No.** Don't hand out your password in a riddle, and don't write passwords on paper.
3. The organisers' advice: don't use a dictionary word (like a horse's name), because dictionary words are tried first.
