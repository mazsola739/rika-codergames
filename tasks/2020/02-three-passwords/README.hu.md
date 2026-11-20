# Három jelszó

**CoderGames 2020 · 2. feladat** · logika, nyers erő

## A feladat

Isabella felírja a jelszavát három lefordított cetlire: kettőn a helyes jelszó áll, egyen egy rossz. Paul rámutathat az egyik cetlire, és feltehet egyetlen igen/nem kérdést. Ha helyes cetlire mutat, Isabella igazat mond. Ha a rossz cetlire mutat, véletlenszerűen válaszol.

1. Melyik cetlire mutasson Paul, és mit kérdezzen, hogy biztosan megtalálja a jelszót?
2. Biztonságosan viselkednek?
3. (Nem pontozott) Oszd meg a legjobb trükködet a jelszavak megjegyzésére.

## Az ötlet

Az a válasz, amit **a rossz cetlire mutatva** kapsz, semmit sem ér. Ha viszont a rossz cetlire mutatsz, akkor mindkét másik cetli jó. Ezért:

> Mutass az egyik cetlire, kérdezz egy **másikról** („az ott jó?”), és a választól függően vidd el az egyiket abból a kettőből, amelyikre **nem** mutatsz.

- Ha a rossz cetlire mutatsz: a válasz véletlen, de a másik kettő közül viszel el egyet, és mindkettő jó.
- Ha egy jó cetlire mutatsz, a válasz igaz. Az „igen” azt jelenti, hogy amelyikről kérdeztél, az jó. A „nem” azt, hogy az a rossz, tehát a harmadikat viszed el.

## A program

A [`solution.ts`](solution.ts) nem bízik a fenti gondolatmenetben. Kipróbálja mind a 81 stratégiát („mutass a *p*-re, kérdezz a *q*-ról, igennél vidd az *a*-t, nemnél a *b*-t”) a rossz cetli minden helyzetére és minden véletlen válaszra. Pontosan 6 stratégia működik mindig, és mind ugyanaz az ötlet: mutass bármelyik cetlire, kérdezz egy másikról, és vidd el az egyiket abból a kettőből, amelyikre nem mutatsz.

## Válasz

1. Például: mutass a **középső** cetlire, és kérdezd meg: *„A bal oldali cetlin áll a helyes jelszó?”* Igen → vidd a bal oldalit, nem → a jobb oldalit.
2. **Nem.** Ne add ki a jelszavadat egy talányban, és ne írj jelszót papírra.
3. A szervezők tanácsa: ne használj szótári szót (például egy ló nevét), mert a szótári szavakat próbálják ki először.
