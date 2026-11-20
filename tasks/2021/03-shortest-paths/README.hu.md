# Legrövidebb utak

**CoderGames 2021 · 3. feladat** · szélességi keresés, gráfok

## A feladat

Egy súlyozatlan élű irányított gráfban add meg minden csúcsra a legrövidebb út hosszát **egy** célcsúcsig. A csúcsok nevei szövegek (`A`, `hawk`, `206`). A csúcsokat ábécérendben írd ki, és `INF`-et, ha a cél nem érhető el. Négy gráf van: betűk, egy tápláléklánc (*grass → grasshopper → hawk*…), számok és zöldségek.

## Az ötlet

Ha minden csúcsból futtatnánk egy BFS-t, az működne, de pazarló. Ehelyett **fordítsuk meg az összes élt**, és futtassunk egyetlen BFS-t a célból *indulva*. Egy *v → … → cél* út az eredeti gráfban egy *cél → … → v* út a megfordítottban, így a BFS távolságai pont azok, amik kellenek. Amelyik csúcsot a BFS sosem éri el, az `INF`-et kap.

- Idő: gráfonként O(V + E).

Két részlet:

- A rendezés egyszerű karaktersorrend, így a `10` a `100` előtt van, a `100` a `11` előtt, a számjegyek pedig a betűk előtt. A várt kimenet is ezt a sorrendet használja.
- A feladatleírás szerint az első sorban egy darabszám áll, a fájl viszont rögtön az első céllal kezdődik. A program sorpáronként olvassa a fájlt (cél, éllista).

## Válasz

A négy távolságtáblázat az [`answer.txt`](answer.txt)-ben. Egyeznek a hivatalos eredményekkel.
