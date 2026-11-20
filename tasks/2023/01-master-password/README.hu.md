# Buggy mesterjelszava

**CoderGames 2023 · 1. feladat** · szövegkezelés, elemzés

## A feladat

Buggy kizárta magát, és szüksége van a mesterjelszavára. Csak egy koordinátalistát őrzött meg, például `{3,1},{3,3},{3,0},…`, amely egy 8 × 8-as karaktermátrixba mutat. A mátrixban `0–9`, aztán `a–z`, aztán `A–Z`, végül `,` és `.` áll.

1. Keresd ki az egyes koordinátákat (sor, oszlop, 0-tól számolva). Így vesszővel elválasztott szavak állnak össze.
2. Fűzd össze a szavakat: ha egy szó vége megegyezik a következő elejével (**kis- és nagybetűtől függetlenül**), a **következő** szóból hagyd el az egyező részt. `lemON` + `onion` → `lemONion`.
3. Add meg a jelszót, azt, hogy hány karakter maradt ki (az elválasztók nem számítanak), és a leghosszabb kihagyott darabot (megtartva a kis- és nagybetűket).

Példa: `apple, lemon, onion` → `applemonion`. Kimaradt a `le` és az `on`, tehát 4 karakter, és a leghosszabb a `le`.

## Az ötlet

- **Kikeresés:** a karakter = `matrix[sor · 8 + oszlop]`. A párokat egy reguláris kifejezés olvassa ki, így a fájlban lévő szóközök nem számítanak.
- **Két szó átfedése:** a legnagyobb *k*, amelyre az első szó utolsó *k* betűje megegyezik a második első *k* betűjével, mindkettőt kisbetűsítve. A program a lehető leghosszabb *k*-tól lefelé próbálkozik, és az első egyezésnél megáll.
- A kihagyott rész a **második** szóból jön, úgy, ahogy le van írva (a kis- és nagybetűk megmaradnak), és egy listába kerül. A leghosszabb darab az első maximális hosszúságú.

A szavak rövidek, így bőven elég az egyszerű, O(hossz²) átfedésvizsgálat.

## Válasz

- Jelszó: `proGrammErasERaCeColuMnemonIcEbrEAker…P4SSw0RdPassWorDerPassWorTiCal` (a teljes, 400-nál több karakter az [`answer.txt`](answer.txt)-ben)
- Kihagyott karakterek: **92**
- A leghosszabb kihagyott szöveg: **`pAssWorD`**
