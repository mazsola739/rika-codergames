# A Holdkódex kincse

**CoderGames for Women 2025 · 3. feladat** · kriptográfia, Caesar-titkosítás, gyakoriságelemzés · ország: **Görögország**

## A feladat

A minószi civilizáció archívumából származó titkosított üzenet egy műtárgyhoz vezető utat rejt. A tippek szerint a rend „több eltolást használt ugyanazon az üzeneten belül”, az első érték egy holdciklushoz kapcsolódik, minden visszafejtett rész nyomot ad a következőhöz, és a gyakoriságelemzés segít. Keresd meg az összes kulcsot, fejtsd vissza az üzenetet, és nevezd meg az országot.

## Milyen titkosítás ez?

A példa, `phtajvbuavutl → iamtcountonme` („I am 7, count on me”), egy 7-es **Caesar-eltolás**. Az üzenet egy költemény, amelynek **minden versszaka más eltolást használ**, és semmi sem jelzi, hol ér véget egy versszak, és hol kezdődik a következő.

## Az ötlet

1. **Minden sort pontozzunk mind a 26 eltolással**: a betűinek log-valószínűségével az angol betűgyakoriságok szerint.
2. **Ne csak a soronkénti legjobb eltolást válasszuk.** A rövid sorok zajosak: a *„Mount Olympus, proud and tall”* egy rossz eltolással jobb pontot kap, és *„Fhngm Herfinl, ikhnw tgw mtee”* lett belőle. Ehelyett **az összes sorra együtt** választunk eltolást egy kis dinamikus programmal, Viterbi-módra: a teljes pontszám a sorok pontszámainak összege, **mínusz egy büntetés minden alkalommal, amikor két sor között változik az eltolás**. Így a versszakok egyben maradnak, és a zajos sor a szomszédait követi.
3. A versszakok eltolásai a kulcsok.

A kulcsok: **4, 7, 16, 2**. A költemény Szelénétől és az Olümposztól Szókratészen és a bürökpoháron, a Perseidákon át végül a minószi knósszoszi palotáig jut el.

## Válasz

A kulcsok 4, 7, 16, 2. A visszafejtett költemény az [`answer.txt`](answer.txt)-ben van. Az ország: **Görögország**.
