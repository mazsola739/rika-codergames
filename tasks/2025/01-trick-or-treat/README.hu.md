# Csokit vagy csalunk!

**CoderGames 2025 · 1. feladat** · hasítótábla, kétösszeg

## A feladat

Domi csak két csokit ehet meg, és az apukája dönti el, mennyit nyomhatnak együtt. Adott a csokik súlyainak listája és egy cél: add meg annak az **első** két csokinak az indexét, amelyek súlya együtt kiadja a célt, vagy `null`-t, ha nincs ilyen pár. Az „első” azt a párt jelenti, amelynek a **második** csokija a legkorábban jön: az `[1, 2, 3, 4]` listában 5-ös céllal a válasz `[1, 2]`, nem `[0, 3]`.

## Az ötlet

Ez a klasszikus **kétösszeg** (two-sum) probléma. Minden pár végignézése O(n²). Jobb, ha egyszer végigmegyünk a listán, és minden *j*-edik csokinál megkérdezzük: *„láttam már olyan csokit, amelyik cél − súly[j] nehéz?”* Egy hasítótábla, amely minden súlyhoz azt az első indexet tárolja, ahol előfordult, O(1) alatt megválaszolja ezt.

Mivel balról jobbra haladunk, az első találat pont az a pár, amelynek a második csokija a legkorábbi. Ha minden súlynak csak az *első* indexét tároljuk, az adja hozzá a legkorábbi párt. Összesen O(n).

## Válasz

`[2, 3]`, `[1, 2]`, `[0, 2]`, `[3, 4]`, `[2, 4]`, `[0, 2]`, `[1, 2]`, `null`, `[5, 8]`
