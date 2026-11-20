# Gyémántösszeg

**CoderGames 2024 · 2. feladat** · matematika, zárt képlet, nagy egészek · ország: **Magyarország**

## A feladat

Egy N × N-es rácsot (N páratlan) soronként feltöltünk az 1, 2, …, N² számokkal. A **gyémántösszeg** annak a gyémántnak (rombusznak) a mentén álló számok összege, amelynek csúcsai a négy oldal felezőpontjai. N = 5 esetén:

```
 1  2 [3] 4  5
 6 [7] 8 [9]10
[11]12 13 14[15]
16[17]18[19]20
21 22[23]24 25      3+7+9+11+15+17+19+23 = 104
```

Számold ki 987 654 321-gyel vett maradékként, N akár **10¹⁸** is lehet. Az ország nyoma a kontinentális Európa első földalatti vasútja, amely 1896-ban nyílt meg: a budapesti Millenniumi Földalatti.

## Az ötlet

10¹⁸ mellett szóba sem jöhet ciklus, képlet kell. Legyen m = (N − 1)/2 a középső index. Az *r*-edik sor *c*-edik oszlopában r·N + c + 1 áll.

- A **felső és az alsó sor** egyszer érinti a gyémántot, a középső oszlopban: (m + 1) és N(N − 1) + m + 1.
- **Minden más sor** kétszer érinti, az m − d és az m + d oszlopban. Ezek oszlopszáma összesen 2m, így az a sor 2(rN + 1 + m)-et ad hozzá.

Ezt r = 1 … N − 2-re összegezve és egyszerűsítve (2m = N − 1):

> **gyémánt(N) = (N − 1)(N² + 1)**

Ellenőrzés: N = 5 → 4 · 26 = 104 ✓. A program `BigInt`-tel számolja ki, minden tényezőt 987 654 321-gyel vett maradékra redukálva.

## A hibás bemenet

Az eredeti bemeneti fájlban 1000, 1000000 és 10000000000000 állt: mind **páros**, így nincs középső cella és nincs gyémánt. A szervezők törölték a feladatot, és mindenki teljes pontot kapott. Aztán közzétettek javított bemeneteket (137, 31415, 20241223) eredményekkel; az [`input.txt`](input.txt) ezeket használja. Az eredeti az [`input-original.txt`](input-original.txt)-ben maradt meg.

## Válasz

2552720, 77391374, 464692980. Az ország: **Magyarország**.
