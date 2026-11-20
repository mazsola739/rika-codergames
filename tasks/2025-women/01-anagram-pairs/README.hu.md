# Anagrammapárok

**CoderGames for Women 2025 · 1. feladat** · szövegkezelés, számolás · ország: **Szlovákia**

## A feladat

Egy történetben, amely a Tátra, a pozsonyi vár és a szepesi vár között játszódik, Jankónak szópárokat kell ellenőriznie. Minden két kisbetűs szóból álló sorra írd ki, hogy `YES`, ha egymás **anagrammái** (ugyanazok a betűk, más sorrendben), és `NO`, ha nem. `listen silent` → `YES`. A bemenetben 35 pár van, köztük hosszúak is.

## Az ötlet

Mindkét szó rendezése és összevetése O(n log n) alatt működik. A számolás egyszerűbb, és lineáris:

- Ha eltér a hosszuk: rögtön `NO`.
- Különben tartsunk 26 számlálót. Az első szó minden betűjénél adjunk hozzá 1-et, a második szó minden betűjénél vonjunk le 1-et. Anagrammáknál minden számláló **nullán** marad.

Páronként O(hossz), egy fix, 26 elemű tömbbel.

## Válasz

Az ország: **Szlovákia**. A 35 eredmény az [`answer.txt`](answer.txt)-ben van. Két párnál, ahol az azonos szövegek „triviális” anagrammának számíthatnak, a szervezők mindkét választ elfogadták.
