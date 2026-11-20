// Views: the home page (#home) and one view per edition, which shows one task page at a time
// (#2026-1). Links are plain #names, so any task can be shared directly. Also: the theme toggle,
// the difficulty filter, the folding detail buttons and the visualisation snapshots.
(() => {
  const root = document.documentElement;
  const main = document.getElementById("main");
  const views = [...document.querySelectorAll(".view")];
  const editions = views.map((v) => v.dataset.edition).filter(Boolean);
  const T = window.CG.t;
  const SITE = T("CoderGames Solutions", "CoderGames megoldások");

  // ----- theme: opens light, the toggle switches for this visit only -----
  const toggle = document.getElementById("themeToggle");
  const current = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  const label = () => {
    const text = current() === "dark" ? T("Switch to light mode", "Világos mód") : T("Switch to dark mode", "Sötét mód");
    toggle.setAttribute("aria-label", text);
    toggle.title = text;
  };
  toggle.addEventListener("click", () => {
    root.setAttribute("data-theme", current() === "dark" ? "light" : "dark");
    label();
    window.CG?.themeChanged();
    // Canvas snapshots were drawn in the old colours: make them again once the visuals redrew.
    setTimeout(refreshRasterSnapshots, 0);
  });
  label();

  // ----- snapshots -----
  // Work in short slices between frames so the page stays responsive (all of them take ~0.3 s).
  const queue = [];
  let working = false;
  const idle = (fn) => setTimeout(fn, 16);
  function fillSnaps(scope) {
    for (const el of scope.querySelectorAll(".snap[data-snap]")) {
      if (el.dataset.filled) continue;
      el.dataset.filled = "1";
      el.classList.add("loading");
      queue.push(el);
    }
    pump();
  }
  function pump() {
    if (working || !queue.length) return;
    working = true;
    idle(() => {
      const until = performance.now() + 12;
      while (queue.length && performance.now() < until) {
        const el = queue.shift();
        const node = window.CG?.snapshot(el.dataset.snap);
        el.classList.remove("loading");
        el.replaceChildren();
        if (node) el.append(node);
        else el.classList.add("snap-none");
      }
      working = false;
      pump();
    });
  }
  function heroSnap(article) {
    const fig = article.querySelector(".hero-snap");
    const body = article.querySelector("[data-visual]");
    if (!fig) return;
    const node = body && window.CG ? window.CG.copyGraphic(window.CG.mainGraphic(body)) : null;
    fig.replaceChildren();
    fig.classList.toggle("empty", !node);
    if (node) fig.append(node);
  }
  function refreshRasterSnapshots() {
    window.CG?.forgetRasterSnapshots();
    for (const el of document.querySelectorAll(".snap[data-snap]")) {
      if (el.querySelector("img[data-raster]")) delete el.dataset.filled;
    }
    fillSnaps(document);
    const open = document.querySelector(".task-page:not([hidden])");
    if (open && open.querySelector(".hero-snap img[data-raster]")) heroSnap(open);
  }

  // ----- hero art: lines of modern JavaScript (ES2015 to ES2026) on the banner. The CSS paints
  // the background and the shade behind the text; the canvas only holds the code. It is drawn
  // once the fonts have loaded and then fades in, so the picture never swaps while the page
  // loads. Every banner hides one pink line about Rika, where the text and snapshot leave room. -----
  const CODE = [
    // ES2015
    "const", "let", "=>", "return", "class Task {", "constructor(input) {", "super()", "`${a} ${b}`",
    "const [a, b] = line.split(' ')", "const { x, y } = p", "(...args)", "[...xs]", "new Map()", "new Set()",
    "for (const x of xs)", "function* walk(node)", "yield* children", "Symbol.iterator", "Promise.resolve()",
    "import { readFileSync } from 'node:fs'", "export default solve", "Array.from({ length: n })", "Number.isInteger(n)",
    // ES2016 to ES2019
    "2 ** k", "xs.includes(x)", "async function main()", "await fetch(url)", "Object.entries(o)", "s.padStart(2, '0')",
    "{ ...rest }", "for await (const line of rl)", ".finally(done)", "/(?<row>[0-9]+),(?<col>[0-9]+)/", "grid.flat()",
    ".flatMap((r) => r)", "Object.fromEntries(pairs)", "s.trimEnd()", "} catch {",
    // ES2020 to ES2022
    "a?.b?.c", "x ?? 0", "BigInt(total)", "10n ** 18n", "s.matchAll(re)", "Promise.allSettled(jobs)", "globalThis",
    "best ??= Infinity", "seen ||= new Set()", "s.replaceAll(',', '')", "1_000_000", "Promise.any(tries)",
    "new WeakRef(node)", "xs.at(-1)", "#memo = new Map()", "static {", "Object.hasOwn(o, k)", "await Promise.all(tasks)",
    "new Error(msg, { cause })",
    // ES2023 to ES2026
    "xs.toSorted((a, b) => a - b)", "xs.findLast(isPrime)", "xs.toReversed()", "grid.with(i, row)", "#!/usr/bin/env node",
    "Object.groupBy(rows, (r) => r.year)", "Map.groupBy(tasks, level)", "Promise.withResolvers()", "s.isWellFormed()",
    "a.union(b)", "a.intersection(b)", "a.difference(b)", "Iterator.from(gen)", ".drop(1).take(5)", "RegExp.escape(word)",
    "Promise.try(run)", "import data from './input.json' with { type: 'json' }", "Math.f16round(x)",
    "Uint8Array.fromBase64(s)", "bytes.toHex()", "Math.sumPrecise(xs)", "Error.isError(e)", "await Array.fromAsync(lines)",
    // and a few from the tasks
    "dp[i][j]", "queue.push(v)", "dist[v] + 1", "cells[r * W + c]", "mid >> 1", "ways[b] += ways[a]", "npm test", "{", "}", "};",
  ];
  const RIKA = [
    "const rika = await solve(input)", "class Rika extends Coder {}", "rika ??= new Solver()", "export default rika",
    "import { rika } from './rika.ts'", "for (const task of rika.tasks)", "rika.solved.at(-1)", "// solved by Rika",
  ];
  const COLOURS = [["rgba(225,236,255,0.9)", 0.45], ["rgba(140,180,255,0.9)", 0.22], ["rgba(120,140,255,0.85)", 0.13], ["rgba(185,130,255,0.9)", 0.12], ["rgba(90,225,235,0.9)", 0.08]];
  const colour = (r) => {
    for (const [c, share] of COLOURS) {
      if (r < share) return c;
      r -= share;
    }
    return COLOURS[0][0];
  };
  function seeded(seed) {
    let x = (seed * 7919) % 2147483647 || 1;
    return () => ((x = (x * 16807) % 2147483647) / 2147483647);
  }
  // A spot for the Rika line: on a code line, clear of the banner's text and snapshot, on the
  // right half when possible (the shade darkens the left).
  function eggSpot(el, box, dpr, lines, width, rnd) {
    const gap = 4 * dpr; // space kept around the text and the snapshot
    const half = 7 * dpr; // half the height of a line of code
    const edge = 24 * dpr; // clear of the rounded corners
    const W = box.width * dpr;
    const H = box.height * dpr;
    const blocked = [...el.parentElement.children]
      .filter((c) => c !== el)
      .map((c) => {
        const r = c.getBoundingClientRect();
        return [(r.left - box.left) * dpr - gap, (r.top - box.top) * dpr - gap, (r.right - box.left) * dpr + gap, (r.bottom - box.top) * dpr + gap];
      });
    const free = [];
    lines.forEach((y, i) => {
      if (y - half < 2 * dpr || y + half > H - 2 * dpr) return;
      for (let x = edge; x + width < W - edge; x += 8 * dpr) {
        if (!blocked.some(([l, t, r, b]) => x < r && x + width > l && y - half < b && y + half > t)) free.push({ i, x, y });
      }
    });
    const right = free.filter((spot) => spot.x > W * 0.5);
    const pool = right.length ? right : free;
    return pool.length ? pool[Math.floor(rnd() * pool.length)] : null;
  }
  let fontsLoaded = false;
  function paint(el) {
    if (!fontsLoaded || !el.dataset.ready) return;
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(box.width * dpr);
    const H = Math.round(box.height * dpr);
    if (el.dataset.size === `${W}x${H}`) return;
    el.dataset.size = `${W}x${H}`;
    const rnd = seeded(Number(el.dataset.seed) || 1);
    let canvas = el.querySelector("canvas");
    if (!canvas) {
      canvas = el.appendChild(document.createElement("canvas"));
      void canvas.offsetWidth; // start from opacity 0 so it fades in
      canvas.classList.add("shown");
    }
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const size = 13 * dpr;
    ctx.font = `500 ${size}px "JetBrains Mono", ui-monospace, Consolas, monospace`;
    ctx.textBaseline = "middle";
    const lines = [];
    for (let y = size; y < H + size; y += size * 1.45) lines.push(y);
    const egg = RIKA[Math.floor(rnd() * RIKA.length)];
    const eggWidth = ctx.measureText(egg).width;
    const spot = eggSpot(el, box, dpr, lines, eggWidth, rnd);
    ctx.globalAlpha = 0.62;
    lines.forEach((y, i) => {
      let x = -rnd() * 120 * dpr + Math.floor(rnd() * 4) * size * 1.2; // ragged starts, like indentation
      while (x < W) {
        const token = CODE[Math.floor(rnd() * CODE.length)];
        const w = ctx.measureText(token).width;
        const fill = colour(rnd());
        const onEgg = spot && spot.i === i && x < spot.x + eggWidth + size && x + w > spot.x - size;
        if (!onEgg) {
          ctx.fillStyle = fill;
          ctx.fillText(token, x, y);
        }
        x += w + size * (0.6 + rnd() * 1.2);
        if (rnd() < 0.08) break; // short lines now and then
      }
    });
    if (spot) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ff5aae";
      ctx.fillText(egg, spot.x, spot.y);
    }
    ctx.globalAlpha = 1;
  }
  function drawArt(scope) {
    if (scope) for (const el of scope.querySelectorAll(".hero-art")) paint(el);
  }
  // Repaint the visible banner when the window size changes.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => drawArt(document.querySelector(".view:not([hidden])")), 150);
  });
  // ...and when a banner changes size for another reason (a late image, a different snapshot).
  if ("ResizeObserver" in window) {
    const watch = new ResizeObserver((entries) => entries.forEach((e) => paint(e.target)));
    for (const el of document.querySelectorAll(".hero-art")) watch.observe(el);
  }
  // Paint only with the real fonts (at most 2.5 s wait): a first picture in a fallback font would
  // be replaced by a different one, since the token widths, and so the layout, change.
  const fonts = document.fonts
    ? Promise.all(['500 13px "JetBrains Mono"', '700 20px "Space Grotesk"', "500 16px Inter"].map((f) => document.fonts.load(f)))
    : null;
  Promise.race([fonts, new Promise((ok) => setTimeout(ok, 2500))])
    .catch(() => {})
    .then(() => {
      fontsLoaded = true;
      drawArt(document.querySelector(".view:not([hidden])"));
    });

  // ----- Best-of column: it stops only once it is fully in view. If it is taller than the scroll
  // area, it scrolls with the page until its last item shows, then stays there. On desktop the
  // page scrolls inside #main (under the top bar), on small screens the window scrolls. -----
  const best = document.querySelector(".bestof");
  function placeBest() {
    if (!best || !best.offsetHeight) return;
    const area = getComputedStyle(main).overflowY === "auto" ? main.clientHeight : window.innerHeight;
    best.style.setProperty("--bestof-top", `${Math.min(14, area - best.offsetHeight - 14)}px`);
  }
  window.addEventListener("resize", placeBest);
  if (best && "ResizeObserver" in window) new ResizeObserver(placeBest).observe(best);

  // ----- views -----
  function show(id) {
    for (const v of views) v.hidden = v.id !== id;
    main.scrollTop = 0;
    window.scrollTo(0, 0);
    // Task banners are painted by openTask, once their snapshot is in place.
    const view = document.getElementById(id);
    if (!view.dataset.edition) {
      for (const el of view.querySelectorAll(".hero-art")) el.dataset.ready = "1";
      drawArt(view);
    }
  }
  function openTask(edition, slug) {
    show("v-" + edition);
    const view = document.getElementById("v-" + edition);
    for (const a of view.querySelectorAll(".task-page")) a.hidden = a.id !== "task-" + slug;
    for (const tab of view.querySelectorAll(".task-tab")) {
      const on = tab.dataset.task === slug;
      if (on) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
      if (on) tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    const article = document.getElementById("task-" + slug);
    const body = article.querySelector("[data-visual]");
    if (body && window.CG) window.CG.start(body.dataset.visual, body);
    if (!article.querySelector(".hero-snap").childElementCount) heroSnap(article);
    // Paint the banner once the snapshot has its final size, so the Rika line finds a free spot.
    const pictures = [...article.querySelectorAll(".hero-snap img")]
      .filter((img) => !img.complete)
      .map((img) => new Promise((ok) => {
        img.addEventListener("load", ok, { once: true });
        img.addEventListener("error", ok, { once: true });
        setTimeout(ok, 1000);
      }));
    Promise.all(pictures).then(() => {
      article.querySelector(".hero-art").dataset.ready = "1";
      drawArt(article);
    });
    document.title = `${article.querySelector(".hero-title").textContent} · ${SITE}`;
  }
  function route() {
    let hash = decodeURIComponent(location.hash.slice(1));
    if (editions.includes(hash)) hash = document.getElementById("v-" + hash).dataset.first;
    const m = hash.match(/^(.+)-(\d+)$/);
    if (m && editions.includes(m[1]) && document.getElementById("task-" + hash)) return openTask(m[1], hash);
    if (hash === "about") {
      show("v-about");
      document.title = `${T("About", "Az oldalról")} · ${SITE}`;
      return;
    }
    show("v-home");
    document.title = SITE;
    placeBest();
    fillSnaps(document.getElementById("v-home"));
  }

  // ----- clicks -----
  document.addEventListener("click", (e) => {
    // The language switch opens the same view in the other language.
    const other = e.target.closest("[data-lang-switch]");
    if (other) other.href = other.getAttribute("href").split("#")[0] + location.hash;
    // Detail buttons: each opens its own panel and closes the others; click again to fold.
    const btn = e.target.closest(".detail-btn");
    if (btn) {
      const open = btn.getAttribute("aria-expanded") === "true";
      for (const b of btn.closest(".detail-bar").querySelectorAll(".detail-btn")) {
        const on = b === btn && !open;
        b.setAttribute("aria-expanded", String(on));
        document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
      }
      return;
    }
    // Difficulty filter on the home page.
    const f = e.target.closest(".filter button");
    if (f) {
      for (const b of f.parentElement.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b === f));
      const [lo, hi] = f.dataset.range.split("-").map(Number);
      let shown = 0;
      for (const row of document.querySelectorAll(".task-row")) {
        const d = Number(row.dataset.difficulty);
        const ok = d >= lo && d <= hi;
        row.hidden = !ok;
        shown += ok;
      }
      document.getElementById("filterCount").textContent = T(`${shown} task${shown === 1 ? "" : "s"}`, `${shown} feladat`);
    }
  });

  window.addEventListener("hashchange", route);
  route();
})();
