# Kezdőből Forma–1-es pilóta

**CoderGames 2026 · 3. feladat** · gráfok, topologikus sorrend, útszámolás · ország: **Magyarország**

## A feladat

Egy pilóta pályafutása edzésekből és versenyekből álló irányított körmentes gráf. Az 1-es csúcs a teljesen kezdő, az N-edik a Forma–1-es profi. Számold meg, hány különböző út vezet 1-ből N-be. A szám nem biztos, hogy belefér 32 bitbe. A bemenetben 50 csúcs és 962 él van. Az ország nyoma: „a mi pályánk” első három győztese Nelson Piquet, Nelson Piquet és Ayrton Senna volt.

## Az ötlet

Az utak felsorolása reménytelen: billiószámra vannak. **Megszámolni** viszont könnyű őket dinamikus programozással, **topologikus sorrendben**:

- ways[1] = 1,
- minden a → b él hozzáadja ways[a]-t ways[b]-hez,
- a csúcsokat olyan sorrendben dolgozzuk fel, hogy minden él előre mutasson (Kahn algoritmusa: újra és újra veszünk egy csúcsot, amelybe nem vezet feldolgozatlan él), így ways[a] már végleges, mielőtt az éleit használnánk.

O(N + M). A darabszámok `BigInt`-ek, így még sokkal nagyobb gráfoknál sem csordulhatnak túl.

## Az ország

Nelson Piquet nyerte az első két **Magyar Nagydíjat** a Hungaroringen (1986, 1987), Ayrton Senna pedig a harmadikat (1988).

## Válasz

**4768729922192** út. Az ország: **Magyarország**.
