# Az élő élek éjszakája

**CoderGames 2025 · 2. feladat** · union-find, körkeresés, online lekérdezések

## A feladat

Halloween éjszakáján kísérteties folyosók jelennek meg egymás után *N* kísértetház között (legfeljebb 2·10⁵ ház és 2·10⁵ esemény). A folyosók sosem tűnnek el. Minden `?` után add meg, hány **összefüggő komponensben van kör**. Ezek az átkozottak, vagyis azok a komponensek, amelyek nem fák.

## Az ötlet

Ha az élek csak **hozzáadódnak**, a **union-find** (diszjunkt halmazok uniója) a természetes eszköz. Minden halmaz kap még egy jelzőt: *van-e már kör ebben a komponensben?*

- **Él egy halmazon belül** (a két vége már össze van kötve): kört zár be. Ha a halmaz még nem volt átkozott, most az lett: **+1**.
- **Él két halmaz között**: egyesítjük őket. Az egyesített halmaz átkozott, ha bármelyik része az volt. Ha **mindkettő** átkozott volt, két átkozott komponensből egy lett: **−1**.
- **`?`**: kiírjuk az aktuális számot.

Útösszenyomással és méret szerinti egyesítéssel minden esemény gyakorlatilag O(1) (inverz Ackermann-függvény). A hurokéleket a feladat engedélyével figyelmen kívül hagyjuk. Az ismétlődő folyosókat a módszer magától kezeli: a második példány egy halmazon belüli él, tehát kört zár be.

## Válasz

28 szám: 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6
