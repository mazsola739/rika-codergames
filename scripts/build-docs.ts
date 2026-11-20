// Builds docs/index.html, the GitHub Pages site: every edition and task with its write-up
// (README.md) and solution, rendered at build time so the page needs no JavaScript to read.
// Usage: npm run docs                  writes docs/index.html
//        npm run docs -- --fragment F  also writes the page body alone to F (for previews)
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import { marked } from 'marked'
import { ROOT, loadEditions, loadTasks, type Edition, type Task } from './tasks.ts'

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

// ---------- page parts ----------
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

function taskButton(t: Task, selected: boolean): string {
  const pending = t.status === 'pending'
  const meta = pending ? 'Not published yet' : [t.country, ...t.topics.slice(0, 2)].filter(Boolean).join(' · ')
  return `<li><button class="task-btn${pending ? ' pending' : ''}" type="button" data-task="${slug(t)}" aria-controls="task-${slug(t)}" aria-current="${selected}">
          <span class="num">${t.number}</span><span class="t"><b>${esc(t.title)}</b><small>${esc(meta)}</small></span></button></li>`
}

function extraFiles(t: Task): string[] {
  return readdirSync(t.dir)
    .filter((f) => /\.(ts|txt|json)$/.test(f) && !f.startsWith('visual') && f !== 'solution.ts' && f !== 'task.json' && !f.startsWith('input') && f !== 'answer.txt' && f !== 'example.txt')
    .concat(readdirSync(t.dir).filter((f) => f === 'input-original.txt'))
    .filter((f, i, a) => a.indexOf(f) === i)
    .sort()
}

function taskArticle(t: Task, selected: boolean): string {
  const s = slug(t)
  const pending = t.status === 'pending'
  const eyebrow = [`Task ${t.number}`, t.country ?? ''].filter(Boolean).join(' · ')
  const sections = readmeSections(t)

  // Details stay folded away: one button per README section, plus the code.
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
  const chips = t.topics.map((x) => `<li>${esc(x)}</li>`).join('')

  return `<article class="task" id="task-${s}" aria-labelledby="h-${s}"${selected ? '' : ' hidden'}>
        <header class="task-head">
          <p class="eyebrow">${esc(eyebrow)}</p>
          <h2 id="h-${s}">${esc(t.title)}</h2>
          ${t.summary ? `<p class="task-summary">${esc(t.summary)}</p>` : ''}
          ${t.result ? `<p class="task-result"><span>Answer</span>${esc(t.result)}</p>` : ''}
        </header>
        ${visualSection(t)}
        ${details}
        <footer class="task-foot">
          ${chips ? `<ul class="chips" aria-label="Topics">${chips}</ul>` : ''}
          <p class="task-links">${links}</p>
        </footer>
      </article>`
}

function editionPanel(e: Edition, tasks: Task[]): string {
  const first = tasks.find((t) => t.status !== 'pending') ?? tasks[0]!
  const solved = tasks.filter((t) => t.status !== 'pending').length
  const count = solved === tasks.length ? plural(tasks.length, 'task') : `${solved} of ${tasks.length} tasks`
  return `<section class="panel-edition" id="p-${e.id}" role="tabpanel" aria-labelledby="tab-${e.id}" tabindex="0" hidden>
    <header class="edition-head">
      <h2>${esc(e.title)} <span>${esc(e.theme)}</span></h2>
      <p class="eyebrow">${esc(e.dates)} · ${esc(e.language)} · ${count} · <a href="${e.source}" target="_blank" rel="noopener">original tasks ↗</a></p>
    </header>
    <div class="split">
      <nav class="task-nav" aria-label="Tasks of ${esc(e.title)}"><ol>
        ${tasks.map((t) => taskButton(t, t === first)).join('\n        ')}
      </ol></nav>
      <div class="articles">
      ${tasks.map((t) => taskArticle(t, t === first)).join('\n      ')}
      </div>
    </div>
  </section>`
}

// The tasks shown first on the overview.
const HIGHLIGHTS = ['2026-2', '2022-5', '2026-1', '2024-5', '2020-3', '2023-5']

function overviewPanel(editions: Edition[], byEdition: Map<string, Task[]>): string {
  const all = [...byEdition.values()].flat()
  const solved = all.filter((t) => t.status !== 'pending')
  const pending = all.length - solved.length
  const custom = solved.filter((t) => t.check === 'custom').length
  const label = (t: Task) => `${TAB_LABEL[t.edition.id] ?? t.edition.id} · Task ${t.number}`
  const highlights = HIGHLIGHTS.map((id) => all.find((t) => slug(t) === id))
    .filter((t): t is Task => !!t)
    .map((t) => {
      const v = visuals.get(slug(t))
      return `<li><a class="highlight" href="#${slug(t)}">
          <small>${esc(label(t))}</small>
          <b>${esc(v?.title ?? t.title)}</b>
          <span>${esc(t.title)}: ${esc(t.summary ?? '')}</span>
        </a></li>`
    })
    .join('\n      ')
  const cards = editions
    .map((e) => {
      const tasks = byEdition.get(e.id)!
      const done = tasks.filter((t) => t.status !== 'pending').length
      return `<li><a class="edition-card" href="#${e.id}" data-edition="${e.id}">
          <small>${esc(e.dates)} · ${esc(e.language)}</small>
          <b>${esc(e.title)}</b>
          <span class="theme">${esc(e.theme)}</span>
          <span class="count">${done === tasks.length ? plural(done, 'task') : `${done} of ${tasks.length} tasks so far`}</span>
        </a></li>`
    })
    .join('\n      ')
  const findings = FINDINGS.map(([id, text]) => {
    const t = all.find((x) => slug(x) === id)!
    return `<li><a href="#${id}"><b>${esc(TAB_LABEL[t.edition.id] ?? t.edition.id)} · ${esc(t.title)}</b></a> ${esc(text)}</li>`
  }).join('\n        ')
  return `<section class="panel-doc" id="p-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0">
    <h2>Start here</h2>
    <ul class="highlights">
      ${highlights}
    </ul>
    <h2>All editions</h2>
    <ul class="edition-grid">
      ${cards}
    </ul>
    <p class="stat-strip">
      <span><b>${solved.length}</b> tasks solved${pending ? ` (${pending} still to come)` : ''}</span>
      <span><b>${visuals.size}</b> interactive visualisations</span>
      <span><b>${editions.length}</b> editions, ${editions.at(-1)!.dates}–${editions[0]!.dates.slice(-4)}</span>
      <span><b>${FINDINGS.length}</b> mistakes found in the official material</span>
    </p>
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
        <p>The visualisations are plain JavaScript with SVG or canvas, no framework. Each task folder has a <code>visual.js</code> that runs in the browser and a <code>visual.ts</code> that prepares its data from the real input at build time.</p>
      </div>
    </details>
  </section>`
}

