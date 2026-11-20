# Boreladás

**CoderGames 2021 · 2. feladat** · dinamikus programozás intervallumokon

## A feladat

Egy polcon *n* üveg bor áll, és csak valamelyik széléről vehetsz le egyet. Évente pontosan egy üveget adsz el, az 1. évtől kezdve. Egy *cᵢ* árú üveg a *t*. évben eladva *t · cᵢ* bevételt hoz. Keresd meg a legtöbbet hozó sorrendet. A bemenetben 30 polc van, mindegyiken legfeljebb néhány száz üveg.

Példa: `10 25 27 28 1 1 8` → `536, 1*8 + 2*1 + 3*1 + 4*10 + 5*25 + 6*27 + 7*28`

## Miért bukik el a mohó módszer?

A „mindig az olcsóbb szélét add el” jól hangzik, de nem látja, mi van az egyes szélek mögött. Lehet, hogy érdemes korán eladni egy drága üveget, hogy később egy még drágábbhoz férj hozzá. A szervezők azt írták, hogy sok gyors válasz rossz volt. Ez a feladat a gondosságot jutalmazta, nem a gyorsaságot.

## Az ötlet

Bármelyik pillanatban a polcon maradt üvegek egyetlen összefüggő *i..j* blokkot alkotnak. Az évet már meghatározza, hány üveg fogyott el: *t = n − (j − i)*. Az egész jövő tehát csak *(i, j)*-n múlik:

```
best(i, j) = max( t · c[i] + best(i+1, j),     a bal szélső eladása
                  t · c[j] + best(i, j−1) )    a jobb szélső eladása
```

A program a rövid blokkoktól a hosszúak felé tölti ki a `best` táblázatot, ez O(n²) állapot, mindegyik O(1) munkával, és feljegyzi, melyik szélt választotta az egyes állapotokban. Aztán a teljes polctól kezdve visszajátssza ezeket a döntéseket, és kiírja a sorrendet.

## Ellenőrzés

A hivatalos válasz a 30 legjobb összeget sorolja fel. Több sorrend is hozhatja ugyanazt az összeget, ezért a [`check.ts`](check.ts) az összegeket hasonlítja össze, a program sorrendjét pedig visszajátssza, hogy megbizonyosodjon róla: szabályos (minden üveg egy szélről jön), és tényleg kiadja az összeget.

## Válasz

A 30 összeg az [`answer.txt`](answer.txt)-ben, az eleje: 4163, 15010383, 17417190…
