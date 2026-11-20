# A tündérek ábécéje

**CoderGames 2020 · 3. feladat** · kriptográfia, gyakoriságelemzés, hegymászó keresés

## A feladat

Egy tündér esti mesét mond a kis Annának a tündérek saját ábécéjén: egy körülbelül 230 szavas angol szöveget, amelyben minden betűt egy másik betűre cseréltek. Mi a mese címe?

## Egy helyettesítéses titkosírás feltörése

26! lehetséges kulcs van, így mindet kipróbálni szóba sem jöhet. Az angol nyelv viszont nagyon kiszámítható, és a program ezt használja ki:

1. **Betűgyakoriság.** A leggyakoribb titkos betű valószínűleg az *e*, utána a *t*, az *a*, az *o*… Ezzel az első tippel a szöveg még értelmetlen, de kiindulópontnak jó.
2. **Pontszám arra, hogy „mennyire angol”.** A visszafejtett szöveg minden szavára a program összeadja, mennyire valószínűek benne a szomszédos betűpárok (a *th*, *he*, *an* gyakori, a *qz* sosem fordul elő), és minden valódi angol szóért bónusz jár. A betűpár-statisztika egy körülbelül 300 hétköznapi angol szóból álló listából származik. Ez fontos: egy csak egész szavakat számoló pontszám sokáig nem ad a keresésnek semmit, amin felfelé mászhatna, és el is akadt ott, hogy a *the* helyén *man*-t olvasott.
3. **Hegymászó keresés újraindításokkal.** A program megpróbálja felcserélni a kulcs két betűjét, és megtartja a cserét, ha nő a pontszám, egészen addig, amíg már egyik csere sem segít. Aztán kicsit megrázza a legjobb kulcsot, és újra mászik, összesen 40-szer, majd a legjobb talált kulcsot tartja meg.

Egy másodpercen belül tisztán olvasható a szöveg: *„Then the bird threw down a much more beautiful dress than on the preceding day…”*. Ez a Grimm testvérek **Hamupipőke** (Cinderella) című meséjének második báli jelenete. A program a címet úgy választja ki, hogy a szövegben leggyakrabban előforduló hosszú, nem hétköznapi szót veszi.

A legnehezebb a j, a q, az x és a z volt: mindegyik csak egyszer fordul elő a szövegben, így gyenge a statisztikájuk. A *squirrel* és a *jumped* például sokáig *sjuirrel* és *qumped* lett, amíg a szólistába be nem került néhány hétköznapi szó ezekkel a betűkkel, például a *quite*, a *square* és a *jump*.

## Ellenőrzés

A [`check.ts`](check.ts) visszafejti a szöveget a szervezők saját, közzétett megoldásában szereplő kulccsal, és megköveteli, hogy a program szövege betűről betűre egyezzen vele.

## Válasz

**Cinderella** (Hamupipőke)