// ---------- the page ----------
const editions = ORDER.map((id) => loadEditions().find((e) => e.id === id)).filter((e): e is Edition => !!e)
const byEdition = new Map(editions.map((e) => [e.id, loadTasks(e)]))
for (const t of [...byEdition.values()].flat()) await loadVisual(t)
const total = [...byEdition.values()].flat().filter((t) => t.status !== 'pending').length
const DESCRIPTION = `All ${total} published CoderGames tasks (2020–2026) by Deutsche Telekom IT Solutions Slovakia, solved in TypeScript and explained.`

const tabs = [
  `<button class="tab" role="tab" id="tab-overview" aria-controls="p-overview" aria-selected="true">Overview</button>`,
  ...editions.map(
    (e) => `<button class="tab" role="tab" id="tab-${e.id}" aria-controls="p-${e.id}" aria-selected="false" tabindex="-1">${esc(TAB_LABEL[e.id] ?? e.id)}</button>`,
  ),
].join('\n    ')

const STYLE = readFileSync(join(ROOT, 'docs', 'src', 'style.css'), 'utf8')
const SCRIPT = [
  readFileSync(join(ROOT, 'docs', 'src', 'lib.js'), 'utf8'),
  ...[...visuals.entries()].map(([id, v]) => `// ----- visualisation ${id} -----\n${v.script}`),
  readFileSync(join(ROOT, 'docs', 'src', 'page.js'), 'utf8'),
].join('\n')
const GITHUB_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`
const THEME_ICONS = `<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8z"/></svg>
        <svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5a1 1 0 0 1 1 1v1.8a1 1 0 0 1-2 0V2.5a1 1 0 0 1 1-1zm0 17.2a1 1 0 0 1 1 1v1.8a1 1 0 0 1-2 0v-1.8a1 1 0 0 1 1-1zM22.5 12a1 1 0 0 1-1 1h-1.8a1 1 0 0 1 0-2h1.8a1 1 0 0 1 1 1zM5.3 12a1 1 0 0 1-1 1H2.5a1 1 0 0 1 0-2h1.8a1 1 0 0 1 1 1zm13.1-6.4a1 1 0 0 1 0 1.4l-1.3 1.3a1 1 0 1 1-1.4-1.4l1.3-1.3a1 1 0 0 1 1.4 0zM8.3 15.7a1 1 0 0 1 0 1.4L7 18.4A1 1 0 0 1 5.6 17l1.3-1.3a1 1 0 0 1 1.4 0zm10.1 2.7a1 1 0 0 1-1.4 0l-1.3-1.3a1 1 0 0 1 1.4-1.4l1.3 1.3a1 1 0 0 1 0 1.4zM8.3 8.3a1 1 0 0 1-1.4 0L5.6 7A1 1 0 0 1 7 5.6l1.3 1.3a1 1 0 0 1 0 1.4z"/></svg>`

const body = `<div class="app">
  <header class="top">
    <div class="titleblock">
      <p class="eyebrow">Coding competition · TypeScript · 2020–2026</p>
      <h1>CoderGames Solutions</h1>
      <p class="lead">Every task of <a href="https://codergames.deutschetelekomitsolutions.sk/" target="_blank" rel="noopener">CoderGames</a>, the coding competition by <strong class="brand">Deutsche Telekom IT Solutions Slovakia</strong>: solved, visualised and explained.</p>
    </div>
    <p class="actions">
      <a class="pill" href="${REPO}" target="_blank" rel="noopener">${GITHUB_ICON}Source code</a>
      <button class="pill icon theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark mode" title="Switch to dark mode">
        ${THEME_ICONS}
      </button>
    </p>
  </header>

  <nav class="tabs" role="tablist" aria-label="Editions">
    ${tabs}
  </nav>

  <main class="panels" id="panels">
  ${overviewPanel(editions, byEdition)}
  ${editions.map((e) => editionPanel(e, byEdition.get(e.id)!)).join('\n  ')}
  </main>

  <footer>
    <p class="copy"><b>© 2026 <a href="https://github.com/mazsola739" target="_blank" rel="noopener">mazsola739</a></b> · Task statements summarised in my own words; follow "Original task" for the full text</p>
    <p>Not an official Telekom page.</p>
  </footer>
</div>
<script>
${SCRIPT}
</script>`

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap">`
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
