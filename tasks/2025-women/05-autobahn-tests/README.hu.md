# A hibás Autobahn-sebességtesztek

**CoderGames for Women 2025 · 5. feladat** · elemzés, szabályok, tesztelés · ország: **Németország**

## A feladat

Egy autópályáiról híres ország (ahol nincs általános sebességkorlátozás) automata traffipaxokat tesztel, és néhány egységteszt hibás. Minden teszt `ID;SPEED;ROAD;WEATHER;VIOLATION` alakú. A szabályok:

| út | tiszta idő | eső | köd |
|---|---|---|---|
| CITY | 50 | 40 | 30 |
| RURAL | 100 | 80 | 60 |
| HIGHWAY | nincs határ | 130 | 100 |

Írd ki azoknak a teszteknek az azonosítóját, amelyek `VIOLATION` jelzője nem felel meg a szabályoknak.

## Az ötlet

Tegyük a szabályokat egy keresőtáblázatba (tiszta időben az autópályára `Infinity`), számoljuk ki minden tesztre, hogy *gyorshajtás = sebesség > határ*, és jelezzük azokat a teszteket, ahol ez eltér a jelzőtől. Jó emlékeztető arra, hogy a tesztek várt értékeit is tesztelni kell.

A „határ fölött” szigorúan értendő: városban pontosan 50 még rendben van. Ez adja vissza a 20 hibás tesztből álló hivatalos listát. A feladat példája egyébként a `T005;50;CITY;RAIN;TRUE` tesztet hibásnak jelöli, pedig 50 km/h esőben (40-es határral) *valóban* gyorshajtás, tehát a jelző helyes. Magában a példában van hiba.

## Válasz

T4, T11, T64, T66, T68, T69, T71, T94, T118, T135, T136, T149, T152, T158, T184, T189, T191, T222, T237, T240. Az ország: **Németország**.
