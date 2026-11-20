# Utazás a Marsra

**CoderGames 2023 · 5. feladat** · hátizsák-probléma, korlátozás és szétválasztás, mohó algoritmus

## A feladat

A Marsra tartó rakéta holnap indul. 10 000 gép van, mindegyiknek van *hasznossága* (érték) és *mérete* (súly, valós szám). A rakomány határa 10 000. Válaszd ki a gépeket úgy, hogy a teljes hasznosság a lehető legnagyobb legyen, és ne lépd túl a határt. A történet hangsúlyozza, hogy nincs idő a tökéletes megoldásra: légy gyors.

## Az ötlet

Ez a **0/1 hátizsák-probléma**. A tankönyvi DP egész kapacitásokkal dolgozik, ezek a súlyok viszont valós számok, például 71.13353423971505, így közvetlenül nem alkalmazható. Két egyszerűbb ötlet itt nagyon jól működik:

1. **Mohó módszer sűrűség szerint.** Rendezzük a gépeket a súlyegységre jutó érték szerint, és ebben a sorrendben vegyük el őket, amíg még beférnek. Ez azonnali, és már nagyon jó eredményt ad.
2. A **korlátozás és szétválasztás** (a Horowitz–Sahni-séma) ebből *bizonyított* optimumot csinál. Sűrűségi sorrendben járjuk be a „vegyük el / ne vegyük el” döntéseket, és minden részleges választásra kiszámolunk egy **felső korlátot**: a maradék helyet mohón töltjük ki, és az első be nem férő gépből *törtrészt* is megengedünk. Ha ez a korlát nem tudja megverni az eddigi legjobb pakolást, az egész ágat kihagyjuk. Prefixösszegekkel és bináris kereséssel minden korlát O(log n).

Ezen a bemeneten a mohó pakolás (743 529,61) már optimális. A korlátozás és szétválasztás mindössze **1248** keresési csúcs bejárása után (0,2 s) be is bizonyítja. A törtrészes korlát csak 4,17-tel magasabb. Az ilyen véletlenszerű példák általában könnyűek, ezért ilyen hatékony a korlát. Hogy biztosan helyes legyen a keresés, 60 kis véletlenszerű példán nyers erővel is összevetettem.

## A hivatalos válasz nem érvényes pakolás

A közzétett megoldás **745 306,61** összértéket állít, ami több a mi optimumunknál. Az 1114 gépből álló listájában viszont **kétszer szerepel az 5996-os és kétszer a 9777-es gép**, pedig minden gép csak egyszer létezik. A duplikátumok nélkül a lista 9996,80 súly mellett 743 380,37-et ér, ami kicsit *rosszabb* a sima mohó módszernél. Az algoritmusuk tehát megengedhette, hogy egy elemet kétszer pakoljanak be.

Ezért a [`check.ts`](check.ts) magából a bemenetből ellenőrzi a pakolást: a gépek léteznek és különbözők, a teljes súly belefér, a kiírt összegek helyesek, és az érték eléri a bizonyított optimumot.

## Válasz

- Teljes érték: **743529.6098448576** (bizonyíthatóan optimális)
- Teljes súly: 9999.90135840852
- 1111 gép (a lista a program kimenetében van)
