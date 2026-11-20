# The Lunar Codex treasure

**CoderGames for Women 2025 · Task 3** · cryptography, Caesar cipher, frequency analysis · country: **Greece**

## The task

An encrypted message from the archives of the Minoan civilisation hides the way to an artifact. The hints say the order "used multiple shifts within the same message", that the first value relates to a lunar cycle, that each decrypted part contains a clue to the next, and that frequency analysis helps. Find all the keys, decrypt the message and name the country.

## What the cipher is

The example `phtajvbuavutl → iamtcountonme` ("I am 7, count on me") is a **Caesar shift** of 7. The message is a poem whose **stanzas each use a different shift**, and nothing marks where one stanza ends and the next begins.

## The idea

1. **Score every line under all 26 shifts**: the log-likelihood of its letters under English letter frequencies.
2. **Don't just pick the best shift per line.** Short lines are noisy: *"Mount Olympus, proud and tall"* scores better with a wrong shift, and came out as *"Fhngm Herfinl, ikhnw tgw mtee"*. Instead, choose the shifts for **all lines together** with a small dynamic program, Viterbi-style: the total score is the sum of the line scores **minus a penalty every time the shift changes** between two lines. Stanzas then stay whole and the noisy line follows its neighbours.
3. The shifts of the stanzas are the keys.

The keys come out as **4, 7, 16, 2**. The poem moves from Selene and Mount Olympus to Socrates and the hemlock cup, the Perseids, and finally the Minoan palace of Knossos.

## Answer

Keys 4, 7, 16, 2. The decrypted poem is in [`answer.txt`](answer.txt). The country is **Greece**.
