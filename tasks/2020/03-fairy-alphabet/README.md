# The fairies' alphabet

**CoderGames 2020 · Task 3** · cryptography, frequency analysis, hill climbing

## The task

A fairy tells little Anna a bedtime story in the fairies' own alphabet: an English text, about 230 words long, in which every letter was replaced by another letter. What is the name of the fairy tale?

## Breaking a substitution cipher

There are 26! possible keys, so trying them all is out of the question. But English is very predictable, and that's what the program uses:

1. **Letter frequencies.** The most common cipher letter is probably *e*, then *t*, *a*, *o*… That first guess gives a key that reads as gibberish, but it's a starting point.
2. **A score for "looks like English".** For every word of the decrypted text, the program adds up how likely each pair of neighbouring letters is (*th*, *he*, *an* are common, *qz* never happens), and gives a bonus for every real English word. The pair statistics come from a list of about 300 ordinary English words. This matters: a score that only counts whole words gives the search nothing to climb for a long time, and it got stuck reading *man* for *the*.
3. **Hill climbing with restarts.** The program tries swapping two letters of the key and keeps the swap if the score goes up, until no swap helps. Then it shakes the best key a little and climbs again, 40 times, and keeps the best key it found.

In under a second the text reads cleanly: *"Then the bird threw down a much more beautiful dress than on the preceding day…"*. That's the second ball scene from the Brothers Grimm's **Cinderella**. The program picks the title as the long, non-everyday word that comes up most often in the text.

The hardest part was j, q, x and z: each appears only once in the text, so their statistics are weak. For example, *squirrel* and *jumped* came out as *sjuirrel* and *qumped* until the word list included a few ordinary words with those letters, such as *quite*, *square* and *jump*.

## Checking it

[`check.ts`](check.ts) decrypts the text with the key from the organisers' own published solution and requires the program's text to match it letter for letter.

## Answer

**Cinderella**
