// Builds the GitHub Pages site: docs/index.html (English) and docs/hu.html (Hungarian), every
// edition and task with its write-up (README.md / README.hu.md) and solution, rendered at build
// time so the page needs no JavaScript to read.
// Usage: npm run docs                  writes docs/index.html and docs/hu.html
//        npm run docs -- --fragment F  also writes the English page body alone to F (for previews)
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, openSync, readSync, closeSync } from 'node:fs'
import { join, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import { marked } from 'marked'
import { ROOT, loadEditions, loadTasks, runSolution, inputPath, normalize, type Edition, type Task } from './tasks.ts'

const REPO = 'https://github.com/mazsola739/rika-codergames'
const BLOB = `${REPO}/blob/main`
const TREE = `${REPO}/tree/main`
const PAGES = 'https://mazsola739.github.io/rika-codergames/'

// ---------- language ----------
// The page is built once per language. tr() picks the text for the one being built; loc() swaps
// in an edition's or task's Hungarian fields (anything missing stays English).
type Lang = 'en' | 'hu'
let LANG: Lang = 'en'
const tr = (en: string, hu: string) => (LANG === 'hu' ? hu : en)
const loc = <X extends { hu?: object }>(x: X): X => (LANG === 'hu' && x.hu ? { ...x, ...x.hu } : x)
const num = (n: number) => n.toLocaleString(LANG === 'hu' ? 'hu-HU' : 'en-US')
// "3 tasks" / "3 feladat" (Hungarian keeps the noun singular after a number).
const count = (n: number, en: string, hu: string) => (LANG === 'hu' ? `${num(n)} ${hu}` : `${num(n)} ${en}${n === 1 ? '' : 's'}`)
const SITE = () => tr('CoderGames Solutions', 'CoderGames megoldások')

// Newest first; the women's edition follows the 2025 one.
const ORDER = ['2026', '2025', '2025-women', '2024', '2023', '2022', '2021', '2020']
const TAB_LABEL: Record<string, string> = { '2025-women': 'Women 2025' }

// Mistakes in the official material that the solutions ran into (task id -> one line).
const FINDINGS: [id: string, en: string, hu: string][] = [
  [
    '2022-5',
    'The official answers are wrong for 93 of the 103 maps. A Python negative index in the published solution lets islands leak across the edges of the map.',
    'A hivatalos válaszok a 103 térképből 93-nál hibásak. A közzétett megoldásban egy negatív Python-index miatt a szigetek átszivárognak a térkép szélein.',
  ],
  [
    '2023-5',
    'The official packing uses two machines twice. The real optimum, proven by branch and bound, is 743,529.61.',
    'A hivatalos beosztás két gépet kétszer használ. A valódi optimum, korlátozás és szétválasztás módszerrel bizonyítva: 743 529,61.',
  ],
  ['2026-1', 'The expected output of the example (2 199) sells nothing at all. The best choice is 4 200.', 'A példa várt kimenete (2 199) egyáltalán nem ad el semmit. A legjobb választás a 4 200.'],
  ['2025-women-4', "The example's explanation contradicts the official results: only the departure time counts.", 'A példa magyarázata ellentmond a hivatalos eredményeknek: csak az indulási idő számít.'],
  ['2025-women-5', 'The example marks a correct test as faulty.', 'A példa egy helyes tesztet hibásnak jelöl.'],
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

// The usual headings (in either language) get a key and a short label; other headings (the
// interesting ones, like "The official answers have a bug") keep their own text.
type SectionKey = 'task' | 'idea' | 'answer' | 'check' | null
function sectionKey(heading: string): SectionKey {
  if (/^(the task|a feladat)$/i.test(heading)) return 'task'
  if (/^(answer|a válasz|válasz)$/i.test(heading)) return 'answer'
  if (/^(checking it|ellenőrzés|az ellenőrzés)$/i.test(heading)) return 'check'
  if (/^(the idea|how to think about it|az ötlet)$/i.test(heading)) return 'idea'
  return null
}
const SECTION_LABEL = {
  task: () => tr('The task', 'A feladat'),
  idea: () => tr('The idea', 'Az ötlet'),
  answer: () => tr('Answer', 'Válasz'),
  check: () => tr('How it’s checked', 'Ellenőrzés'),
}

interface Section {
  key: SectionKey
  label: string
  html: string
}
function readmeSections(t: Task): Section[] {
  const hu = join(t.dir, 'README.hu.md')
  const file = LANG === 'hu' && existsSync(hu) ? hu : join(t.dir, 'README.md')
  const lines = readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split('\n')
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
    .map((s) => {
      const key = sectionKey(s.heading)
      return { key, label: key ? SECTION_LABEL[key]() : s.heading, html: renderMarkdown(t, s.body.join('\n')) }
    })
}

// ---------- visualisations ----------
// A task can have visual.js (runs in the browser) and visual.ts (runs here at build time and gives
// the heading, a one-line caption, their Hungarian versions and, optionally, data computed from the
// task's files). Strings inside visual.js go through CG.t(english, hungarian).
interface VisualMeta {
  title?: string
  caption: string
  hu?: { title?: string; caption?: string }
  data?: (dir: string) => unknown
}
const visuals = new Map<string, { title: string; caption: string; hu: { title?: string; caption?: string }; json: string; script: string }>()
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
    hu: meta.hu ?? {},
    json: JSON.stringify(data).replace(/</g, '\\u003c'),
    script: readFileSync(script, 'utf8'),
  })
}

