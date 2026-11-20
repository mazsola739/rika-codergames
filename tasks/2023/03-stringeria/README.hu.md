# Stringeria

**CoderGames 2023 · 3. feladat** · dinamikus programozás, leghosszabb közös részsorozat

## A feladat

Hogy megtörd Stringeria földjének átkát, keresd meg két varázsszöveg, az `s1` és az `s2` (egyenként 1000 nagybetű) **leghosszabb közös részsorozatát**. Egy részsorozat megtartja a betűk sorrendjét, de a betűknek nem kell egymás mellett lenniük. Írj ki egy ilyen részsorozatot és a hosszát.

Példa: `ABECF` és `AEEDC` → `AEC`, a hossza 3.

## Az ötlet

A klasszikus DP. Legyen **L[i][j]** az `s1` első *i* és az `s2` első *j* betűjének LCS-hossza:

```
L[i][j] = L[i−1][j−1] + 1                ha s1[i−1] = s2[j−1]
        = max(L[i−1][j], L[i][j−1])      különben
```

A táblázatot soronként töltjük ki (1000 × 1000, egymillió cella, egy lapos `Uint16Array`-ben). Aztán a jobb alsó sarokból visszafelé lépkedünk: egyezésnél elvesszük a betűt, és átlósan lépünk, különben a nagyobb szomszéd felé. Az összegyűjtött betűk visszafelé olvasva egy LCS-t adnak.

- Idő és memória: O(n · m).

## Ellenőrzés

Sok különböző szöveg is elérheti a maximális hosszt, így a hivatalos szöveg csak az egyik lehetőség. A [`check.ts`](check.ts) minden olyan szöveget elfogad, amely mindkét bemenetnek részsorozata, és a hossza a hivatalos.

## Válasz

A hossz **319**.
