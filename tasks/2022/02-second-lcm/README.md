# Divisible by 1 to 21

**CoderGames 2022 · Task 2** · math, least common multiple

## The task

2520 is the smallest number divisible by every number from 1 to 10. What is the **second** smallest positive number divisible by every number from 1 to 21?

## The idea

A number divisible by all of 1…21 is a common multiple of them, and every common multiple is a multiple of the **least common multiple (LCM)**. So the common multiples are exactly LCM, 2·LCM, 3·LCM, … and the second smallest is **2 · LCM(1, …, 21)**.

The LCM is computed with lcm(a, b) = a / gcd(a, b) · b over 1…21. It equals LCM(1…20) = 232,792,560, because 21 = 3 · 7 adds nothing new. No search is needed. The organisers' example solution counted upwards from 22 and tested every number, which takes about 465 million iterations.

## Answer

**465585120**
