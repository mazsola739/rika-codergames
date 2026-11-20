# Szigetek és hidak

**CoderGames 2022 · 5. feladat** · elárasztásos kitöltés, minimális feszítőfa, union-find

## A feladat

A térkép `1` (szárazföld) és `0` (víz) cellákból álló rács. Egy sziget vízszintesen vagy függőlegesen összefüggő szárazföldcellák csoportja. Kösd össze **az összes** szigetet hidakkal, a lehető legkevesebb anyagból:

- egy híd egyenes, vízszintes vagy függőleges, 1, 2 vagy 3 vízcellából álló vonal két sziget között,
- minden hídcella egy egység anyagba kerül,
- a hidak keresztezhetik egymást (a kereszteződés cellája 2 egység, hidanként egy).

Írd ki a szükséges anyagmennyiséget, vagy `-1`-et, ha nem lehet minden szigetet összekötni. A bemenetben 103 térkép van, legfeljebb 100 × 100-asak.

## Az ötlet

A keresztezés megengedett, így a hidak sosem állnak egymás útjába, és a feladat gráfproblémává alakul:

1. **Keressük meg a szigeteket** elárasztásos kitöltéssel. Minden sziget egy csúcs lesz.
2. **Soroljuk fel az összes lehetséges hidat.** Minden szárazföldcellából nézzünk jobbra és lefelé: ugorjunk át 1–3 vízcellát, és ha egy másik szigetre érkezünk, az egy él, amelynek súlya a vízcellák száma.
3. **Kössünk össze mindent a lehető legolcsóbban.** Ez egy **minimális feszítőfa**. Kruskal algoritmusa hossz szerint rendezi a hidakat, és mindegyiket elfogadja, amelyik két még össze nem kötött csoportot kapcsol össze; ezt egy union-find tartja nyilván. Ha a végén egynél több csoport marad, a válasz `-1`.

*k* jelölt híddal ez O(cellák + k log k).

## A hivatalos válaszokban hiba van

Az én válaszaim a 103 térképből **csak 10-nél** egyeztek a hivatalosakkal. A szervezők közzétették a Python-megoldásukat, és az megmagyarázza, miért. Az elárasztásos kitöltése így vizsgálja a szomszédokat:

```python
try:
    if neighbour not in map and grid[n_row][n_col] == "1":
        ...
except IndexError:
    pass
```

A `try/except IndexError` a térképen kívüli szomszédokat hivatott elkapni. Az alsó és a jobb szélen túl ez működik. A felső szél fölött viszont az `n_row` értéke `-1`, és Pythonban a `grid[-1]` nem okoz hibát: az az **utolsó sor**. Ugyanez történik a `-1`-gyel a bal szélen. Az elárasztás így kilép a térképről a felső vagy a bal szélen, folytatódik az alsó vagy a jobb szél „másolatán”, és máshol jöhet vissza. Egymástól távoli szigetek összeolvadnak, és az eredményhez kevesebb híd kell, mint kellene.

Egy 3 × 3-as példa:

```
101      három sziget: a két felső cella és az alsó sor
000      helyes válasz: 2 (két 1 hosszú híd)
111      hivatalos program: 1 (szerinte a két felső cella egy sziget)
```

Hogy biztos legyek benne, hogy ez az egyetlen eltérés, az [`official.ts`](official.ts) a közzétett program soronkénti átirata, egy kapcsolóval a Python negatív indexeléséhez:

- a Python viselkedésével **mind a 103** közzétett választ pontosan visszaadja;
- **nélküle** (ha a `-1` a térképen kívülinek számít) **mind a 103** térképen egyezik a [`solution.ts`](solution.ts)-sel.

A [`check.ts`](check.ts) mindkettőt ellenőrzi. Még egy részlet: ha egy térképen egyáltalán nincs szárazföld, a hivatalos program `-1`-et ír ki. Az én megoldásom is ezt a szokást követi.

## Válasz

A 103 eredmény az `npm run solve -- 2022/5` kimenetében. A közzétett (hibás) válaszok az [`answer.txt`](answer.txt)-ben vannak.