function visualSection(t: Task): string {
  const v = visuals.get(slug(t))
  if (!v) return ''
  const title = LANG === 'hu' ? (v.hu.title ?? (v.title === 'Try it' ? 'Próbáld ki' : v.title)) : v.title
  const caption = LANG === 'hu' ? (v.hu.caption ?? v.caption) : v.caption
  return `<section class="visual" aria-labelledby="v-${slug(t)}">
          <div class="visual-head"><h3 id="v-${slug(t)}">${esc(title)}</h3>${caption ? `<p>${esc(caption)}</p>` : ''}</div>
          <div class="visual-body" data-visual="${slug(t)}"><p class="vis-loading">${tr('Loading the visualisation…', 'A vizualizáció betöltése…')}</p></div>
          <noscript><p class="vis-note">${tr('The visualisation needs JavaScript.', 'A vizualizációhoz JavaScript kell.')}</p></noscript>
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
  /** Size of the real input in MB, when the playground only uses its start. */
  cutMB: number | null
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
  let cutMB: number | null = null
  let input: string | null = null
  if (source) {
    input = join(PLAY_DIR, `${s}.in.txt`)
    if (statSync(source).size > MAX_INPUT_BYTES) {
      writeFileSync(input, readHead(source, HEAD_LINES))
      cutMB = Math.round(statSync(source).size / 1e6)
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
    cutMB,
    multi: t.check === 'custom',
  })
}

const STARTER = () =>
  tr(
    `// solve(input) gets the whole input file as one string.
// Return the answer as a string (or print it with console.log).
`,
    `// A solve(input) egyetlen szövegként kapja meg a teljes bemeneti fájlt.
// A választ add vissza szövegként (vagy írd ki console.log-gal).
`,
  ) +
  `function solve(input) {
  const lines = input.trim().split("\\n");

  return lines.length;
}
`

function playground(t: Task): string {
  const s = slug(t)
  const p = plays.get(s)
  if (!p) return ''
  const note = p.cutMB
    ? tr(
        `The real input is ${p.cutMB} MB; the playground uses its first ${num(HEAD_LINES)} lines.`,
        `A valódi bemenet ${p.cutMB} MB; a játszótér az első ${num(HEAD_LINES)} sorát használja.`,
      )
    : ''
  const inputInfo = p.input
    ? `<div class="pg-input">
            <p class="pg-label">${tr('Input', 'Bemenet')} <span>${tr(`${num(p.inputLines)} lines · showing the start`, `${num(p.inputLines)} sor · az eleje látszik`)}</span> <a href="${p.input}" target="_blank" rel="noopener">${tr('open the whole file ↗', 'a teljes fájl ↗')}</a></p>
            <pre class="code pg-input-text" data-src="${p.input}">${tr('Loading…', 'Betöltés…')}</pre>
            ${note ? `<p class="vis-note">${esc(note)}</p>` : ''}
          </div>`
    : `<p class="vis-note">${tr('This task has no input file: <code>solve("")</code> should return the answer.', 'Ennek a feladatnak nincs bemeneti fájlja: a <code>solve("")</code> adja vissza a választ.')}</p>`
  const size = p.lines === 1 ? tr('a single line', 'egyetlen sor') : count(p.lines, 'line', 'sor')
  return `<section class="playground" aria-labelledby="pg-${s}" data-slug="${s}" data-input="${p.input ?? ''}" data-expected="${p.expected}" data-multi="${p.multi ? 1 : 0}" hidden>
          <div class="pg-head">
            <h3 id="pg-${s}">${tr('Your turn', 'Te jössz')}</h3>
            <p>${tr(
              `Write <code>solve(input)</code> in JavaScript and run it on the real input, right here in your browser. The answer is ${size}${t.country ? ', without the country' : ''}.`,
              `Írd meg a <code>solve(input)</code> függvényt JavaScriptben, és futtasd a valódi bemeneten, itt a böngészőben. A válasz ${size}${t.country ? ', az ország nélkül' : ''}.`,
            )}</p>
          </div>
          ${inputInfo}
          <label class="pg-label" for="pg-code-${s}">${tr('Your code', 'A kódod')} <span>${tr('saved in this browser', 'ebben a böngészőben marad meg')}</span></label>
          <textarea class="pg-code" id="pg-code-${s}" spellcheck="false" autocomplete="off" autocapitalize="off" rows="14">${esc(STARTER())}</textarea>
          <div class="vis-row">
            <button class="vis-btn primary" type="button" data-run>${tr('Run', 'Futtatás')}</button>
            <button class="vis-btn" type="button" data-reset>${tr('Start over', 'Újrakezdés')}</button>
            <span class="pg-status" aria-live="polite"></span>
          </div>
          <div class="pg-result" hidden></div>
        </section>`
}

// ---------- page parts ----------
const editionLabel = (e: Edition) => TAB_LABEL[e.id] ?? e.id
const solvedOf = (tasks: Task[]) => tasks.filter((t) => t.status !== 'pending')
const taskOf = (n: number) => tr(`Task ${n}`, `${n}. feladat`)
const coming = () => tr(' (coming)', ' (hamarosan)')

// The best-of side bar on the home page: picked by hand (no per-task popularity data exists).
const BEST_OF: [id: string, en: string, hu: string][] = [
  ['2026-2', 'A picture rebuilt from a shuffled log', 'Egy kép, összerakva egy összekevert naplóból'],
  ['2022-5', 'The official answers have a bug', 'A hivatalos válaszokban hiba van'],
  ['2026-1', 'The hardest task, and a wrong example', 'A legnehezebb feladat, hibás példával'],
  ['2020-3', 'Watch a cipher crack live', 'Nézd, ahogy feltörik egy titkosírást'],
  ['2024-5', 'A puzzle you can play', 'Kirakós, amit ki is próbálhatsz'],
  ['2023-5', '10,000 machines, provably optimal', '10 000 gép, bizonyíthatóan optimálisan'],
  ['2023-4', 'NP-hard, solved in a blink', 'NP-nehéz, mégis egy pillanat alatt megvan'],
  ['2025-women-4', 'Dijkstra against the clock', 'Dijkstra az órával versenyt futva'],
]

const dots = (d?: number) => {
  if (!d) return ''
  const label = tr(`Difficulty ${d} of 5`, `Nehézség: ${d}/5`)
  return `<span class="dots" title="${label}" aria-label="${label}">${[1, 2, 3, 4, 5].map((i) => `<i${i <= d ? ' class="on"' : ''}></i>`).join('')}</span>`
}

// The hero background (lines of code) is drawn in the browser from this seed, so each page differs.
// Each banner gets its own pattern, from the task's id.
const seedOf = (id: string) => [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 2147483647, 7)
const heroArt = (seed: number) => `<div class="hero-art" data-seed="${seed}" aria-hidden="true"></div>`

function extraFiles(t: Task): string[] {
  return readdirSync(t.dir)
    .filter((f) => /\.(ts|txt|json)$/.test(f) && !f.startsWith('visual') && !['solution.ts', 'task.json', 'answer.txt', 'example.txt'].includes(f) && !f.startsWith('input'))
    .concat(readdirSync(t.dir).filter((f) => f === 'input-original.txt'))
    .sort()
}

function taskPage(t: Task, prev: Task | undefined, next: Task | undefined): string {
  const s = slug(t)
  const T = loc(t)
  const E = loc(t.edition)
  const pending = t.status === 'pending'
  const sections = readmeSections(t)
  const statement = sections.find((x) => x.key === 'task')
  const panels: { key?: SectionKey; label: string; html: string }[] = sections.filter((x) => x !== statement)
  if (T.result && !pending) {
    const line = `<p class="answer-line">${esc(T.result)}${T.country ? `<span>${tr('Country', 'Ország')}: ${esc(T.country)}</span>` : ''}</p>`
    const answer = panels.find((p) => p.key === 'answer')
    if (answer) answer.html = line + answer.html
    else panels.splice(Math.min(1, panels.length), 0, { key: 'answer', label: SECTION_LABEL.answer(), html: line })
  }
  const solutionPath = join(t.dir, 'solution.ts')
  if (!pending && existsSync(solutionPath)) {
    const src = readFileSync(solutionPath, 'utf8').replace(/\r\n/g, '\n').trimEnd()
    const lines = src.split('\n').length
    panels.push({
      label: tr('Code', 'Kód'),
      html: `<p class="vis-note"><code>solution.ts</code> · ${tr(
        `${count(lines, 'line', 'sor')} of TypeScript. It reads the input file and prints the answer.`,
        `${count(lines, 'line', 'sor')} TypeScript. Beolvassa a bemeneti fájlt, és kiírja a választ.`,
      )}</p>
          <pre class="code code-full"><code>${highlight(src)}</code></pre>`,
    })
  }
  const details = pending
    ? `<section class="prose">${sections.map((x) => x.html).join('')}</section>`
    : `<section class="details" aria-labelledby="sol-${s}">
          <div class="sec-head"><h3 id="sol-${s}">${tr('Solution', 'Megoldás')}</h3><p>${tr('Folded until you open it, so you can think first.', 'Csak akkor nyílik ki, ha rákattintasz, így előbb te gondolkodhatsz.')}</p></div>
          <div class="detail-bar" role="group" aria-label="${tr('Solution', 'Megoldás')}">
            ${panels.map((p, i) => `<button class="detail-btn" type="button" aria-expanded="false" aria-controls="d-${s}-${i}">${esc(p.label)}</button>`).join('\n            ')}
          </div>
          ${panels.map((p, i) => `<div class="detail-panel prose" id="d-${s}-${i}" hidden>${p.html}</div>`).join('\n          ')}
        </section>`
  const extras = extraFiles(t)
    .map((f) => `<a href="${BLOB}/${folder(t)}/${f}" target="_blank" rel="noopener"><code>${f}</code></a>`)
    .join(' ')
  const links = [
    `<a href="${TREE}/${folder(t)}" target="_blank" rel="noopener">${tr('Task folder on GitHub', 'A feladat mappája a GitHubon')}</a>`,
    extras ? `${tr('Also', 'Még')}: ${extras}` : '',
  ]
    .filter(Boolean)
    .join('<span aria-hidden="true"> · </span>')
  const pager = `<nav class="pager" aria-label="${tr('More tasks', 'További feladatok')}">
          ${prev ? `<a href="#${slug(prev)}">← ${esc(loc(prev).title)}</a>` : '<span></span>'}
          ${next ? `<a href="#${slug(next)}">${esc(loc(next).title)} →</a>` : '<span></span>'}
        </nav>`

  return `<article class="task-page" id="task-${s}" aria-labelledby="h-${s}" hidden>
        <header class="hero hero-task">
          ${heroArt(seedOf(slug(t)))}
          <div class="hero-copy">
            <div class="hero-heading">
              <p class="hero-kicker">${esc(E.title)} · ${taskOf(t.number)}</p>
              <h2 class="hero-title" id="h-${s}">${esc(T.title)}</h2>
            </div>
            ${T.summary ? `<p class="hero-summary">${esc(T.summary)}</p>` : ''}
            <p class="hero-meta">
              ${t.difficulty ? `<span>${tr('Difficulty', 'Nehézség')} ${dots(t.difficulty)}</span>` : ''}
              ${plays.has(s) ? `<button class="challenge-btn" type="button" data-challenge aria-pressed="false">${tr('Solve it yourself', 'Oldd meg te')}</button>` : ''}
            </p>
          </div>
          <figure class="hero-snap${pending ? ' empty' : ''}" aria-hidden="true"></figure>
        </header>
        <div class="sheet">
          ${statement && !pending ? `<section class="task-statement prose" aria-labelledby="t-${s}"><h3 id="t-${s}">${SECTION_LABEL.task()}</h3>${statement.html}</section>` : ''}
          ${playground(t)}
          ${visualSection(t)}
          ${details}
        </div>
        ${pager}
        <footer class="task-foot">
          ${T.topics.length ? `<ul class="chips" aria-label="${tr('Topics', 'Témák')}">${T.topics.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          <p class="task-links">${links}</p>
        </footer>
      </article>`
}

function editionView(e: Edition, tasks: Task[]): string {
  const E = loc(e)
  const first = solvedOf(tasks)[0] ?? tasks[0]!
  const done = solvedOf(tasks).length
  const tabs = tasks
    .map(
      (t) =>
        `<a class="task-tab${t.status === 'pending' ? ' pending' : ''}" href="#${slug(t)}" data-task="${slug(t)}"><span class="num">${t.number}</span>${esc(loc(t).title)}${t.status === 'pending' ? coming() : ''}</a>`,
    )
    .join('\n      ')
  const progress = done === tasks.length ? count(done, 'task', 'feladat') : tr(`${done} of ${tasks.length} tasks`, `${done}/${tasks.length} feladat`)
  return `<section class="view wrap" id="v-${e.id}" data-edition="${e.id}" data-first="${slug(first)}" aria-label="${esc(E.title)}" hidden>
    <div class="edition-bar">
      <a class="back" href="#home">${tr('← All editions', '← Összes verseny')}</a>
      <span class="edition-name">${esc(E.title)} <span>${esc(E.theme)} · ${esc(E.dates)} · ${progress}</span></span>
    </div>
    <nav class="task-tabs" aria-label="${tr(`Tasks of ${esc(E.title)}`, `${esc(E.title)} feladatai`)}">
      ${tabs}
    </nav>
    ${tasks.map((t, i) => taskPage(t, tasks[i - 1], tasks[i + 1])).join('\n    ')}
  </section>`
}

function homeView(editions: Edition[], byEdition: Map<string, Task[]>): string {
  const all = editions.flatMap((e) => byEdition.get(e.id)!)
  const solved = solvedOf(all)
  const byId = new Map(all.map((t) => [slug(t), t]))

  const editionCards = editions
    .map((e) => {
      const E = loc(e)
      const tasks = byEdition.get(e.id)!
      const done = solvedOf(tasks).length
      return `<li><a class="edition-card" href="#${e.id}">
          <div class="edition-snaps" aria-hidden="true">${solvedOf(tasks).slice(0, 4).map((t) => `<span class="snap" data-snap="${slug(t)}"></span>`).join('')}</div>
          <small>${esc(E.dates)}</small>
          <b>${esc(E.title)}</b>
          <span class="theme">${esc(E.theme)}</span>
          <span class="count">${done === tasks.length ? count(done, 'task', 'feladat') : tr(`${done} of ${tasks.length} tasks so far`, `eddig ${done}/${tasks.length} feladat`)}</span>
        </a></li>`
    })
    .join('\n        ')

  const rows = all
    .map((t) => {
      const T = loc(t)
      return `<li class="task-row${t.status === 'pending' ? ' pending' : ''}" data-difficulty="${t.difficulty ?? 0}"><a href="#${slug(t)}">
          <span class="row-ed">${esc(editionLabel(t.edition))} · ${t.number}</span>
          <b>${esc(T.title)}${t.status === 'pending' ? coming() : ''}</b>
          ${dots(t.difficulty)}
          <span class="row-sum">${esc(T.summary ?? '')}</span>
        </a></li>`
    })
    .join('\n        ')

  const best = BEST_OF.map(([id, en, hu]) => {
    const t = byId.get(id)
    if (!t) return ''
    return `<li><a href="#${id}"><span class="snap" data-snap="${id}" aria-hidden="true"></span><span><small>${esc(editionLabel(t.edition))} · ${taskOf(t.number)}</small><b>${esc(loc(t).title)}</b><span class="why">${esc(tr(en, hu))}</span></span></a></li>`
  }).join('\n        ')

  const site = tr('CoderGames <em>Solutions</em>', 'CoderGames <em>megoldások</em>')
  const cg = `<a href="https://codergames.deutschetelekomitsolutions.sk/" target="_blank" rel="noopener">CoderGames</a>`
  return `<section class="view" id="v-home" aria-label="${tr('Home', 'Kezdőlap')}">
    <div class="wrap">
      <header class="hero hero-home">
        ${heroArt(2026)}
        <div class="hero-heading">
          <p class="hero-kicker">2020–2026 · TypeScript</p>
          <h1>${site}</h1>
        </div>
        <div>
          <p class="hero-lead">${tr(
            `Every task of ${cg}, the coding competition by Deutsche Telekom IT Solutions Slovakia: solved, visualised and explained.`,
            `A ${cg}, a Deutsche Telekom IT Solutions Slovakia programozóversenyének összes feladata: megoldva, vizualizálva és elmagyarázva.`,
          )}</p>
          <p class="hero-stats"><span><b>${solved.length}</b>${tr('tasks', 'feladat')}</span><span><b>${visuals.size}</b>${tr('visualisations', 'vizualizáció')}</span><span><b>${editions.length}</b>${tr('editions', 'verseny')}</span><span><b>${FINDINGS.length}</b>${tr('official mistakes found', 'hiba a hivatalos anyagban')}</span></p>
        </div>
      </header>
      <div class="home-grid">
        <div class="home-main">
          <h2>${tr('Editions', 'Versenyek')}</h2>
          <ul class="edition-grid">
        ${editionCards}
          </ul>
          <h2>${tr('All tasks', 'Összes feladat')}</h2>
          <div class="filter" role="group" aria-label="${tr('Filter by difficulty', 'Szűrés nehézség szerint')}">
            <span>${tr('Difficulty', 'Nehézség')}</span>
            <button type="button" data-range="0-5" aria-pressed="true">${tr('All', 'Mind')}</button>
            <button type="button" data-range="1-2" aria-pressed="false">${tr('Easy', 'Könnyű')}</button>
            <button type="button" data-range="3-3" aria-pressed="false">${tr('Medium', 'Közepes')}</button>
            <button type="button" data-range="4-5" aria-pressed="false">${tr('Hard', 'Nehéz')}</button>
            <span id="filterCount" aria-live="polite">${count(all.length, 'task', 'feladat')}</span>
          </div>
          <ul class="task-list">
        ${rows}
          </ul>
          <p class="about-link"><a href="#about">${tr('About this site: sources, how it’s checked, mistakes found →', 'Az oldalról: források, ellenőrzés, talált hibák →')}</a></p>
        </div>
        <aside class="bestof" aria-labelledby="bestof-title">
          <h2 id="bestof-title">${tr('Best of', 'Válogatás')}</h2>
          <p>${tr(
            'Picked by hand: the most interesting problems and visualisations. There is no public per-task popularity data.',
            'Kézzel válogatva: a legérdekesebb feladatok és vizualizációk. Feladatonkénti népszerűségi adat nincs nyilvánosan.',
          )}</p>
          <ol>
        ${best}
          </ol>
        </aside>
      </div>
    </div>
  </section>`
}

function aboutView(editions: Edition[], byEdition: Map<string, Task[]>): string {
  const all = editions.flatMap((e) => byEdition.get(e.id)!)
  const solved = solvedOf(all)
  const custom = solved.filter((t) => t.check === 'custom').length
  const byId = new Map(all.map((t) => [slug(t), t]))
  const sources = editions
    .map((e) => {
      const E = loc(e)
      return `<li><a href="${e.source}" target="_blank" rel="noopener">${esc(E.title)}</a> <span>${esc(E.dates)} · ${esc(E.theme)}</span></li>`
    })
    .join('\n          ')
  const findings = FINDINGS.map(([id, en, hu]) => {
    const t = byId.get(id)!
    return `<li><a href="#${id}"><b>${esc(editionLabel(t.edition))} · ${esc(loc(t).title)}</b></a> ${esc(tr(en, hu))}</li>`
  }).join('\n          ')
  const cg = `<a href="https://codergames.deutschetelekomitsolutions.sk/" target="_blank" rel="noopener">CoderGames</a>`
  const github = `<a href="${REPO}" target="_blank" rel="noopener">GitHub</a>`
  const body =
    LANG === 'hu'
      ? `<h3>Mi a CoderGames?</h3>
        <p>A ${cg} egyhetes online programozóverseny: naponta egy feladat, pont jár a helyes válaszért és a gyorsaságért is. Diákok és a Deutsche Telekom több országban dolgozó munkatársai külön kategóriában versenyeznek.</p>
        <h3>Források</h3>
        <p>Az eredeti feladatleírások, bemenetek és hivatalos válaszok a verseny oldalain jelentek meg, versenyenként külön oldalon. Az itteni leírások rövid összefoglalók, saját szavaimmal.</p>
        <ul class="sources">
          ${sources}
        </ul>
        <h3>Hogyan készült, és hogyan ellenőrzöm?</h3>
        <p>Minden feladatnak saját mappája van: benne a leírás, egy önálló <code>solution.ts</code>, ami beolvassa a bemeneti fájlt és kiírja a választ (pont úgy, ahogy a beküldő űrlapba kell), a bemenet és a hivatalos válasz. Az <code>npm test</code> mind a ${solved.length} megoldást lefuttatja, és összeveti a kimenetet a hivatalos válasszal. Ahol több egyformán helyes válasz is lehet, például egy másik, de ugyanolyan rövid út, ott a feladatnak saját <code>check.ts</code>-e van (${custom} feladatnál), ami szövegösszevetés helyett a válasz helyességét vizsgálja.</p>
        <p>A vizualizációk sima JavaScriptben készültek, SVG-vel vagy canvasszal, keretrendszer nélkül: minden feladatmappában van egy <code>visual.js</code>, ami a böngészőben fut, és egy <code>visual.ts</code>, ami építéskor előkészíti az adatokat a valódi bemenetből. A játszótér a te <code>solve(input)</code> függvényedet egy Web Workerben futtatja, és összeveti a kimenetét a megoldáséval. A nehézség az én 1–5-ös értékelésem. A kód a ${github}on van.</p>
        <h3>Hibák a hivatalos anyagban</h3>
        <ul class="findings">
          ${findings}
        </ul>
        <h3>Jogi nyilatkozat</h3>
        <p>Ez nem hivatalos Telekom-oldal. A feladatok, a bemenetek és a hivatalos válaszok a szervezőkéi.</p>`
      : `<h3>What CoderGames is</h3>
        <p>${cg} is a week-long online coding competition: one task a day, points for correct answers and for speed. Students and Deutsche Telekom employees from several countries take part in separate categories.</p>
        <h3>Sources</h3>
        <p>The original task statements, inputs and official answers are published on the competition’s pages, one per edition. The task descriptions here are short summaries in my own words.</p>
        <ul class="sources">
          ${sources}
        </ul>
        <h3>How it’s built and checked</h3>
        <p>Every task has its own folder with the write-up, a standalone <code>solution.ts</code> that reads the input file and prints the answer (ready to paste into the submission form), the input and the official answer. <code>npm test</code> runs all ${solved.length} of them and compares the output with the official answer. When several answers are equally correct, like a different but equally short path, the task gets its own <code>check.ts</code> (${custom} tasks) that validates the answer instead of comparing text.</p>
        <p>The visualisations are plain JavaScript with SVG or canvas, no framework: each task folder has a <code>visual.js</code> that runs in the browser and a <code>visual.ts</code> that prepares its data from the real input at build time. The playground runs your <code>solve(input)</code> in a Web Worker and compares its output with the solution’s. Difficulty is my own 1–5 rating. The code is on ${github}.</p>
        <h3>Mistakes found in the official material</h3>
        <ul class="findings">
          ${findings}
        </ul>
        <h3>Disclaimer</h3>
        <p>This is not an official Telekom page. The tasks, their inputs and the official answers belong to the organisers.</p>`
  return `<section class="view" id="v-about" data-page="about" aria-label="${tr('About', 'Az oldalról')}" hidden>
    <div class="wrap">
      <header class="hero hero-home">
        ${heroArt(4242)}
        <div class="hero-heading">
          <p class="hero-kicker">${tr('About', 'Az oldalról')}</p>
          <h2 class="hero-title">${tr('About this site', 'Erről az oldalról')}</h2>
        </div>
        <p class="hero-lead">${tr(
          'An unofficial collection: every published CoderGames task, solved in TypeScript, explained in my own words and visualised.',
          'Nem hivatalos gyűjtemény: a CoderGames összes közzétett feladata TypeScriptben megoldva, saját szavaimmal elmagyarázva és vizualizálva.',
        )}</p>
      </header>
      <div class="about prose">
        ${body}
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

// The other language's page, opened on the same task (page.js adds the #hash on click).
const FILE: Record<Lang, string> = { en: 'index.html', hu: 'hu.html' }
const HREF: Record<Lang, string> = { en: './', hu: 'hu.html' }

function render(): { page: string; body: string; description: string } {
  const other: Lang = LANG === 'en' ? 'hu' : 'en'
  const description = tr(
    `All ${total} published CoderGames tasks (2020–2026) by Deutsche Telekom IT Solutions, solved in TypeScript, visualised and explained.`,
    `A Deutsche Telekom IT Solutions CoderGames versenyének mind a ${total} közzétett feladata (2020–2026), TypeScriptben megoldva, vizualizálva és elmagyarázva.`,
  )
  const body = `<header class="topbar">
  <div class="wrap">
    <a class="brandmark" href="#home"><i aria-hidden="true"></i>${SITE()}</a>
    <p class="actions">
      <a class="pill" href="#about">${tr('About', 'Az oldalról')}</a>
      <a class="pill" href="https://mazsola739.github.io/mazsola739/" target="_blank" rel="noopener">${tr('Portfolio', 'Portfólió')}</a>
      <a class="pill" href="${REPO}" target="_blank" rel="noopener">${GITHUB_ICON}${tr('Source code', 'Forráskód')}</a>
      <a class="pill lang-switch" href="${HREF[other]}" hreflang="${other}" lang="${other}" data-lang-switch>${other === 'hu' ? 'Magyar' : 'English'}</a>
      <button class="pill icon theme-toggle" id="themeToggle" type="button" aria-label="${tr('Switch to dark mode', 'Sötét mód')}" title="${tr('Switch to dark mode', 'Sötét mód')}">
        ${THEME_ICONS}
      </button>
    </p>
  </div>
</header>
<main id="main">
  ${homeView(editions, byEdition)}
  ${editions.map((e) => editionView(e, byEdition.get(e.id)!)).join('')}
  ${aboutView(editions, byEdition)}
  <footer class="site-foot">
    <div class="wrap">
      <p><b>© 2026 <a href="https://github.com/mazsola739" target="_blank" rel="noopener">mazsola739</a></b> · ${tr(
        'Task statements summarised in my own words; <a href="#about">sources</a>',
        'A feladatleírásokat saját szavaimmal foglaltam össze; <a href="#about">források</a>',
      )}</p>
      <p><a href="https://mazsola739.github.io/mazsola739/" target="_blank" rel="noopener">${tr('My portfolio', 'A portfólióm')}</a> · ${tr('Not an official Telekom page.', 'Nem hivatalos Telekom-oldal.')}</p>
    </div>
  </footer>
</main>
<script>
${SCRIPT}
</script>`

  const page = `<!doctype html>
<html lang="${LANG}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${esc(description)}">
<link rel="icon" href="${ICON}">
<link rel="alternate" hreflang="en" href="${PAGES}">
<link rel="alternate" hreflang="hu" href="${PAGES}hu.html">
<meta property="og:type" content="website">
<meta property="og:title" content="${SITE()}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${PAGES}${LANG === 'hu' ? 'hu.html' : ''}">
<title>${SITE()}</title>
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
  return { page, body, description }
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap">`
const ICON = `data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Crect width=%2716%27 height=%2716%27 rx=%273%27 fill=%27%23e20074%27/%3E%3Cpath d=%27M11.5 4.5h-5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h5%27 stroke=%27white%27 stroke-width=%272%27 fill=%27none%27/%3E%3C/svg%3E`

mkdirSync(join(ROOT, 'docs'), { recursive: true })
let english = { page: '', body: '', description: '' }
for (const lang of ['en', 'hu'] as const) {
  LANG = lang
  const out = render()
  if (lang === 'en') english = out
  writeFileSync(join(ROOT, 'docs', FILE[lang]), out.page)
  console.log(`docs/${FILE[lang]}: ${(out.page.length / 1024).toFixed(0)} KB, ${total} tasks`)
}

const fragmentAt = process.argv.indexOf('--fragment')
if (fragmentAt > 0 && process.argv[fragmentAt + 1]) {
  // The English page without the document skeleton, for hosts that add their own.
  const fragment = `<title>CoderGames Solutions</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(english.description)}">
${FONTS}
<script>if (!document.documentElement.hasAttribute("data-theme")) document.documentElement.setAttribute("data-theme", "light");</script>
<style>
${STYLE}
</style>
${english.body}
`
  writeFileSync(process.argv[fragmentAt + 1]!, fragment)
  console.log(`fragment: ${process.argv[fragmentAt + 1]}`)
}
