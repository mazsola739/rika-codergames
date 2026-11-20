# Római számok

**CoderGames 2022 · 4. feladat** · elemzés, szövegkezelés

## A feladat

A legtöbb szám többféleképpen is leírható római számokkal: a 16 lehet `IIIIIIIIIIIIIIII`, `VVIIIIII` vagy `XVI`, de csak az `XVI` használja a legkevesebb jelet. Adott 1000 római szám, némelyik rosszul leírva: írd át mindegyiket a legrövidebb helyes alakjára.

## Az ötlet

Ne a szöveget foltozgassuk, hanem menjünk az érték felől:

1. **Olvassuk ki az értéket.** Adjuk össze a jeleket, de vonjuk le azt, amelyik kisebb a következőnél (az *IV*-ben az *I*-t, az *XC*-ben az *X*-et). Ez jó és rossz bemenetre is működik.
2. **Írjuk vissza a szokásos módon.** Az ezresekből annyi `M` lesz (nagyobb jel nincs, így a 4000 `MMMM`). A százasok, tízesek és egyesek pedig egy tízelemű táblázatból jönnek, amely már tartalmazza a kivonásos párokat: `CM`, `CD`, `XC`, `XL`, `IX`, `IV`.

A szervezők olyan megoldást választottak, amely `str_replace` hívások sorozatával foltozta a szöveget (`IIIII` → `V`, `VV` → `X`, …). Ez törékeny: számít a sorrend, és könnyű kihagyni egy esetet. Az érték felől haladva ez elkerülhető.

## Válasz

Az 1000 átírt szám az [`answer.txt`](answer.txt)-ben. Egyeznek a hivatalos listával.
