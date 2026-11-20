# Osztható 1-től 21-ig

**CoderGames 2022 · 2. feladat** · matematika, legkisebb közös többszörös

## A feladat

A 2520 a legkisebb szám, amely 1-től 10-ig minden számmal osztható. Melyik a **második** legkisebb pozitív szám, amely 1-től 21-ig minden számmal osztható?

## Az ötlet

Egy szám, amely 1…21 mindegyikével osztható, ezek közös többszöröse, és minden közös többszörös a **legkisebb közös többszörös (LKKT)** többszöröse. A közös többszörösök tehát pontosan az LKKT, 2·LKKT, 3·LKKT, …, a második legkisebb pedig **2 · LKKT(1, …, 21)**.

Az LKKT az lkkt(a, b) = a / lnko(a, b) · b képlettel számolható 1…21-re. Az értéke megegyezik az LKKT(1…20) = 232 792 560-nal, mert a 21 = 3 · 7 semmi újat nem ad hozzá. Keresésre nincs szükség. A szervezők példamegoldása 22-től felfelé számolt, és minden számot kipróbált, ami nagyjából 465 millió lépés.

## Válasz

**465585120**
