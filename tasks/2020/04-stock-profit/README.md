# Tomorrow's stock prices

**CoderGames 2020 · Task 4** · single pass, big integers, streaming

## The task

In a dream, Miloš downloads tomorrow's Apple share price for every tenth of a second. He may place one buy order and one later sell order. Comparing every pair of prices (around 400 billion pairs) didn't finish before the bank closed. Find the best buy/sell pair **in a single pass**. You can't sell before you buy. The prices are unsigned 64-bit integers, and the file has 10 million of them (204 MB).

## The idea

Walk through the prices once and remember two things:

- the **lowest price so far**, the best moment to have bought, and
- the **best profit so far**: the current price minus that lowest price, if it beats the previous best.

The best trade usually isn't "buy at the global minimum, sell at the global maximum", because the maximum may come before the minimum. The organisers noted this was the most common wrong answer.

## Making it fast in JavaScript

The prices go up to 2⁶⁴, but a JavaScript `number` is only exact up to 2⁵³. `BigInt` would work, but creating 10 million of them is slow, and so is loading 204 MB as one string and splitting it. Instead, the program:

- reads the file in 16 MB chunks and parses the digits byte by byte,
- stores each price as two exact numbers, `hi · 10¹⁰ + lo`,
- compares and subtracts those pairs directly.

It handles all 10 million prices in about 4 seconds.

## Running it

The input is too big for git. `npm run fetch` downloads it from the CoderGames site.

## Answer

- Buy at **1282018114205**
- Sell at **18446743764542202088**
