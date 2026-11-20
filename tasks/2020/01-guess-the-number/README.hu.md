# Találd ki a számot

**CoderGames 2020 · 1. feladat** · logika

## A feladat

Michal felolvas öt számot: 13, 14, 22, 23 és 32, aztán titokban kiválaszt egyet. Az első számjegyét Peter fülébe súgja, a másodikat Jankáéba.

- Peter: „Tudom, hogy Janka nem tudja kitalálni a számot.”
- Janka: „Igaz, nem tudtam. De most már tudom.”

Melyik számot választotta Michal?

## Az ötlet

Minden kijelentés egy szűrő az öt jelöltre. Ugyanolyan rejtvény, mint a híres „Cheryl születésnapja”.

1. **Mit tudhat Janka egyedül?** A második számjegyek: 3, 4, 2, 3, 2. Csak a 4 fordul elő egyszer. Ha Janka 4-et hallott volna, azonnal tudná, hogy a szám a 14.
2. **Peter biztos benne, hogy Janka nem tudhatja.** Peter számjegye tehát nem lehet olyan, ami a 14-hez is illik. Ha 1-et hallott volna, a szám lehetne 13 vagy 14, és nem lehetne biztos a dolgában. Az ő számjegye tehát 2 vagy 3, így marad a **22, a 23 és a 32**.
3. **Most már Janka tudja.** A 22, 23 és 32 közül a 2-es második számjegy még két számra illik, a 3-as viszont csak a 23-ra.

## A program

A [`solution.ts`](solution.ts) minden lépést szűrőként ír fel a listára, pont úgy, ahogy fent, így egy másik számhalmazra is működne.

## Válasz

**23**
