# A fairy tale

**CoderGames 2023 · Task 2** · cryptography, Vigenère cipher, index of coincidence

## The task

A fairy tells little Ann a bedtime story, but "the fairies' language is encrypted with a password". The input is 763 capital letters with no spaces. Decrypt it and name the fairy tale.

## What kind of cipher?

"Encrypted with a password" points to the **Vigenère cipher**: the *i*-th letter is shifted by the *i*-th letter of a key word, and the key repeats. A single letter like *E* comes out differently depending on its position, so plain frequency analysis doesn't work on the whole text.

## Breaking it in two steps

**1. Find the key length with the index of coincidence.** The *index of coincidence* (IoC) is the probability that two letters picked at random from a text are the same. For English it's about **0.066**. For random letters it's 1/26 ≈ **0.038**. If we guess key length *k* and split the text into *k* columns (every *k*-th letter), then with the right *k* each column is ordinary English shifted by one fixed amount, and shifting doesn't change the IoC. The program tries *k* = 1, 2, 3, … and takes the first *k* whose columns average above 0.06. Multiples of the right length would pass too, which is why it takes the smallest.

**2. Break each column like a Caesar cipher.** For each column, try all 26 shifts and keep the one whose letter counts are closest to English letter frequencies (smallest **χ²** distance).

The key comes out as **`SUPERHESLO`**, Slovak for "super password", and the text begins:

> TWO SWINDLERS ARRIVE AT THE CAPITAL CITY OF AN EMPEROR WHO SPENDS LAVISHLY ON CLOTHING…

That's the summary of Hans Christian Andersen's **The Emperor's New Clothes**.

## Answer

**The Emperor's New Clothes** (the official answer calls it *The Emperor's New Suit*, in Slovak *Cisárove nové šaty*). Vigenère cipher, key `SUPERHESLO`.
