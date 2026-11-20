// Tabs (Overview + one per edition), the task list inside each edition, the theme toggle, and
// links of the form #2026, #2026-1 or #overview, so any task can be shared directly.
(() => {
  const root = document.documentElement;
  const panels = document.getElementById("panels");
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const editionOf = (tab) => tab.id.slice(4); // "tab-2026" -> "2026"

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
  });
  label();

  // ----- showing things -----
  function showTab(id, focus) {
    for (const tab of tabs) {
      const on = editionOf(tab) === id;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !on;
      if (on && focus) tab.focus();
      if (on) tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function showTask(slug) {
    const article = document.getElementById("task-" + slug);
    if (!article) return false;
    const list = article.closest(".panel-edition");
    for (const a of list.querySelectorAll("article.task")) a.hidden = a !== article;
    for (const b of list.querySelectorAll(".task-btn")) b.setAttribute("aria-current", String(b.dataset.task === slug));
    startVisual(article);
    return true;
  }

  // Visualisations start the first time their task is shown (also when its edition tab opens).
  function startVisual(article) {
    const body = article && article.querySelector("[data-visual]");
    if (body && window.CG) window.CG.start(body.dataset.visual, body);
  }

  function route() {
    const hash = decodeURIComponent(location.hash.slice(1));
    const editions = tabs.map(editionOf);
    if (editions.includes(hash)) {
      showTab(hash);
      startVisual(document.querySelector("#p-" + CSS.escape(hash) + " article.task:not([hidden])"));
      return;
    }
    const m = hash.match(/^(.+)-(\d+)$/);
    if (m && editions.includes(m[1]) && showTask(hash)) {
      showTab(m[1]);
      return;
    }
    showTab("overview");
  }

  function go(hash) {
    if (location.hash.slice(1) === hash) route();
    else location.hash = hash;
  }

  // ----- events -----
  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      go(editionOf(tab));
      panels.scrollTop = 0;
    });
    tab.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(tab);
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      go(editionOf(target));
      target.focus();
    });
  }

  document.addEventListener("click", (e) => {
    const button = e.target.closest(".task-btn");
    if (!button) return;
    go(button.dataset.task);
    // Bring the start of the write-up into view if it is above the visible area (or, on phones,
    // where the list sits above the write-up, below it).
    const article = document.getElementById("task-" + button.dataset.task);
    const stacked = getComputedStyle(button.closest(".split")).gridTemplateColumns.split(" ").length === 1;
    const smooth = matchMedia("(prefers-reduced-motion: no-preference)").matches ? "smooth" : "auto";
    if (stacked) article.scrollIntoView({ block: "start", behavior: smooth });
    else {
      const above = article.getBoundingClientRect().top - panels.getBoundingClientRect().top;
      if (above < 0) panels.scrollTop += above - 8;
    }
  });

  window.addEventListener("hashchange", route);
  route();
})();
