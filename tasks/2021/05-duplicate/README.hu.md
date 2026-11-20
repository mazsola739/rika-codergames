# Következetlen tömb

**CoderGames 2021 · 5. feladat** · matematika, tömbök

## A feladat

Egy *N* méretű tömbben a 0 … N−2 számok vannak, így valamelyiknek kétszer kell szerepelnie, és pontosan egy szerepel kétszer. Keresd meg. Minden bemeneti sor `N;a,b,c,…` alakú.

## Az ötlet

Többféleképpen is megoldható: rendezéssel, majd a szomszédok összevetésével (O(N log N)), vagy a már látott számok halmazával (O(N) memória). A legelegánsabbhoz **egy menet kell, és semmi extra memória**:

- A 0 … N−2 számok összege (N−2)(N−1)/2.
- A tömbben mind benne vannak, plusz még egyszer a duplikált szám.
- Tehát **a duplikált szám = a tömb összege − (N−2)(N−1)/2**.

(Az XOR ugyanígy működik, ha más nyelvekben a túlcsordulás miatt aggódsz.)

A szervezők szerint ez volt a hét legkönnyebb feladata: erre jött a legtöbb teljesen helyes válasz, és ezt küldték be a leggyorsabban.

## Válasz

0, 4, 12, 9, 1
