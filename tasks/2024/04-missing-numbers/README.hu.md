# Hiányzó számok

**CoderGames 2024 · 4. feladat** · tömbök, számolás · ország: **Szlovákia**

## A feladat

Egy Tátra alatti faluban, ahol a betyár Jánošík elvette a gazdagoktól és odaadta a szegényeknek, a számoknak megszakítás nélküli sorozatot kell alkotniuk. Adott egy egész számokból álló tömb: hány szám hiányzik a legkisebb és a legnagyobb között, és melyek ezek növekvő sorrendben? `4 3 6 8` → `2: 5, 7`. A bemenetben 4182 szám van.

## Az ötlet

Rendezéssel és a rések megkeresésével O(n log n) alatt megvan. Mivel az értékek kis tartományban mozognak, egy **jelenléttáblázat** még egyszerűbb: minden értéket jelöljünk meg egy `érték − min` szerint indexelt bájttömbben, aztán menjünk végig min-től max-ig, és gyűjtsük össze a jelöletleneket. Ez O(n + tartomány), rendezés nélkül.

## Válasz

**202** hiányzó szám: 24, 42, 43, 54, 60, 70, 81, … 3907, 3980 (a teljes lista az [`answer.txt`](answer.txt)-ben). Az ország: **Szlovákia** (Lengyelországot is elfogadták).
