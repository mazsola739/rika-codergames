# The flawed Autobahn speed tests

**CoderGames for Women 2025 · Task 5** · parsing, rules, testing · country: **Germany**

## The task

A country famous for its motorways (with no general speed limit) is testing automatic speed cameras, and some unit tests are wrong. Each test is `ID;SPEED;ROAD;WEATHER;VIOLATION`. The rules:

| road | clear | rain | fog |
|---|---|---|---|
| CITY | 50 | 40 | 30 |
| RURAL | 100 | 80 | 60 |
| HIGHWAY | no limit | 130 | 100 |

Print the IDs of the tests whose `VIOLATION` flag doesn't match the rules.

## The idea

Put the rules in a lookup table (with `Infinity` for a clear highway), compute *speeding = speed > limit* for every test, and report the tests where that differs from the flag. A good reminder that the expected values in tests need tests too.

"Over the limit" is taken strictly: exactly 50 in the city is fine. That reproduces the official list of 20 faulty tests. Note that the example in the task lists `T005;50;CITY;RAIN;TRUE` as faulty, but 50 km/h in the rain (limit 40) *is* speeding, so that flag is correct. The example itself has a bug.

## Answer

T4, T11, T64, T66, T68, T69, T71, T94, T118, T135, T136, T149, T152, T158, T184, T189, T191, T222, T237, T240. The country is **Germany**.
