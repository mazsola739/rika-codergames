# CoderGames Solutions

Solutions and explanations for every published task of **[CoderGames](https://codergames.deutschetelekomitsolutions.sk/)**, the week-long online coding competition by Deutsche Telekom IT Solutions, from 2020 to 2026, written in TypeScript.

**Website:** https://mazsola739.github.io/rika-codergames/

Each task has a short write-up in my own words (what is asked, the idea that solves it, the answer), a standalone solution, an automatic check against the official answer, and an interactive visualisation on the website.

## Status

- **37 tasks solved** across 8 editions (2020–2026, plus CoderGames for Women 2025). `npm test` checks every one against the official answer.
- CoderGames 2026 is running this week. Tasks 4 and 5 will be added once they can be read.
- Five mistakes in the official material turned up along the way:
  - [2022 · Islands and bridges](tasks/2022/05-islands-and-bridges): the official answers are wrong for 93 of 103 maps, because of a Python negative index in the published solution.
  - [2023 · Voyage to Mars](tasks/2023/05-voyage-to-mars): the official packing uses two machines twice.
  - [2026 · Claim a spot](tasks/2026/01-merch-stall): the example's expected output sells nothing; the best is `4 200`.
  - [Women 2025 · Bike path in Valencia](tasks/2025-women/04-bike-path-valencia): the example's explanation contradicts the official results.
  - [Women 2025 · Autobahn tests](tasks/2025-women/05-autobahn-tests): the example marks a correct test as faulty.

## Tasks

### [CoderGames 2026](tasks/2026) · Coder Grand Prix

| # | Task | Topics | Country |
|---|---|---|---|
| 1 | [Claim a spot](tasks/2026/01-merch-stall) | optimisation, thresholds, brute-force cross-check | Spain |
| 2 | [The Braille signal](tasks/2026/02-braille-signal) | parsing, bit masks, Braille | Germany |
| 3 | [From rookie to Formula 1](tasks/2026/03-rookie-to-f1) | graphs, topological order, path counting | Hungary |
| 4 | [Task 4](tasks/2026/04-task-4) *(coming)* |  |  |
| 5 | [Task 5](tasks/2026/05-task-5) *(coming)* |  |  |

### [CoderGames 2025](tasks/2025) · Halloween

| # | Task | Topics | Country |
|---|---|---|---|
| 1 | [Trick or treat!](tasks/2025/01-trick-or-treat) | hash map, two-sum |  |
| 2 | [Night of the living edges](tasks/2025/02-living-edges) | union-find, cycle detection, online queries |  |
| 3 | [Haunted mansion](tasks/2025/03-haunted-mansion) | graphs, in-degree, breadth-first search |  |
| 4 | [Midnight spirits](tasks/2025/04-midnight-spirits) | dynamic programming, minimum path sum |  |

### [CoderGames for Women 2025](tasks/2025-women) · Journeys across Europe

| # | Task | Topics | Country |
|---|---|---|---|
| 1 | [Anagram pairs](tasks/2025-women/01-anagram-pairs) | strings, counting | Slovakia |
| 2 | [Stability of the universe](tasks/2025-women/02-stability-of-universe) | grids, torus, symmetry |  |
| 3 | [The Lunar Codex treasure](tasks/2025-women/03-lunar-codex) | cryptography, Caesar cipher, frequency analysis | Greece |
| 4 | [Bike path in Valencia during Las Fallas](tasks/2025-women/04-bike-path-valencia) | Dijkstra, time-dependent shortest path | Spain |
| 5 | [The flawed Autobahn speed tests](tasks/2025-women/05-autobahn-tests) | parsing, rules, testing | Germany |

### [CoderGames 2024](tasks/2024) · Guess the country

| # | Task | Topics | Country |
|---|---|---|---|
| 1 | [Perfect numbers](tasks/2024/01-perfect-numbers) | number theory, Mersenne primes | Czechia |
| 2 | [Diamond sum](tasks/2024/02-diamond-sum) | math, closed formula, big integers | Hungary |
| 3 | [The Golden Claw](tasks/2024/03-golden-claw) | simulation, modular arithmetic, greedy | Greece |
| 4 | [Missing numbers](tasks/2024/04-missing-numbers) | arrays, counting | Slovakia |
| 5 | [CCTV](tasks/2024/05-cctv) | circular arrays, independence of axes | Spain |

### [CoderGames 2023](tasks/2023) · Stories: passwords, fairy tales, a rescue and a rocket

| # | Task | Topics | Country |
|---|---|---|---|
| 1 | [Buggy's master password](tasks/2023/01-master-password) | strings, parsing |  |
| 2 | [A fairy tale](tasks/2023/02-fairy-tale) | cryptography, Vigenère cipher, index of coincidence |  |
| 3 | [Stringeria](tasks/2023/03-stringeria) | dynamic programming, longest common subsequence |  |
| 4 | [Tourist rescue net](tasks/2023/04-rescue-net) | graphs, longest path, backtracking, Warnsdorff's rule |  |
| 5 | [Voyage to Mars](tasks/2023/05-voyage-to-mars) | knapsack, branch and bound, greedy |  |

### [CoderGames 2022](tasks/2022) · Number puzzles and a graph finale

| # | Task | Topics | Country |
|---|---|---|---|
| 1 | [Clean the array](tasks/2022/01-clean-array) | counting, hash map |  |
| 2 | [Divisible by 1 to 21](tasks/2022/02-second-lcm) | math, least common multiple |  |
| 3 | [Spiral diagonals](tasks/2022/03-spiral-diagonals) | math, patterns |  |
| 4 | [Roman numerals](tasks/2022/04-roman-numerals) | parsing, strings |  |
| 5 | [Islands and bridges](tasks/2022/05-islands-and-bridges) | flood fill, minimum spanning tree, union-find |  |

### [CoderGames 2021](tasks/2021) · Classic algorithms

| # | Task | Topics | Country |
|---|---|---|---|
| 1 | [Maze](tasks/2021/01-maze) | breadth-first search, grid |  |
| 2 | [Selling wine](tasks/2021/02-wine-sale) | dynamic programming, intervals |  |
| 3 | [Shortest paths](tasks/2021/03-shortest-paths) | breadth-first search, graphs |  |
| 4 | [Money](tasks/2021/04-coins) | dynamic programming, coin change |  |
| 5 | [Inconsistent array](tasks/2021/05-duplicate) | math, arrays |  |

### [CoderGames 2020](tasks/2020) · Logic puzzles and first algorithms

| # | Task | Topics | Country |
|---|---|---|---|
| 1 | [Guess the number](tasks/2020/01-guess-the-number) | logic, deduction |  |
| 2 | [Three passwords](tasks/2020/02-three-passwords) | logic, brute force |  |
| 3 | [The fairies' alphabet](tasks/2020/03-fairy-alphabet) | cryptography, frequency analysis, hill climbing |  |
| 4 | [Tomorrow's stock prices](tasks/2020/04-stock-profit) | single pass, big integers, streaming |  |
| 5 | [Two bottles, a thousand floors](tasks/2020/05-two-bottles) | dynamic programming, egg drop |  |

## Repository layout

| Path | What it is |
|---|---|
| `tasks/<edition>/<nn-name>/README.md` | The task in my own words, the idea, and the answer |
| `tasks/<edition>/<nn-name>/solution.ts` | A standalone program: reads the input file and prints the answer, ready to paste into the submission form |
| `tasks/<edition>/<nn-name>/input.txt` | The official input (`input.json` for 2023/5) |
| `tasks/<edition>/<nn-name>/answer.txt` | The official answer |
| `tasks/<edition>/<nn-name>/check.ts` | Only where several answers are correct (or the official one is wrong): validates the output instead of comparing text |
| `tasks/<edition>/<nn-name>/task.json` | Title, topics, country and test settings |
| `tasks/<edition>/<nn-name>/visual.js`, `visual.ts` | The interactive visualisation on the website: browser code, and its build-time data and caption |
| `tasks/<edition>/edition.json` | Name, dates, theme and source page of the edition |
| `scripts/` | `test.ts`, `solve.ts`, `fetch.ts`, `build-docs.ts`, `serve.ts` and their shared helpers |
| `docs/src/` | The site's style, page script and the shared visualisation toolkit (`lib.js`) |
| `docs/index.html` | The GitHub Pages site, generated by `npm run docs` from the task folders and `docs/src/` |

## Running it

Node.js 22.6 or newer runs the TypeScript files directly (`--experimental-strip-types`), so there's no build step.

```bash
npm install
```

```bash
npm test
```

```bash
npm run solve -- 2026/1
```

```bash
npm run fetch
```

```bash
npm run docs
```

```bash
npm run preview
```

- `npm test` runs every solution and checks it; `npm test -- 2023` or `npm test -- 2023/5` runs a single edition or task.
- `npm run solve -- <edition>/<n>` prints one task's answer.
- `npm run fetch` downloads the inputs that are too big for git (the 204 MB price file of 2020/4).
- `npm run docs` rebuilds `docs/index.html`, and `npm run preview` serves it at http://localhost:4321.
- `npm run typecheck` type-checks everything with `tsc`.

A solution also runs on its own, for example:

```bash
node --experimental-strip-types tasks/2021/01-maze/solution.ts tasks/2021/01-maze/input.txt
```

## Adding a task

1. Create `tasks/<edition>/<nn-name>/` with `task.json`, `solution.ts`, `input.txt` and `answer.txt` (add a `check.ts` and `"check": "custom"` when several answers are valid).
2. Write the `README.md`, and add a `visual.js` (plus a `visual.ts` for its caption and data) for the website.
3. Run `npm test -- <edition>/<n>` and `npm run docs`.

---

CoderGames is a competition by Deutsche Telekom IT Solutions Slovakia. This repository is an unofficial collection of solutions, not an official Telekom project. The task statements are summarised in my own words. The originals, with their inputs and answers, are on the [CoderGames site](https://codergames.deutschetelekomitsolutions.sk/).
