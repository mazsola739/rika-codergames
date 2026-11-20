# Buggy's master password

**CoderGames 2023 · Task 1** · strings, parsing

## The task

Buggy locked himself out and needs his master password. He only kept a list of coordinates like `{3,1},{3,3},{3,0},…` into an 8 × 8 character matrix. The matrix holds `0–9`, then `a–z`, then `A–Z`, then `,` and `.`.

1. Look up each coordinate (row, column, counting from 0). This spells words separated by commas.
2. Join the words: if the end of a word matches the beginning of the next one (**ignoring case**), drop the matching part from the **next** word. `lemON` + `onion` → `lemONion`.
3. Report the password, how many characters were removed (separators don't count), and the longest removed piece (keeping its case).

Example: `apple, lemon, onion` → `applemonion`. Removed `le` and `on`, so 4 characters, and the longest is `le`.

## The idea

- **Lookup:** character = `matrix[row · 8 + col]`. A regular expression reads the pairs, so spacing in the file doesn't matter.
- **Overlap of two words:** the largest *k* such that the last *k* letters of the first word equal the first *k* letters of the second, both lowercased. The program tries *k* from the longest possible downwards and stops at the first match.
- The removed part is taken from the **second** word, as given (case kept), and added to a list. The longest piece is the first one of maximum length.

The words are short, so the simple O(length²) overlap test is plenty.

## Answer

- Password: `proGrammErasERaCeColuMnemonIcEbrEAker…P4SSw0RdPassWorDerPassWorTiCal` (see [`answer.txt`](answer.txt) for the full 400+ characters)
- Removed characters: **92**
- Longest removed string: **`pAssWorD`**
