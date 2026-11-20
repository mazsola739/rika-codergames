# Roman numerals

**CoderGames 2022 · Task 4** · parsing, strings

## The task

Most numbers can be written with Roman numerals in several ways: 16 could be `IIIIIIIIIIIIIIII`, `VVIIIIII` or `XVI`, but only `XVI` uses the fewest symbols. Given 1000 numerals, some written badly, rewrite each in its shortest correct form.

## The idea

Don't patch the strings. Go through the number instead:

1. **Read the value.** Add up the symbols, but subtract a symbol that is smaller than the next one (the *I* in *IV*, the *X* in *XC*). This handles both good and bad input.
2. **Write it back the standard way.** Thousands become that many `M`s (there's no larger symbol, so 4000 is `MMMM`). Then each of hundreds, tens and ones comes from a ten-entry table that already uses the subtractive pairs `CM`, `CD`, `XC`, `XL`, `IX`, `IV`.

The organisers chose a solution that patched the strings with a series of `str_replace` calls (`IIIII` → `V`, `VV` → `X`, …). That's fragile: the order matters and it's easy to miss a case. Going through the value avoids that.

## Answer

The 1000 rewritten numerals in [`answer.txt`](answer.txt). They match the official list.
