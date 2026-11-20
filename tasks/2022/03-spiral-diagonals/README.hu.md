# A spirál átlói

**CoderGames 2022 · 3. feladat** · matematika, minták

## A feladat

Írd fel az 1, 2, 3, … számokat az óramutató járásával megegyező spirálban, a középponttól kezdve:

```
21 22 23 24 25
20  7  8  9 10
19  6  1  2 11
18  5  4  3 12
17 16 15 14 13
```

Ennek az 5 × 5-ös spirálnak a két átlóján álló számok összege 101. Mennyi ez az összeg egy 501 × 501-es spirálnál?

## Az ötlet

A spirált nem kell megépíteni. Nézzük **gyűrűnként**: az *n* oldalú (páratlan) gyűrű egyik sarkában *n²* áll, és a másik három sarka ez előtt jön, egymástól *n − 1* távolságra:

> n², n² − (n−1), n² − 2(n−1), n² − 3(n−1) → összegük **4n² − 6(n − 1)**

Az eredmény 1 (a középpont) plusz ez az összeg n = 3, 5, …, 501-re, ami 250 tag. Zárt képlet is van rá, de a ciklus is azonnal lefut.

Ellenőrzés: 5 × 5-re 1 + (36 − 12) + (100 − 24) = 101. ✓

## Válasz

**83960501**
