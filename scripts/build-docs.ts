// Builds docs/index.html, the GitHub Pages site: every edition and task with its write-up
// (README.md) and solution, rendered at build time so the page needs no JavaScript to read.
// Usage: npm run docs                  writes docs/index.html
//        npm run docs -- --fragment F  also writes the page body alone to F (for previews)
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, openSync, readSync, closeSync } from 'node:fs'
import { join, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import { marked } from 'marked'
import { ROOT, loadEditions, loadTasks, runSolution, inputPath, normalize, type Edition, type Task } from './tasks.ts'

const REPO = 'https://github.com/mazsola739/rika-codergames'
const BLOB = `${REPO}/blob/main`
const TREE = `${REPO}/tree/main`
const PAGES = 'https://mazsola739.github.io/rika-codergames/'

// Newest first; the women's edition follows the 2025 one.
const ORDER = ['2026', '2025', '2025-women', '2024', '2023', '2022', '2021', '2020']
const TAB_LABEL: Record<string, string> = { '2025-women': 'Women 2025' }

// Mistakes in the official material that the solutions ran into (task id -> one line).
const FINDINGS: [id: string, text: string][] = [
  ['2022-5', 'The official answers are wrong for 93 of the 103 maps. A Python negative index in the published solution lets islands leak across the edges of the map.'],
  ['2023-5', 'The official packing uses two machines twice. The real optimum, proven by branch and bound, is 743,529.61.'],
  ['2026-1', 'The expected output of the example (2 199) sells nothing at all. The best choice is 4 200.'],
  ['2025-women-4', "The example's explanation contradicts the official results: only the departure time counts."],
  ['2025-women-5', 'The example marks a correct test as faulty.'],
]

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slug = (t: Task) => `${t.edition.id}-${t.number}`
const folder = (t: Task) => `tasks/${t.edition.id}/${basename(t.dir)}`

// ---------- a small TypeScript highlighter (comments, strings, regexes, numbers, keywords) ----------
const KEYWORDS = new Set(
  'const let var function return if else for while do of in new import from export default type interface as break continue true false null undefined typeof async await throw try catch class extends switch case void'.split(
    ' ',
  ),
)
function highlight(src: string): string {
  let out = ''
  let prev = ''
  const span = (cls: string | null, text: string) => (out += cls ? `<span class="tk-${cls}">${esc(text)}</span>` : esc(text))
  for (let i = 0; i < src.length; ) {
    const rest = src.slice(i, i + 2000)
    const c = src[i]!
    let m: string | undefined
    let cls: string | null = null
    if (rest.startsWith('//')) [m, cls] = [rest.match(/^\/\/[^\n]*/)![0], 'com']
    else if (rest.startsWith('/*')) [m, cls] = [rest.match(/^\/\*[\s\S]*?\*\//)?.[0] ?? rest, 'com']
    else if (c === '/' && (prev === '' || '(,=:[!&|?{};'.includes(prev)) && (m = rest.match(/^\/(?:\\.|\[(?:\\.|[^\]\\\n])*\]|[^/\\\n[])+\/[dgimsuy]*/)?.[0])) cls = 're'
    else if (c === '`') [m, cls] = [rest.match(/^`(?:\\[\s\S]|[^`\\])*`/)?.[0] ?? c, 'str']
    else if (c === "'" || c === '"') [m, cls] = [rest.match(c === "'" ? /^'(?:\\.|[^'\\\n])*'/ : /^"(?:\\.|[^"\\\n])*"/)?.[0] ?? c, 'str']
    else if ((m = rest.match(/^\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?n?/i)?.[0])) cls = 'num'
    else if ((m = rest.match(/^[A-Za-z_$][\w$]*/)?.[0])) cls = KEYWORDS.has(m) ? 'kw' : null
    else m = c
    span(cls, m)
    i += m.length
    const t = m.trim()
    if (t) prev = cls === 'kw' && (t === 'return' || t === 'of' || t === 'in') ? '(' : t.slice(-1)
  }
  return out
}

// ---------- README.md -> HTML, split into sections ----------
function renderMarkdown(t: Task, md: string): string {
  return (marked.parse(md, { gfm: true, async: false }) as string)
    .replace(/<h3>/g, '<h4>').replace(/<\/h3>/g, '</h4>')
    .replace(/<table>/g, '<div class="tablewrap"><table>').replace(/<\/table>/g, '</table></div>')
    .replace(/<pre><code(?: class="[^"]*")?>/g, '<pre class="code"><code>')
    .replace(/<a href="([^"]+)"/g, (_, href: string) => {
      const url = /^(https?:|mailto:|#)/.test(href) ? href : `${BLOB}/${folder(t)}/${href}`
      return `<a href="${url}" target="_blank" rel="noopener"`
    })
}

// Short labels for the usual headings; other headings (the interesting ones, like "The official
// answers have a bug") keep their own text.
const sectionLabel = (heading: string) =>
  /^the task$/i.test(heading) ? 'The task'
    : /^answer$/i.test(heading) ? 'Answer'
      : /^checking it$/i.test(heading) ? 'How it’s checked'
        : /^(the idea|how to think about it)$/i.test(heading) ? 'The idea'
          : heading

function readmeSections(t: Task): { label: string; html: string }[] {
  const lines = readFileSync(join(t.dir, 'README.md'), 'utf8').replace(/\r\n/g, '\n').split('\n')
  // The page shows the title and the "CoderGames ... · Task n" line itself.
  while (lines.length && (lines[0]!.startsWith('# ') || lines[0]!.startsWith('**CoderGames') || !lines[0]!.trim())) lines.shift()
  const sections: { heading: string; body: string[] }[] = []
  for (const line of lines) {
    const m = line.match(/^## (.+)$/)
    if (m) sections.push({ heading: m[1]!, body: [] })
    else if (sections.length) sections.at(-1)!.body.push(line)
    else sections.push({ heading: '', body: [line] })
  }
  return sections
    .filter((s) => s.body.join('').trim())
    .map((s) => ({ label: sectionLabel(s.heading), html: renderMarkdown(t, s.body.join('\n')) }))
}

// ---------- visualisations ----------
// A task can have visual.js (runs in the browser) and visual.ts (runs here at build time and gives
// the heading, a one-line caption and, optionally, data computed from the task's files).
interface VisualMeta {
  title?: string
  caption: string
  data?: (dir: string) => unknown
}
const visuals = new Map<string, { title: string; caption: string; json: string; script: string }>()
async function loadVisual(t: Task) {
  const script = join(t.dir, 'visual.js')
  if (!existsSync(script)) return
  const meta: VisualMeta = existsSync(join(t.dir, 'visual.ts'))
    ? await import(pathToFileURL(join(t.dir, 'visual.ts')).href)
    : { caption: '' }
  const data = meta.data ? meta.data(t.dir) : null
  visuals.set(slug(t), {
    title: meta.title ?? 'Try it',
    caption: meta.caption,
    json: JSON.stringify(data).replace(/</g, '\\u003c'),
    script: readFileSync(script, 'utf8'),
  })
}

function visualSection(t: Task): string {
  const v = visuals.get(slug(t))
  if (!v) return ''
  return `<section class="visual" aria-labelledby="v-${slug(t)}">
          <div class="visual-head"><h3 id="v-${slug(t)}">${esc(v.title)}</h3>${v.caption ? `<p>${esc(v.caption)}</p>` : ''}</div>
          <div class="visual-body" data-visual="${slug(t)}"><p class="vis-loading">Loading the visualisation…</p></div>
          <noscript><p class="vis-note">The visualisation needs JavaScript.</p></noscript>
          ${v.json !== 'null' ? `<script type="application/json" id="vd-${slug(t)}">${v.json}</script>` : ''}
        </section>`
}

// ---------- playground files ----------
// For every solved task the site gets docs/play/<task>.in.txt (the input, cut down when it is
// huge) and docs/play/<task>.out.txt (what solution.ts prints for it). The playground runs the
// visitor's code on the first and compares the result with the second.
const PLAY_DIR = join(ROOT, 'docs', 'play')
const MAX_INPUT_BYTES = 3_000_000
const HEAD_LINES = 100_000
interface Play {
  input: string | null
  expected: string
  lines: number
  inputLines: number
  note: string
  multi: boolean
}
const plays = new Map<string, Play>()

// The first `lines` lines of a file, without reading all of it.
function readHead(path: string, lines: number): string {
  const fd = openSync(path, 'r')
  const buf = Buffer.alloc(16 * 1024 * 1024)
  const n = readSync(fd, buf, 0, buf.length, 0)
  closeSync(fd)
  const text = buf.subarray(0, n).toString('utf8')
  let at = -1
  for (let i = 0; i < lines; i++) {
    at = text.indexOf('\n', at + 1)
    if (at < 0) return text
  }
  return text.slice(0, at + 1)
}

function preparePlay(t: Task) {
  if (t.status === 'pending' || !existsSync(join(t.dir, 'solution.ts'))) return
  const s = slug(t)
  const source = inputPath(t)
  if (source && !existsSync(source)) return // a big input that was not downloaded
  mkdirSync(PLAY_DIR, { recursive: true })
  let note = ''
  let input: string | null = null
  if (source) {
    input = join(PLAY_DIR, `${s}.in.txt`)
    if (statSync(source).size > MAX_INPUT_BYTES) {
      writeFileSync(input, readHead(source, HEAD_LINES))
      note = `The real input is ${(statSync(source).size / 1e6).toFixed(0)} MB; the playground uses its first ${HEAD_LINES.toLocaleString('en-US')} lines.`
    } else writeFileSync(input, readFileSync(source))
  }
  const run = runSolution(t, input)
  if (run.error) {
    console.warn(`playground: ${t.id} failed: ${run.error}`)
    return
  }
  const expected = normalize(run.output)
  writeFileSync(join(PLAY_DIR, `${s}.out.txt`), expected + '\n')
  plays.set(s, {
    input: input ? `play/${s}.in.txt` : null,
    expected: `play/${s}.out.txt`,
    lines: expected.split('\n').length,
    inputLines: input ? readFileSync(input, 'utf8').split('\n').filter((l) => l.trim()).length : 0,
    note,
    multi: t.check === 'custom',
  })
}

const STARTER = `// solve(input) gets the whole input file as one string.
// Return the answer as a string (or print it with console.log).
function solve(input) {
  const lines = input.trim().split("\\n");

  return lines.length;
}
`

function playground(t: Task, statement: string): string {
  const s = slug(t)
  const p = plays.get(s)
  if (!p) return ''
  const inputInfo = p.input
    ? `<div class="pg-input">
            <p class="pg-label">Input <span>${p.inputLines.toLocaleString('en-US')} lines · showing the start</span> <a href="${p.input}" target="_blank" rel="noopener">open the whole file ↗</a></p>
            <pre class="code pg-input-text" data-src="${p.input}">Loading…</pre>
            ${p.note ? `<p class="vis-note">${esc(p.note)}</p>` : ''}
          </div>`
    : `<p class="vis-note">This task has no input file: <code>solve("")</code> should return the answer.</p>`
  return `<section class="playground" aria-labelledby="pg-${s}" data-slug="${s}" data-input="${p.input ?? ''}" data-expected="${p.expected}" data-multi="${p.multi ? 1 : 0}" hidden>
          <div class="pg-head">
            <h3 id="pg-${s}">Your turn</h3>
            <p>Write <code>solve(input)</code> in JavaScript and run it on the real input, right here in your browser. The answer is ${p.lines === 1 ? 'a single line' : `${p.lines.toLocaleString('en-US')} lines`}${t.country ? ', without the country' : ''}.</p>
          </div>
          <div class="pg-task prose">${statement}</div>
          ${inputInfo}
          <label class="pg-label" for="pg-code-${s}">Your code <span>saved in this browser</span></label>
          <textarea class="pg-code" id="pg-code-${s}" spellcheck="false" autocomplete="off" autocapitalize="off" rows="14">${esc(STARTER)}</textarea>
          <div class="vis-row">
            <button class="vis-btn primary" type="button" data-run>Run</button>
            <button class="vis-btn" type="button" data-reset>Start over</button>
            <span class="pg-status" aria-live="polite"></span>
          </div>
          <div class="pg-result" hidden></div>
        </section>`
}

// ---------- page parts ----------
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
const editionLabel = (e: Edition) => TAB_LABEL[e.id] ?? e.id
const solvedOf = (tasks: Task[]) => tasks.filter((t) => t.status !== 'pending')

// The best-of side bar on the home page: picked by hand (no per-task popularity data exists).
const BEST_OF: [id: string, why: string][] = [
  ['2026-2', 'A picture rebuilt from a shuffled log'],
  ['2022-5', 'The official answers have a bug'],
  ['2026-1', 'The hardest task, and a wrong example'],
  ['2020-3', 'Watch a cipher crack live'],
  ['2024-5', 'A puzzle you can play'],
  ['2023-5', '10,000 machines, provably optimal'],
  ['2023-4', 'NP-hard, solved in a blink'],
  ['2025-women-4', 'Dijkstra against the clock'],
]

const dots = (d?: number) =>
  d ? `<span class="dots" title="Difficulty ${d} of 5" aria-label="Difficulty ${d} of 5">${[1, 2, 3, 4, 5].map((i) => `<i${i <= d ? ' class="on"' : ''}></i>`).join('')}</span>` : ''

// Decorative bubbles for a hero: [left %, top %, size px].
const bubbles = (seed: number) =>
  [[62, 12, 54], [74, 58, 26], [88, 30, 72], [55, 70, 18], [93, 78, 34], [80, 8, 16]]
    .map(([l, t, s], i) => `<span class="bubble" style="left:${(l! + seed * 7 * (i % 2 ? -1 : 1)) % 96}%;top:${t}%;width:${s}px;height:${s}px"></span>`)
    .join('')

function extraFiles(t: Task): string[] {
  return readdirSync(t.dir)
    .filter((f) => /\.(ts|txt|json)$/.test(f) && !f.startsWith('visual') && !['solution.ts', 'task.json', 'answer.txt', 'example.txt'].includes(f) && !f.startsWith('input'))
    .concat(readdirSync(t.dir).filter((f) => f === 'input-original.txt'))
    .sort()
}

function taskPage(t: Task, prev: Task | undefined, next: Task | undefined): string {
  const s = slug(t)
  const pending = t.status === 'pending'
  const sections = readmeSections(t)
  const panels: { label: string; html: string }[] = [...sections]
  const solutionPath = join(t.dir, 'solution.ts')
  if (!pending && existsSync(solutionPath)) {
    const src = readFileSync(solutionPath, 'utf8').replace(/\r\n/g, '\n').trimEnd()
    panels.push({
      label: 'Code',
      html: `<p class="vis-note"><code>solution.ts</code> · ${plural(src.split('\n').length, 'line')} of TypeScript. It reads the input file and prints the answer.</p>
          <pre class="code code-full"><code>${highlight(src)}</code></pre>`,
    })
  }
  const details = pending
    ? `<div class="prose">${sections.map((x) => x.html).join('')}</div>`
    : `<div class="details">
          <div class="detail-bar" role="group" aria-label="Details">
            <span class="detail-label">Details</span>
            ${panels.map((p, i) => `<button class="detail-btn" type="button" aria-expanded="false" aria-controls="d-${s}-${i}">${esc(p.label)}</button>`).join('\n            ')}
          </div>
          ${panels.map((p, i) => `<div class="detail-panel prose" id="d-${s}-${i}" hidden>${p.html}</div>`).join('\n          ')}
        </div>`
  const extras = extraFiles(t)
    .map((f) => `<a href="${BLOB}/${folder(t)}/${f}" target="_blank" rel="noopener"><code>${f}</code></a>`)
    .join(' ')
  const links = [
    `<a href="${TREE}/${folder(t)}" target="_blank" rel="noopener">Task folder on GitHub</a>`,
    `<a href="${t.edition.source}" target="_blank" rel="noopener">Original task</a>`,
    extras ? `Also: ${extras}` : '',
  ]
    .filter(Boolean)
    .join('<span aria-hidden="true"> · </span>')
  const pager = `<nav class="pager" aria-label="More tasks">
          ${prev ? `<a href="#${slug(prev)}">← ${esc(prev.title)}</a>` : '<span></span>'}
          ${next ? `<a href="#${slug(next)}">${esc(next.title)} →</a>` : '<span></span>'}
        </nav>`

  return `<article class="task-page" id="task-${s}" aria-labelledby="h-${s}" hidden>
        <header class="hero hero-task">
          ${bubbles(t.number)}
          <div class="hero-copy">
            <div class="hero-blob">
              <p class="hero-kicker">${esc(t.edition.title)} · Task ${t.number}</p>
              <h2 class="hero-title" id="h-${s}">${esc(t.title)}</h2>
            </div>
            ${t.summary ? `<p class="hero-summary">${esc(t.summary)}</p>` : ''}
            <p class="hero-facts">
              ${t.result ? `<span class="task-result"><span>Answer</span>${esc(t.result)}</span>` : ''}
              ${t.country ? `<span class="fact"><span>Country</span>${esc(t.country)}</span>` : ''}
              ${t.difficulty ? `<span class="fact"><span>Difficulty</span>${dots(t.difficulty)}</span>` : ''}
              ${plays.has(s) ? `<button class="challenge-btn" type="button" data-challenge aria-pressed="false">Solve it yourself</button>` : ''}
            </p>
          </div>
          <figure class="hero-snap${pending ? ' empty' : ''}" aria-hidden="true"></figure>
        </header>
        ${playground(t, sections.find((x) => x.label === 'The task')?.html ?? '')}
        ${visualSection(t)}
        ${details}
        ${pager}
        <footer class="task-foot">
          ${t.topics.length ? `<ul class="chips" aria-label="Topics">${t.topics.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          <p class="task-links">${links}</p>
        </footer>
      </article>`
}

function editionView(e: Edition, tasks: Task[]): string {
  const first = solvedOf(tasks)[0] ?? tasks[0]!
  const done = solvedOf(tasks).length
  const tabs = tasks
    .map(
      (t) =>
        `<a class="task-tab${t.status === 'pending' ? ' pending' : ''}" href="#${slug(t)}" data-task="${slug(t)}"><span class="num">${t.number}</span>${esc(t.title)}${t.status === 'pending' ? ' (coming)' : ''}</a>`,
    )
    .join('\n      ')
  return `<section class="view wrap" id="v-${e.id}" data-edition="${e.id}" data-first="${slug(first)}" aria-label="${esc(e.title)}" hidden>
    <div class="edition-bar">
      <a class="back" href="#home">← All editions</a>
      <span class="edition-name">${esc(e.title)} <span>${esc(e.theme)} · ${esc(e.dates)} · ${done === tasks.length ? plural(done, 'task') : `${done} of ${tasks.length} tasks`}</span></span>
      <a class="orig" href="${e.source}" target="_blank" rel="noopener">Original tasks ↗</a>
    </div>
    <nav class="task-tabs" aria-label="Tasks of ${esc(e.title)}">
      ${tabs}
    </nav>
    ${tasks.map((t, i) => taskPage(t, tasks[i - 1], tasks[i + 1])).join('\n    ')}
  </section>`
}

function homeView(editions: Edition[], byEdition: Map<string, Task[]>): string {
  const all = editions.flatMap((e) => byEdition.get(e.id)!)
  const solved = solvedOf(all)
  const pending = all.length - solved.length
  const custom = solved.filter((t) => t.check === 'custom').length
  const byId = new Map(all.map((t) => [slug(t), t]))

  const editionCards = editions
    .map((e) => {
      const tasks = byEdition.get(e.id)!
      const done = solvedOf(tasks).length
      return `<li><a class="edition-card" href="#${e.id}">
          <div class="edition-snaps" aria-hidden="true">${solvedOf(tasks).slice(0, 4).map((t) => `<span class="snap" data-snap="${slug(t)}"></span>`).join('')}</div>
          <small>${esc(e.dates)}</small>
          <b>${esc(e.title)}</b>
          <span class="theme">${esc(e.theme)}</span>
          <span class="count">${done === tasks.length ? plural(done, 'task') : `${done} of ${tasks.length} tasks so far`}</span>
        </a></li>`
    })
    .join('\n        ')

  const rows = all
    .map(
      (t) => `<li class="task-row${t.status === 'pending' ? ' pending' : ''}" data-difficulty="${t.difficulty ?? 0}"><a href="#${slug(t)}">
          <span class="row-ed">${esc(editionLabel(t.edition))} · ${t.number}</span>
          <b>${esc(t.title)}${t.status === 'pending' ? ' (coming)' : ''}</b>
          ${dots(t.difficulty)}
          <span class="row-sum">${esc(t.summary ?? '')}</span>
        </a></li>`,
    )
    .join('\n        ')

  const best = BEST_OF.map(([id, why]) => {
    const t = byId.get(id)
    if (!t) return ''
    return `<li><a href="#${id}"><span class="snap" data-snap="${id}" aria-hidden="true"></span><span><small>${esc(editionLabel(t.edition))} · Task ${t.number}</small><b>${esc(t.title)}</b><span class="why">${esc(why)}</span></span></a></li>`
  }).join('\n        ')

  const findings = FINDINGS.map(([id, text]) => {
    const t = byId.get(id)!
    return `<li><a href="#${id}"><b>${esc(editionLabel(t.edition))} · ${esc(t.title)}</b></a> ${esc(text)}</li>`
  }).join('\n          ')

  return `<section class="view" id="v-home" aria-label="Home">
    <div class="wrap">
      <header class="hero hero-home">
        ${bubbles(0)}
        <div class="hero-blob">
          <p class="hero-kicker">2020–2026 · TypeScript</p>
          <h1>CoderGames<br>Solutions</h1>
        </div>
        <div>
          <p class="hero-lead">Every task of <a href="https://codergames.deutschetelekomitsolutions.sk/" target="_blank" rel="noopener">CoderGames</a>, the coding competition by Deutsche Telekom IT Solutions Slovakia: solved, visualised and explained.</p>
          <p class="hero-stats"><span><b>${solved.length}</b>tasks</span><span><b>${visuals.size}</b>visualisations</span><span><b>${editions.length}</b>editions</span><span><b>${FINDINGS.length}</b>official mistakes found</span></p>
        </div>
      </header>
      <div class="home-grid">
        <div class="home-main">
          <h2>Editions</h2>
          <ul class="edition-grid">
        ${editionCards}
          </ul>
          <h2>All tasks</h2>
          <div class="filter" role="group" aria-label="Filter by difficulty">
            <span>Difficulty</span>
            <button type="button" data-range="0-5" aria-pressed="true">All</button>
            <button type="button" data-range="1-2" aria-pressed="false">Easy</button>
            <button type="button" data-range="3-3" aria-pressed="false">Medium</button>
            <button type="button" data-range="4-5" aria-pressed="false">Hard</button>
            <span id="filterCount" aria-live="polite">${plural(all.length, 'task')}</span>
          </div>
          <ul class="task-list">
        ${rows}
          </ul>
          <details class="more">
            <summary>Mistakes found in the official material <span>${FINDINGS.length}</span></summary>
            <ul class="findings">
          ${findings}
            </ul>
          </details>
          <details class="more">
            <summary>How it’s built and checked</summary>
            <div class="more-body">
              <p>Every task has its own folder with the write-up, a standalone <code>solution.ts</code> that reads the input file and prints the answer (ready to paste into the submission form), the input and the official answer. <code>npm test</code> runs all of them and compares the output with the official answer. When several answers are equally correct, like a different but equally short path, the task gets its own <code>check.ts</code> (${custom} tasks) that validates the answer instead of comparing text.</p>
              <p>The visualisations are plain JavaScript with SVG or canvas, no framework. Each task folder has a <code>visual.js</code> that runs in the browser and a <code>visual.ts</code> that prepares its data from the real input at build time. Difficulty is my own 1–5 rating.${pending ? ` ${plural(pending, 'task')} of this year’s edition will be added once published.` : ''}</p>
            </div>
          </details>
        </div>
        <aside class="bestof" aria-labelledby="bestof-title">
          <h2 id="bestof-title">Best of</h2>
          <p>Picked by hand: the most interesting problems and visualisations. There is no public per-task popularity data.</p>
          <ol>
        ${best}
          </ol>
        </aside>
      </div>
    </div>
  </section>`
}

// ---------- the page ----------
const editions = ORDER.map((id) => loadEditions().find((e) => e.id === id)).filter((e): e is Edition => !!e)
const byEdition = new Map(editions.map((e) => [e.id, loadTasks(e)]))
for (const t of [...byEdition.values()].flat()) await loadVisual(t)
for (const t of [...byEdition.values()].flat()) preparePlay(t)
const total = solvedOf([...byEdition.values()].flat()).length
const DESCRIPTION = `All ${total} published CoderGames tasks (2020–2026) by Deutsche Telekom IT Solutions, solved in TypeScript, visualised and explained.`

const STYLE = readFileSync(join(ROOT, 'docs', 'src', 'style.css'), 'utf8')
const SCRIPT = [
  readFileSync(join(ROOT, 'docs', 'src', 'lib.js'), 'utf8'),
  ...[...visuals.entries()].map(([id, v]) => `// ----- visualisation ${id} -----\n${v.script}`),
  readFileSync(join(ROOT, 'docs', 'src', 'page.js'), 'utf8'),
  readFileSync(join(ROOT, 'docs', 'src', 'playground.js'), 'utf8'),
].join('\n')

const GITHUB_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`
const THEME_ICONS = `<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8z"/></svg>
        <svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5a1 1 0 0 1 1 1v1.8a1 1 0 0 1-2 0V2.5a1 1 0 0 1 1-1zm0 17.2a1 1 0 0 1 1 1v1.8a1 1 0 0 1-2 0v-1.8a1 1 0 0 1 1-1zM22.5 12a1 1 0 0 1-1 1h-1.8a1 1 0 0 1 0-2h1.8a1 1 0 0 1 1 1zM5.3 12a1 1 0 0 1-1 1H2.5a1 1 0 0 1 0-2h1.8a1 1 0 0 1 1 1zm13.1-6.4a1 1 0 0 1 0 1.4l-1.3 1.3a1 1 0 1 1-1.4-1.4l1.3-1.3a1 1 0 0 1 1.4 0zM8.3 15.7a1 1 0 0 1 0 1.4L7 18.4A1 1 0 0 1 5.6 17l1.3-1.3a1 1 0 0 1 1.4 0zm10.1 2.7a1 1 0 0 1-1.4 0l-1.3-1.3a1 1 0 0 1 1.4-1.4l1.3 1.3a1 1 0 0 1 0 1.4zM8.3 8.3a1 1 0 0 1-1.4 0L5.6 7A1 1 0 0 1 7 5.6l1.3 1.3a1 1 0 0 1 0 1.4z"/></svg>`

const body = `<header class="topbar">
  <div class="wrap">
    <a class="brandmark" href="#home"><i aria-hidden="true"></i>CoderGames Solutions</a>
    <p class="actions">
      <a class="pill" href="https://mazsola739.github.io/mazsola739/" target="_blank" rel="noopener">Portfolio</a>
      <a class="pill" href="${REPO}" target="_blank" rel="noopener">${GITHUB_ICON}Source code</a>
      <button class="pill icon theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark mode" title="Switch to dark mode">
        ${THEME_ICONS}
      </button>
    </p>
  </div>
</header>
<main id="main">
  ${homeView(editions, byEdition)}
  ${editions.map((e) => editionView(e, byEdition.get(e.id)!)).join('')}
  <footer class="site-foot">
    <div class="wrap">
      <p><b>© 2026 <a href="https://github.com/mazsola739" target="_blank" rel="noopener">mazsola739</a></b> · Task statements summarised in my own words; follow “Original task” for the full text</p>
      <p><a href="https://mazsola739.github.io/mazsola739/" target="_blank" rel="noopener">My portfolio</a> · Not an official Telekom page.</p>
    </div>
  </footer>
</main>
<script>
${SCRIPT}
</script>`

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap">`
const ICON = `data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Crect width=%2716%27 height=%2716%27 rx=%273%27 fill=%27%23e20074%27/%3E%3Cpath d=%27M11.5 4.5h-5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h5%27 stroke=%27white%27 stroke-width=%272%27 fill=%27none%27/%3E%3C/svg%3E`

const page = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${esc(DESCRIPTION)}">
<link rel="icon" href="${ICON}">
<meta property="og:type" content="website">
<meta property="og:title" content="CoderGames Solutions">
<meta property="og:description" content="${esc(DESCRIPTION)}">
<meta property="og:url" content="${PAGES}">
<title>CoderGames Solutions</title>
${FONTS}
<style>
${STYLE}
</style>
</head>
<body>
${body}
</body>
</html>
`

mkdirSync(join(ROOT, 'docs'), { recursive: true })
writeFileSync(join(ROOT, 'docs', 'index.html'), page)
console.log(`docs/index.html: ${(page.length / 1024).toFixed(0)} KB, ${total} tasks`)

const fragmentAt = process.argv.indexOf('--fragment')
if (fragmentAt > 0 && process.argv[fragmentAt + 1]) {
  // Same page without the document skeleton, for hosts that add their own.
  const fragment = `<title>CoderGames Solutions</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(DESCRIPTION)}">
${FONTS}
<script>if (!document.documentElement.hasAttribute("data-theme")) document.documentElement.setAttribute("data-theme", "light");</script>
<style>
${STYLE}
</style>
${body}
`
  writeFileSync(process.argv[fragmentAt + 1]!, fragment)
  console.log(`fragment: ${process.argv[fragmentAt + 1]}`)
}
