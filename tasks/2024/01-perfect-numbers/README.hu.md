# Tökéletes számok

**CoderGames 2024 · 1. feladat** · számelmélet, Mersenne-prímek · ország: **Csehország**

## A feladat

A történet Jára Cimrmant követi, a nagy cseh „feltalálót”, aki sosem létezett, amint felfedezi a tökéletes számokat, és csillagászati órát tervez a fővárosnak (a prágai 1410 óta áll ott). Keresd meg az első öt tökéletes számot 2 és 100 000 000 között. Egy **tökéletes szám** egyenlő a nála kisebb osztóinak összegével: 6 = 1 + 2 + 3, 28 = 1 + 2 + 4 + 7 + 14.

## Az ötlet

Ha 10⁸-ig minden szám osztóit összeadjuk, az vagy egy 10⁸ elemű szita (400 MB), vagy O(√n) munka mind a 10⁸ számra. A matematika ad egy rövidítést:

- **Eukleidész** bebizonyította, hogy ha 2ᵖ − 1 prím, akkor 2ᵖ⁻¹ · (2ᵖ − 1) tökéletes.
- **Euler** a megfordítását bizonyította: **minden páros** tökéletes szám ilyen alakú.
- **Páratlan tökéletes szám nem ismert.** Ez a matematika egyik legrégebbi megoldatlan problémája, és 10¹⁵⁰⁰ alatt biztosan nincs ilyen.

A program tehát kipróbálja a p = 2, 3, 4, … értékeket, amíg 2ᵖ⁻¹(2ᵖ − 1) ≤ 10⁸, megtartja azokat a p-ket, amelyekre 2ᵖ − 1 prím (*Mersenne-prím*), és minden jelöltet ellenőriz is: ténylegesen összeadja az osztóit. Ez százmillió helyett csak néhány ciklus.

| p | 2ᵖ − 1 | tökéletes szám |
|---|---|---|
| 2 | 3 | 6 |
| 3 | 7 | 28 |
| 5 | 31 | 496 |
| 7 | 127 | 8128 |
| 13 | 8191 | 33 550 336 |

## Válasz

6, 28, 496, 8128, 33550336. Az ország: **Csehország**.
