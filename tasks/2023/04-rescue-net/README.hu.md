# Turistamentő háló

**CoderGames 2023 · 4. feladat** · gráfok, leghosszabb út, visszalépéses keresés, Warnsdorff-szabály

## A feladat

Egy család eltévedt Charmington környékének egyik turistalátványosságánál. A mentőcsapat olyan útvonalat keres, amely **a lehető legtöbb pontot érinti, mindegyiket legfeljebb egyszer**, és bárhonnan indulhat. Az ösvények (pontpárok) mindkét irányban bejárhatók. Írd ki a meglátogatott pontok számát és az útvonalat. A hálózatban 100 pont és 361 ösvény van.

## Miért nehéz ez, és miért nem az itt?

Ez a **leghosszabb egyszerű út** problémája. NP-nehéz: nincs olyan ismert algoritmus, amely minden gráfot gyorsan megoldana, és ha létezik *az összes* ponton átmenő út, az egy Hamilton-út. 100 csúcson a nyers erő reménytelen.

A valódi bemenetek azonban barátságosabbak a legrosszabb esetnél. Egy visszalépéses mélységi keresés jó **lépéssorrenddel** szinte azonnal talál mind a 100 ponton átmenő utat:

- **Warnsdorff-szabály** (a huszárugrás-feladványból ismert): mindig ahhoz a szomszédhoz lépj tovább, amelynek a **legkevesebb meglátogatatlan szomszédja** van. A nehezen elérhető pontok így előbb sorra kerülnek, mint hogy az útvonal elvágná őket.
- **Indulj kis fokszámú pontból.** Egy kevés ösvényű pont valószínűleg amúgy is az út egyik vége.
- **Lépj vissza**, ha elakadsz, jegyezd meg az eddigi leghosszabb utat, és állj meg korán, ha mind a 100 pont rajta van az úton, mert ennél jobb nem lehet. Egy 10 másodperces időkeret véd a rossz bemenetek ellen.

## Ellenőrzés

Sok egyformán jó útvonal van. A [`check.ts`](check.ts) ellenőrzi, hogy minden lépés valódi ösvény, az útvonal összefüggő, egy pont sem szerepel kétszer, és a hossza egyenlő a hivatalossal.

## Válasz

**100** pont, tehát mindegyiket meglátogatjuk. Az egyik útvonal így kezdődik: `(3, 24), (24, 58), (58, 55), …`. A hivatalos útvonal egy másik, ugyanilyen hosszú út.
