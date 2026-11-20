# Tisztítsd meg a tömböt

**CoderGames 2022 · 1. feladat** · számolás, hasítótábla

## A feladat

Adott egy egész számokból álló tömb: legkevesebb hány törléssel érhető el, hogy csak egyféle érték maradjon benne? Az `[1, 2, 2, 3]`-ban a két 2-es megtartása 2 törlésbe kerül, és ennél jobb nincs. A bemenetben 100 tömb van.

## Az ötlet

Akármelyik értéket tartjuk meg, minden mást törölni kell. Ezért azt az értéket érdemes megtartani, amelyik **a legtöbbször** fordul elő:

> törlések = n − (a leggyakoribb érték darabszáma)

Egy hasítótáblával egy menetben megszámolható: O(n).

## Válasz

100 érték: 0, 1, 2, 3, 3, 4, 5, 5, 6, 7, … (lásd az [`answer.txt`](answer.txt)-t).
