// Views: the home page (#home) and one view per edition, which shows one task page at a time
// (#2026-1). Links are plain #names, so any task can be shared directly. Also: the theme toggle,
// the difficulty filter, the folding detail buttons and the visualisation snapshots.
(() => {
  const root = document.documentElement;
  const main = document.getElementById("main");
  const views = [...document.querySelectorAll(".view")];
  const editions = views.map((v) => v.dataset.edition).filter(Boolean);

  // ----- theme: opens light, the toggle switches for this visit only -----
  const toggle = document.getElementById("themeToggle");
  const current = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  const label = () => {
    const text = current() === "dark" ? "Switch to light mode" : "Switch to dark mode";
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

  // ----- hero art, painted on a canvas: lines of code under a radial zoom blur (deep blue to
  // violet), and on the right a dense rain of glowing turquoise digits. Seeded per page. -----
  const CODE = [
    "solve(input)", "=>", "const", "return", "for (let i = 0;", "i < n;", "i++)", "dp[i][j]", "Math.min(", "queue.push(v)", "visited.add(u)",
    "if (!seen.has(x))", "parent[x] = root", "BigInt(", "0x2800", ".split(\"\\n\")", "map((l) =>", "while (q.length)", "best = Math.max(", "{", "}", "};",
    "graph[a].push(b)", "dist[v] + 1", "cells[r * W + c]", "let lo = 0, hi = n", "mid >> 1", "ways[b] += ways[a]", "npm test", "37 passed", "key[c]",
    ".task-page", "> .hero", "li.current", "a:hover", "#e20074", "--accent", "import", "from", "'node:fs'", "readFileSync(", "console.log(", "?? 0", "!==",
  ];
  const DIGITS = "0123456789";
  function seeded(seed) {
    let x = (seed * 7919) % 2147483647 || 1;
    return () => ((x = (x * 16807) % 2147483647) / 2147483647);
  }
  function paint(el) {
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(box.width * dpr);
    const H = Math.round(box.height * dpr);
    if (el.dataset.size === `${W}x${H}`) return;
    el.dataset.size = `${W}x${H}`;
    const rnd = seeded(Number(el.dataset.seed) || 1);
    const canvas = el.querySelector("canvas") || el.appendChild(document.createElement("canvas"));
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // 1. deep blue to violet
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#050a1c");
    bg.addColorStop(0.45, "#101a63");
    bg.addColorStop(0.8, "#3a1d8f");
    bg.addColorStop(1, "#5a1a86");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 2. lines of code on a separate layer
    const layer = document.createElement("canvas");
    layer.width = W;
    layer.height = H;
    const o = layer.getContext("2d");
    const size = 13 * dpr;
    o.font = `500 ${size}px "JetBrains Mono", ui-monospace, Consolas, monospace`;
    o.textBaseline = "middle";
    const colours = ["rgba(225,236,255,0.9)", "rgba(140,180,255,0.9)", "rgba(120,140,255,0.85)", "rgba(185,130,255,0.9)", "rgba(255,90,175,0.9)", "rgba(90,225,235,0.9)"];
    for (let y = size; y < H + size; y += size * 1.45) {
      let x = -rnd() * 120 * dpr;
      // indentation, like real code
      x += Math.floor(rnd() * 4) * size * 1.2;
      while (x < W) {
        const token = CODE[Math.floor(rnd() * CODE.length)];
        const r = rnd();
        o.fillStyle = colours[r < 0.42 ? 0 : r < 0.62 ? 1 : r < 0.74 ? 2 : r < 0.86 ? 3 : r < 0.93 ? 4 : 5];
        o.fillText(token, x, y);
        x += o.measureText(token).width + size * (0.6 + rnd() * 1.2);
        if (rnd() < 0.08) break; // short lines now and then
      }
    }

    // 3. radial zoom blur: the code layer drawn again and again, a little bigger each time,
    //    around a focus point on the left, so everything streaks away from it.
    const fx = W * (0.22 + rnd() * 0.12);
    const fy = H * (0.3 + rnd() * 0.3);
    ctx.globalCompositeOperation = "lighter";
    const steps = 18;
    for (let i = steps; i >= 0; i--) {
      const k = 1 + i * 0.035;
      ctx.globalAlpha = i === 0 ? 0.55 : 0.1 * (1 - i / (steps + 2));
      ctx.setTransform(k, 0, 0, k, fx * (1 - k), fy * (1 - k));
      ctx.drawImage(layer, 0, 0);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;

    // 4. digital rain on the right: columns of glowing digits, bright heads, fading tails
    const cell = 15 * dpr;
    ctx.font = `600 ${cell}px "JetBrains Mono", ui-monospace, Consolas, monospace`;
    ctx.textAlign = "center";
    for (let x = W * 0.48; x < W + cell; x += cell * (0.95 + rnd() * 0.5)) {
      const depth = rnd(); // far columns are smaller and dimmer
      const scale = 0.6 + depth * 0.6;
      ctx.font = `600 ${Math.round(cell * scale)}px "JetBrains Mono", ui-monospace, Consolas, monospace`;
      const len = 6 + Math.floor(rnd() * 22);
      const end = rnd() * (H + cell * 6);
      for (let k = 0; k < len; k++) {
        const y = end - (len - k) * cell * scale * 1.05;
        if (y < -cell || y > H + cell) continue;
        const head = k === len - 1;
        const t = k / len;
        ctx.shadowColor = head ? "rgba(200,255,255,0.9)" : "rgba(72,224,234,0.7)";
        ctx.shadowBlur = (head ? 14 : 6) * dpr * scale;
        ctx.globalAlpha = head ? 1 : (0.06 + 0.7 * t * t) * (0.45 + depth * 0.55);
        ctx.fillStyle = head ? "#eaffff" : rnd() < 0.06 ? "#ff5aae" : "#48e0ea";
        ctx.fillText(DIGITS[Math.floor(rnd() * DIGITS.length)], x, y);
      }
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
  function drawArt(scope) {
    for (const el of scope.querySelectorAll(".hero-art")) paint(el);
  }
  // Repaint the visible banner when the window size changes, and once the code font has loaded.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => drawArt(document.querySelector(".view:not([hidden])")), 150);
  });
  document.fonts?.ready.then(() => {
    for (const el of document.querySelectorAll(".hero-art[data-size]")) delete el.dataset.size;
    drawArt(document.querySelector(".view:not([hidden])"));
  });

  // ----- views -----
  function show(id) {
    for (const v of views) v.hidden = v.id !== id;
    main.scrollTop = 0;
    window.scrollTo(0, 0);
    drawArt(document.getElementById(id));
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
    drawArt(article);
    const body = article.querySelector("[data-visual]");
    if (body && window.CG) window.CG.start(body.dataset.visual, body);
    if (!article.querySelector(".hero-snap").childElementCount) heroSnap(article);
    document.title = `${article.querySelector(".hero-title").textContent} · CoderGames Solutions`;
  }
  function route() {
    let hash = decodeURIComponent(location.hash.slice(1));
    if (editions.includes(hash)) hash = document.getElementById("v-" + hash).dataset.first;
    const m = hash.match(/^(.+)-(\d+)$/);
    if (m && editions.includes(m[1]) && document.getElementById("task-" + hash)) return openTask(m[1], hash);
    show("v-home");
    document.title = "CoderGames Solutions";
    fillSnaps(document.getElementById("v-home"));
  }

  // ----- clicks -----
  document.addEventListener("click", (e) => {
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
      document.getElementById("filterCount").textContent = `${shown} task${shown === 1 ? "" : "s"}`;
    }
  });

  window.addEventListener("hashchange", route);
  route();
})();
