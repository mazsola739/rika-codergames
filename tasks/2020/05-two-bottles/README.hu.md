# Két üveg, ezer emelet

**CoderGames 2020 · 5. feladat** · dinamikus programozás, tojásejtés

## A feladat

Kassán megnyílik egy új, 1000 emeletes kollégium. Két diák szeretné kideríteni, melyik a legalacsonyabb emelet, ahonnan a (nagyon strapabíró) üvegük eltörik, és csak két üvegük van. Melyik stratégiához kell a legrosszabb esetben a legkevesebb ejtés, és az hány ejtés?

## Az ötlet

Ez a klasszikus **kéttojás-probléma**.

- **Egy** üveggel nincs választásod: egyesével kell felfelé haladni.
- **Kettővel** az első üveggel gyorsan szűkíted a tartományt, a másodikkal pedig emeletenként fejezed be. Ha az első üveg *k* ejtés után törik el, a másodiknak kell végigjárnia az alatta lévő rést, ezért minden résnek **egy emelettel kisebbnek kell lennie az előzőnél**. Így az ejtések száma összesen ugyanannyi marad, akármilyen magasra jutsz.

Ha tehát a legrosszabb eset *d* ejtés, az első üveg a *d*. emeletről esik, aztán a *d + (d−1)*.-ről, aztán *+ (d−2)*, és így tovább. Ezek a lépések együtt *d(d+1)/2* emeletet fednek le. A legkisebb *d*, amelyre *d(d+1)/2 ≥ 1000*, a **45** (45·46/2 = 1035).

A tartomány felezése (első ejtés az 500. emeletről) csapda: ha az üveg eltörik, a második üveggel egyesével kell végigpróbálni az 1–499. emeletet. A szervezők szerint ez volt a leggyakoribb válasz.

## A program

A [`solution.ts`](solution.ts) az általános rekurziót használja. *b* üveggel és *d* ejtéssel

reach(b, d) = reach(b−1, d−1) + 1 + reach(b, d−1)

emeletet lehet lefedni: az első ejtésnél az üveg vagy eltörik (az alatta lévő emeletekre eggyel kevesebb üveg marad), vagy nem (a fölötte lévőkre ugyanannyi üveg marad). A program megkeresi a legkisebb *d*-t, amelyre reach(2, d) ≥ 1000, és kiírja, honnan kell ejteni az első üveget.

## Válasz

**45 ejtés**: az első üveget a 45., 89., 132., 174., 215., 255., … 980., 990. és 999. emeletről ejtjük. Ha eltörik, vissza kell menni az utolsó biztonságos emeletre, és onnan a második üveggel egyesével folytatni.
