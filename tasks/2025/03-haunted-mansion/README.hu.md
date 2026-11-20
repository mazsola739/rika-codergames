# Kísértetkastély

**CoderGames 2025 · 3. feladat** · gráfok, befok, szélességi keresés

## A feladat

Tomnak megvan egy kísértetkastély térképe: 20 000 számozott szoba, egyirányú titkos folyosókkal összekötve, úgy, hogy körbe sehol nem lehet menni. Néhány szoba (itt 35) eltűnt. Egy elrontott varázslat miatt még néhány eltűnt: minden szoba, amely legalább két eltűnt szobával „össze volt kötve”, szintén eltűnt, de csak egyszer, láncreakció nélkül. Válaszolj három kérdésre:

1. Melyik szoba a **főbejárat**? Oda egyetlen folyosó sem vezet.
2. Hány szoba tűnt el **pluszban** a varázslat miatt?
3. Hány szoba érhető még el a bejárattól, a bejáratot is beleértve?

## Az ötlet

Három kis gráflépés:

1. **Bejárat = 0 befok.** Minden szobára megszámoljuk a bejövő folyosókat. Amelyikbe egy sem vezet, az lehet a bejárat.
2. **A varázslat, egy körben.** Minden még meglévő szobánál megszámoljuk, hány folyosója vezet eltűnt szobába. Ha kettő vagy több, eltűnik. A vizsgálat csak az első körben eltűnt szobákat nézi, így nincs láncreakció.
3. **Az elérhetőség** egy BFS a bejárattól, amely sosem lép eltűnt szobába.

Mindez O(szobák + folyosók).

## Két kétértelműség

- **Mit jelent az, hogy „össze van kötve”?** Ha *mindkét* irányú folyosók számítanak, 32 szoba tűnik el pluszban. Ha csak a szoba *saját* folyosói (az onnan kifelé vezetők), akkor 9, ami egyezik a hivatalos válasszal és a feladat példájával. A feladat bemeneti formátuma is az alapján írja le az egyes szobákat, hogy hova vezetnek belőlük folyosók.
- **Melyik bejárat?** Ebben a kastélyban **négy** szoba is van, ahova nem vezet folyosó: 6496, 7741, 15415 és 16841. A hivatalos válasz mind a négy eredményt felsorolja, és a program is.

## Válasz

| bejárat | pluszban eltűnt | elérhető |
|---|---|---|
| 6496 | 9 | 19953 |
| 7741 | 9 | 19950 |
| 15415 | 9 | 1348 |
| 16841 | 9 | 19952 |
