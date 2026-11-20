# Éjféli szellemek

**CoderGames 2025 · 4. feladat** · dinamikus programozás, minimális útösszeg

## A feladat

Éjfélkor szellemek lepik el az utcákat, és Dominak a legbiztonságosabb úton kell hazajutnia. A térkép veszélyértékekből álló rács. A bal felső saroktól a jobb alsóig kell eljutni, csak **jobbra vagy lefelé** lépve, úgy, hogy a teljes veszély a lehető legkisebb legyen. Írd ki az összeget és az út celláit. A bemenetben nyolc térkép van, legfeljebb 20 × 20-asak.

## Az ötlet

Egy cellába vezető minden út vagy fölülről, vagy balról érkezik, ezért:

> legjobb[r][c] = veszély[r][c] + min(legjobb[r−1][c], legjobb[r][c−1])

A táblázatot soronként töltjük ki, egy menetben, O(sorok × oszlopok) alatt, és minden cellánál megjegyezzük, melyik szomszéd nyert. Ezeket a döntéseket a jobb alsó sarokból visszafelé követve megkapjuk az utat.

(Ha mind a négy irányba lehetne lépni, Dijkstra algoritmusa kellene. Az, hogy „csak jobbra vagy lefelé”, teszi elegendővé az egyszerű DP-t.)

## Ellenőrzés

Ha két szomszéd holtversenyben van, két különböző út is ugyanolyan biztonságos. A [`check.ts`](check.ts) minden olyan utat elfogad, amely bal fent indul, csak jobbra vagy lefelé lép, jobb lent ér véget, és az összege a hivatalos minimum.

## Válasz

7, 11, 5, 10, 20, 21, 38, 148, mindegyik a saját útjával.
