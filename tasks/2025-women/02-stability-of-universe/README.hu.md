# Az univerzum stabilitása

**CoderGames for Women 2025 · 2. feladat** · rácsok, tórusz, szimmetria

## A feladat

Az univerzum egy 200 × 200-as számrács egy gömb felszínén, ami valójában **tórusz**: az utolsó oszlop az első mellett van, az utolsó sor az első mellett. Egy **gravitációs középpont** olyan *P* cella, amelynek értéke szigorúan nagyobb a négy tengelyén 1 és 2 távolságra lévő 16 értéknél:

```
x2'  .   a2  .   y2
 .  x1'  a1  y1  .
b2' b1'  P   b1  b2
 .  y1'  a1' x1  .
y2'  .   a2' .   x2
```

Egy középpont **stabil**, ha minden tengelye kiegyensúlyozott: a1 = a1′, a2 = a2′, és ugyanígy b-re, x-re és y-ra. Számold meg a stabil és az instabil középpontokat.

## Az ötlet

Csak a 16 tengelycella számít, és az (a1, a1′), (b2, b2′), … párok egymás tükörképei *P*-n át. Elég tehát az irányok **felét** felsorolni, (−1, 0), (−2, 0), (0, 1), (0, 2), (1, 1), (2, 2), (−1, 1), (−2, 2), és minden *d* irányt az ellentétével, a −*d*-vel együtt használni:

- **középpont:** P > érték(P + d) és P > érték(P − d) mind a 8 irányra,
- **stabil:** érték(P + d) = érték(P − d) mind a 8 irányra.

A körbeérés egyszerűen a rácsmérettel vett maradékos index (a negatív számokra figyelve). Egy menet a 40 000 cellán, cellánként 16 kikereséssel.

## Válasz

**31 stabil, 21 instabil** (`31 21`).
