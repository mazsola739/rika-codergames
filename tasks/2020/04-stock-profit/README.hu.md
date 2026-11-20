# A holnapi részvényárak

**CoderGames 2020 · 4. feladat** · egy menet, nagy egészek, adatfolyam

## A feladat

Miloš álmában letölti a holnapi Apple-részvényárfolyamot minden tized másodpercre. Egyetlen vételi és egy későbbi eladási megbízást adhat le. Az összes árpár összehasonlítása (nagyjából 400 milliárd pár) nem ért véget a bank zárásáig. Keresd meg a legjobb vétel–eladás párt **egyetlen menetben**. Eladni nem lehet a vétel előtt. Az árak előjel nélküli 64 bites egészek, és a fájlban 10 millió van belőlük (204 MB).

## Az ötlet

Menj végig egyszer az árakon, és jegyezz meg két dolgot:

- az **eddigi legalacsonyabb árat**, vagyis a legjobb pillanatot a vételre, és
- az **eddigi legjobb nyereséget**: az aktuális ár mínusz az eddigi legalacsonyabb ár, ha ez jobb az eddigi legjobbnál.

A legjobb ügylet általában nem az, hogy „vegyél a globális minimumon, adj el a globális maximumon”, mert a maximum jöhet a minimum előtt is. A szervezők szerint ez volt a leggyakoribb rossz válasz.

## Gyorsan JavaScriptben

Az árak 2⁶⁴-ig mennek, a JavaScript `number` viszont csak 2⁵³-ig pontos. A `BigInt` működne, de 10 milliót létrehozni belőle lassú, és az is, ha a 204 MB-ot egyetlen szövegként töltjük be és daraboljuk fel. Ehelyett a program:

- 16 MB-os darabokban olvassa a fájlt, és bájtonként dolgozza fel a számjegyeket,
- minden árat két pontos számként tárol: `hi · 10¹⁰ + lo`,
- ezeket a párokat közvetlenül hasonlítja össze és vonja ki egymásból.

Mind a 10 millió árat körülbelül 4 másodperc alatt feldolgozza.

## Futtatás

A bemenet túl nagy a githez. Az `npm run fetch` letölti a CoderGames oldaláról.

## Válasz

- Vétel: **1282018114205**
- Eladás: **18446743764542202088**
