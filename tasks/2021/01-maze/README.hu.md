# Útvesztő

**CoderGames 2021 · 1. feladat** · szélességi keresés, rács

## A feladat

Eltévedtél egy útvesztőben, amely `.` (szabad) és `#` (szikla) cellákból áll, és az `S` cellán állsz. Keresd meg a legrövidebb utat a kijáratig (`E`), csak fel, le, balra vagy jobbra lépve. Írd ki az útvesztőt úgy, hogy az út minden `.` celláját `*`-ra cseréled, vagy azt, hogy `Trapped`, ha nincs kiút. A valódi útvesztő 49 × 39-es.

## Az ötlet

A **szélességi keresés (BFS)** a legrövidebb utak szokásos eszköze, ha minden lépés ugyanannyiba kerül. Gyűrűnként járja be az útvesztőt: először az `S`-től 1 lépésre lévő cellákat, aztán a 2 lépésre lévőket, és így tovább. Amikor tehát először ér el egy cellát, a lehető legkevesebb lépést használta. Ha minden cellánál azt is megjegyezzük, *honnan jöttünk*, akkor `E`-ből visszasétálhatunk `S`-ig egy legrövidebb úton, és bejelölhetjük.

- Idő: minden cellát egyszer látogatunk meg, tehát O(sorok × oszlopok).
- `Trapped`: ha a BFS kifogy a cellákból, mielőtt elérné `E`-t.

## Válasz

A bejelölt útvesztő az [`answer.txt`](answer.txt)-ben. Karakterről karakterre egyezik a hivatalos megoldással.
