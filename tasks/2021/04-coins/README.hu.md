# Pénz

**CoderGames 2021 · 4. feladat** · dinamikus programozás, pénzváltás

## A feladat

Egy egzotikus nyaraláson furcsa címletű érmék vannak, például 25-ös. Adott egy *X* összeg és az érmék címletei: fizesd ki *X*-et a lehető legkevesebb érmével. Írd ki, melyik érméből hány darab kell, vagy `INF`-et, ha *X*-et egyáltalán nem lehet kifizetni. Az összegek legfeljebb 7 432 134-ig mennek.

## Miért bukik el a mohó módszer?

Az 1-es, 10-es és 25-ös érmékkel a mohó módszer a 30-at 25 + 1+1+1+1+1 alakban fizeti ki (6 érme), pedig a 10+10+10 csak 3. A mohó módszer csak a „szép” pénzrendszerekben működik, mint az euró.

## Az ötlet

Klasszikus **pénzváltási DP**. Legyen `fewest[x]` az *x* kifizetéséhez szükséges legkevesebb érme:

```
fewest[0] = 0
fewest[x] = 1 + min a c ≤ x érmékre: fewest[x − c]
```

A program minden *x*-re kitölti 1-től *X*-ig, és azt is eltárolja, melyik érmét használta utoljára az egyes *x*-eknél. *X*-ből visszafelé haladva így megkapjuk az érméket.

- Idő: O(X · érmék száma), a legnagyobb esetben körülbelül 37 millió lépés. Típusos tömbökkel nagyjából fél másodperc alatt lefut.
- Memória: két *X* méretű tömb, 7,4 milliónál körülbelül 37 MB.

## Válasz

| X | érmék | bontás |
|---|---|---|
| 30 | 3 | 10 × 3 |
| 134123 | 1605 | 1 × 2, 25 × 9, 84 × 1594 |
| 5432134 | 113173 | 3 × 2, 8 × 2, 48 × 113169 |
| 2131231 | 60894 | 12 × 2, 22 × 1, 35 × 60891 |
| 7432134 | 88482 | 25 × 6, 84 × 88476 |
