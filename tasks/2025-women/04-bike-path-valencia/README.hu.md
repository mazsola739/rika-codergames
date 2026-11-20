# Bicikliút Valenciában a Las Fallas idején

**CoderGames for Women 2025 · 4. feladat** · Dijkstra, időfüggő legrövidebb út · ország: **Spanyolország**

## A feladat

A valenciai Las Fallas idején egyes utcák bizonyos időpontokban lezárulnak. Egy közbringával mész az 1-es állomástól az N-edikig, a T időpontban indulva (éjfél után eltelt percekben). Minden út megtétele fix számú perc, és mindegyikhez tartozik a lezárt időszakok [s, e) listája. Ha egy út le van zárva, amikor használni akarod, megvárod, amíg újra megnyílik. Mikor érhetsz oda a legkorábban? Hat készlet van, az „egyszerűtől” az „extrémig”.

## Az ötlet

Ez **Dijkstra algoritmusa érkezési időkkel** távolságok helyett. Általában, ha egy út költsége attól függ, mikor érünk oda, a legrövidebbút-algoritmusok elromlanak. Itt nem, mert **szabad várni**: ha korábban érünk egy állomásra, attól sehova sem érkezhetünk később, hiszen bármikor várhatunk. Ez a *FIFO-tulajdonság*, és vele Dijkstra helyes marad:

- vegyük a legkorábbi érkezési idejű, még lezáratlan állomást,
- minden belőle induló útra: indulás = az érkezés utáni (vagy azzal egyező) első pillanat, amikor az út nyitva van; érkezés a másik végére = indulás + menetidő,
- álljunk meg, ha az N-edik állomás sorra került (vagy írjunk ki `−1`-et, ha elérhetetlen).

Kevés állomás van, ezért a program Dijkstra egyszerű, kupac nélküli O(N²)-es változatát használja.

## Egy részlet, amit a példa elront

Mit jelent az, hogy „le van zárva a tervezett utazás idején”: lezárva, amikor **elindulsz**, vagy lezárva **az út bármely pillanatában**? A példa szerint az 1 → 2 út 110 és 130 közötti lezárása „várakozásra kényszerítene” egy 100-kor induló (120-kor érkező) utat. Ebből az következne, hogy az egész út számít. Ezzel a szabállyal viszont a 3. készletre 105 jön ki, a hivatalos válasz pedig **90**. Csak „az útnak nyitva kell lennie, amikor elindulsz” szabály adja vissza mind a hat hivatalos eredményt, ezért a program így működik. Az 1. készletben mindkét értelmezéssel 145 a válasz.

## Válasz

145, 90, 90, 305, 145, 105. Az ország: **Spanyolország**.
