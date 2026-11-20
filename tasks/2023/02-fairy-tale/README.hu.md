# Egy tündérmese

**CoderGames 2023 · 2. feladat** · kriptográfia, Vigenère-titkosítás, koincidenciaindex

## A feladat

Egy tündér esti mesét mond a kis Annának, de „a tündérek nyelve jelszóval van titkosítva”. A bemenet 763 nagybetű, szóközök nélkül. Fejtsd vissza, és nevezd meg a mesét.

## Milyen titkosítás ez?

A „jelszóval titkosítva” a **Vigenère-titkosításra** utal: az *i*-edik betűt a kulcsszó *i*-edik betűjével toljuk el, és a kulcs ismétlődik. Egy betű, mondjuk az *E*, a helyétől függően mindig másképp jön ki, ezért az egész szövegre alkalmazott egyszerű gyakoriságelemzés nem működik.

## Feltörés két lépésben

**1. A kulcshossz megkeresése a koincidenciaindexszel.** A *koincidenciaindex* (IoC) annak a valószínűsége, hogy egy szövegből véletlenszerűen kiválasztott két betű ugyanaz. Angol szövegnél ez körülbelül **0,066**, véletlen betűknél 1/26 ≈ **0,038**. Ha *k* hosszú kulcsot feltételezünk, és a szöveget *k* oszlopra bontjuk (minden *k*-adik betű), akkor a jó *k*-nál minden oszlop egy fix értékkel eltolt, közönséges angol szöveg, és az eltolás nem változtat az IoC-n. A program kipróbálja a *k* = 1, 2, 3, … értékeket, és az első olyan *k*-t választja, amelynél az oszlopok átlaga 0,06 fölött van. A jó hossz többszörösei is átmennének, ezért a legkisebbet veszi.

**2. Minden oszlop feltörése Caesar-titkosításként.** Minden oszlopra kipróbálja mind a 26 eltolást, és azt tartja meg, amelynek betűgyakoriságai a legközelebb vannak az angolhoz (a legkisebb **χ²**-távolság).

A kulcs **`SUPERHESLO`** („szuperjelszó”), a szöveg pedig így kezdődik:

> TWO SWINDLERS ARRIVE AT THE CAPITAL CITY OF AN EMPEROR WHO SPENDS LAVISHLY ON CLOTHING…

Ez Hans Christian Andersen **A császár új ruhája** (The Emperor's New Clothes) című meséjének összefoglalója.

## Válasz

**The Emperor's New Clothes** (A császár új ruhája; a hivatalos válasz *The Emperor's New Suit* néven említi). Vigenère-titkosítás, a kulcs `SUPERHESLO`.
