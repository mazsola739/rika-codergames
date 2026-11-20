# Az Arany Karom

**CoderGames 2024 · 3. feladat** · szimuláció, moduláris aritmetika · ország: **Görögország**

## A feladat

A delphoi templomban egy kőajtó csak akkor nyílik ki, ha egy oszlopokból álló piramis ugyanazokat a lapokat mutatja, mint az ajtón lévő rajz. Minden oszlopnak *m* lapja van (2 < m < 10). Ha egy oszlopot elforgatunk, **az alatta lévő két oszlop** is ugyanúgy elfordul, azok pedig az alattuk lévőket forgatják, egészen le az aljáig. A nagyjából 100 piramis mindegyikére (legfeljebb 210 oszloppal) add meg minden oszlop kézi forgatását.

Példa (m = 4): `2 / 1 1 / 3 3 2`-ből `1 / 2 1 / 3 1 0`-ba az egyik válasz `[-1, 2, 1, 3, 1, -2]`.

## Az ötlet

Figyeljük meg, hogy a középső oszlopokhoz **több** út is vezet: a példában a legfelső oszlop forgatása kétszer mozdítja meg a 3. sor középső oszlopát. Ha minden továbbgyűrűzést szó szerint követünk, az drága lesz. Gondoljunk inkább minden oszlop **teljes** forgatására:

> összes(i, j) = kézi(i, j) + összes(i−1, j−1) + összes(i−1, j)

Vagyis a saját forgatása, plusz ami a közvetlenül fölötte lévő (legfeljebb két) oszlopból érkezik. Egy oszlopra csak a **fölötte** lévők hatnak. Haladjunk tehát **soronként felülről lefelé**: minden oszlopnál már tudjuk, mi érkezik fölülről, és a szükséges teljes forgatás (cél − kezdő) mod m. A kézi forgatás a különbség, mod m. Egyetlen menet, O(n), és sosem kell visszacsinálni egy döntést.

Egy 4 lapú oszlopon a +3-as és a −1-es forgatás ugyanaz, így sok válasz helyes (a hivatalos válaszok vegyesen használják mindkettőt). A program minden oszlophoz a **legrövidebb** forgatást írja ki, −m/2 és m/2 között.

## Ellenőrzés

A [`check.ts`](check.ts) nem a fenti képletet használja. Minden kézi forgatást **pontosan úgy játszik vissza, ahogy a történet leírja**, rekurzív továbbgyűrűzéssel mindkét alsó oszlopra, és ellenőrzi, hogy a végső piramis egyezik-e a rajzzal. Néhány piramisban m = 2 vagy m = 10, ami kívül esik a megadott határokon. A szervezők elfogadták az erre rámutató válaszokat, a program pedig bármilyen m-et kezel.

## Válasz

Piramisonként egy lista, például `[1, -1, 0, 1, 0, -1]`, `[1, -1, -1, 1, -1, 1]`, `[2, -2, 1]`, … Az ország: **Görögország** (Delphoi).
