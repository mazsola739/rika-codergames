# Foglalj helyet!

**CoderGames 2026 · 1. feladat** · optimalizálás, küszöbök, ellenőrzés nyers erővel · ország: **Spanyolország**

## A feladat

A Nagydíjon, egy városban, amely egy építész stílusáról, egy befejezetlen bazilikáról és levágott sarkú háztömbökről híres (Barcelona: Gaudí, a Sagrada Família, az Eixample), *N* standból álló sor árul egyforma csapatrelikviákat. Szeretnél nyitni még egy standot: válaszd ki, **hova** (a meglévő *L*-edik stand után, de sosem elsőnek vagy utolsónak) és **milyen áron** (*P*), hogy a várható bevétel a lehető legnagyobb legyen.

A szurkolók rögzített módon viselkednek. Egy *K* türelmű szurkoló pontosan *K* stand mellett megy el, aztán visszamegy a látottak közül a legolcsóbbhoz. Holtversenynél ahhoz, amelyik **a legközelebb van ahhoz a helyhez, ahol megállt**. A szurkolók fele balról jobbra, fele jobbról balra halad, és a szurkolók *B_K* százalékának *K* a türelme. Egyenlő bevételnél a legkisebb *L* nyer, utána a legkisebb *P*. A feladat hozzáteszi: „a nyers erő nem megoldás”.

## Az ötlet

Rögzítsük az *L* helyet, és nézzünk egyetlen szurkolótípust (irány és *K*). Ez a szurkoló pontosan akkor vásárol **tőlünk**, ha eljut a standunkig, és az árunk

- **legfeljebb** akkora, mint az *előttünk* látott legolcsóbb ár (holtversenynél minket később látott, így közelebb vagyunk ahhoz, ahol megáll, és mi nyerünk), és
- **szigorúan kisebb** minden olyan árnál, amit *utánunk* lát (holtversenynél az a stand van közelebb, tehát az nyer).

Minden szurkolótípus tehát vagy elveszett, vagy ad egy **árplafont**: pontosan akkor vásárol tőlünk, ha P ≤ plafon. Ahogy P nő, a szurkolók plafonról plafonra kiesnek, két plafon között viszont a magasabb ár csak többet hoz. **A legjobb ár tehát mindig az egyik plafon.** Minden L-hez legfeljebb 2N jelölt van 9999 ár helyett. Minden jelölt kiértékelése O(N), ami összesen O(N³), N ≤ 100-ra azonnali.

## Ellenőrzés

A [`simulate.ts`](simulate.ts) pont az a nyers erő, amitől a feladat óv, és tesztelésre tökéletes. Minden helyre és minden árra felépíti a sort, és minden szurkolót pontosan úgy végigvezet rajta, ahogy a történet leírja. Semmilyen logikája nem közös a plafonos érveléssel. A [`check.ts`](check.ts) megköveteli a hivatalos választ **és** a szimulációval való egyezést is.

## A feladat példája hibásnak tűnik

A példára (árak `73 418 126 905 200`, arányok `23 11 49 16 1`) a feladat szerint a válasz **`2 199`**. A 2. helyen viszont senki sem vásárolhat 199-ért. A balról jobbra haladók előbb a 73-as mellett mennek el, a jobbról balra haladók pedig előbb a 126-os mellett. A program és a nyers erős szimuláció is **`4 200`**-at talál: a 905 és a 200 között a jobbról balra haladó, K = 2 vagy 3 türelmű szurkolók ott vásárolnak, 60,0 várható bevétellel. A szabályok más értelmezései (holtversenyt mindig elveszítjük, 0-tól számozott helyek, …) sem adják ki a `2 199`-et. A valódi bemenetre mindegyik egyezik a hivatalos eredménnyel.

## Válasz

**`1 6`**: az első stand után, 6-os áron. Az ország: **Spanyolország** (a barcelonai Spanyol Nagydíj).
