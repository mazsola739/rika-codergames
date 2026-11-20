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

  // ----- views -----
  function show(id) {
    for (const v of views) v.hidden = v.id !== id;
    main.scrollTop = 0;
    window.scrollTo(0, 0);
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
