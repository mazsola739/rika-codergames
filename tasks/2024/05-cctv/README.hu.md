# CCTV

**CoderGames 2024 · 5. feladat** · körkörös tömbök, független tengelyek · ország: **Spanyolország**

## A feladat

Egy Mercadona szupermarket biztonsági őre kameraképeket figyel egy h × w-s képernyőcella-rácson. A nyílgombok **minden** képet eltolnak egy cellával balra, jobbra, fel vagy le, a széleken körbeérve. A *tömörség* a legkisebb olyan téglalap területe, amely minden képet tartalmaz. Keresd meg a legkisebb tömörséget és az eléréséhez szükséges legkevesebb gombnyomást. Az összes eltoláskombináció végigpróbálása lehetséges, de a feladat ennél jobbat kér.

## Az ötlet

Két megfigyeléstől lesz könnyű:

1. **A sorok és az oszlopok függetlenek.** A fel/le csak a sorszámokat változtatja, a balra/jobbra csak az oszlopszámokat, a terület pedig *(lefedett sorok) × (lefedett oszlopok)*. A legkisebb területhez mindkét kiterjedésnek minimálisnak kell lennie, így a két tengely külön-külön megoldható, és a gombnyomások összeadódnak.
2. **Mindkét tengely egy kör.** A foglalt sorok a *h* sorból álló kört üres sorokból álló résekre bontják. Vágjuk el a kört a **legnagyobb résnél**, és ami marad, az a legrövidebb, minden képet lefedő blokk: **kiterjedés = h − a legnagyobb rés**.

A blokk ezután **nem lóghat át** a képernyő szélén. A kezdetének a 0 … h − kiterjedés tartományba kell esnie, és a szükséges gombnyomások száma a mostani kezdetétől a legközelebbi ilyen helyig mért körkörös távolság, ami 0, ha már most is belefér. Ha több rés is holtversenyben a legnagyobb, azt választjuk, amelyikhez a legkevesebb gombnyomás kell.

Példa: egy 3 × 4-es rács, képek az (1, 1), (3, 4), (1, 4) helyen. A sorok {1, 3} egy 3-as körön: a kiterjedés 2, 1 gombnyomás kell. Az oszlopok {1, 4} egy 4-es körön: a kiterjedés 2, 1 gombnyomás kell. A tömörség tehát **4**, **2** gombnyomással.

## Válasz

`4; 2` és `6; 0`. Az ország: **Spanyolország** (Mercadona).
