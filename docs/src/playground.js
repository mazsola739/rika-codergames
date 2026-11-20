// The playground: "Solve it yourself" hides the spoilers on a task page (answer, visualisation,
// write-up, code) and shows the task, its real input and an editor. The visitor's solve(input)
// runs in a Web Worker with a time limit, and its output is compared with the reference output.
// Code and the chosen mode are remembered per task in this browser.
(() => {
  const T = window.CG.t;
  const nf = (n) => n.toLocaleString(window.CG.lang === "hu" ? "hu-HU" : "en-US");
  const TIME_LIMIT_MS = 10_000;
  const store = {
    get: (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set: (k, v) => {
      try {
        if (v === null) localStorage.removeItem(k);
        else localStorage.setItem(k, v);
      } catch {}
    },
  };
  const files = new Map();
  const load = (url) => {
    if (!files.has(url))
      files.set(
        url,
        fetch(url).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.text();
        }),
      );
    return files.get(url);
  };
  const normalize = (t) =>
    t
      .replace(/^﻿/, "")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((l) => l.trimEnd())
      .join("\n")
      .trim();
  const head = (text, n) => {
    const lines = text.split("\n");
    return lines.slice(0, n).join("\n") + (lines.length > n ? `\n… ${T(`${nf(lines.length - n)} more lines`, `még ${nf(lines.length - n)} sor`)}` : "");
  };

  function setChallenge(article, on) {
    const pg = article.querySelector(".playground");
    const btn = article.querySelector("[data-challenge]");
    if (!pg || !btn) return;
    article.classList.toggle("challenge", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? T("Show the solution", "Mutasd a megoldást") : T("Solve it yourself", "Oldd meg te");
    pg.hidden = !on;
    store.set(`cg-challenge-${pg.dataset.slug}`, on ? "1" : null);
    if (on) prepare(pg);
  }

  function prepare(pg) {
    if (pg.dataset.ready) return;
    pg.dataset.ready = "1";
    const key = `cg-code-${pg.dataset.slug}`;
    const code = pg.querySelector(".pg-code");
    const saved = store.get(key);
    if (saved !== null) code.value = saved;
    code.addEventListener("input", () => store.set(key, code.value));
    // Tab indents; Escape first lets Tab move the focus on.
    let escaped = false;
    code.addEventListener("keydown", (e) => {
      if (e.key === "Escape") escaped = true;
      else if (e.key === "Tab" && !e.shiftKey && !escaped) {
        e.preventDefault();
        code.setRangeText("  ", code.selectionStart, code.selectionEnd, "end");
        store.set(key, code.value);
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run(pg);
      }
      if (e.key !== "Escape") escaped = e.key === "Tab" ? false : escaped;
    });
    const pre = pg.querySelector(".pg-input-text");
    if (pre)
      load(pre.dataset.src)
        .then((t) => (pre.textContent = head(t.replace(/\r\n?/g, "\n"), 18)))
        .catch((e) => (pre.textContent = T(`The input could not be loaded (${e.message}). Open the site from GitHub Pages or npm run preview.`, `A bemenetet nem sikerült betölteni (${e.message}). Nyisd meg az oldalt a GitHub Pagesről vagy az npm run preview-val.`)));
    pg.querySelector("[data-run]").addEventListener("click", () => run(pg));
    pg.querySelector("[data-reset]").addEventListener("click", () => {
      code.value = code.defaultValue;
      store.set(key, null);
      code.focus();
    });
  }

  // Runs the code in a fresh worker; resolves with { ok, out | error, ms }.
  function execute(code, input) {
    const source = `
      const __logs = [];
      const __solve = (function () {
        const __say = (...a) => __logs.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));
        const console = { log: __say, info: __say, warn: __say, error: __say };
        ${code}
        ;return typeof solve === "function" ? solve : null;
      })();
      self.onmessage = (e) => {
        const t0 = performance.now();
        try {
          if (!__solve) throw new Error(${JSON.stringify(T("Define a function called solve(input).", "Írj egy solve(input) nevű függvényt."))});
          let out = __solve(e.data);
          if (out === undefined) out = __logs.join("\\n");
          else if (Array.isArray(out)) out = out.join("\\n");
          postMessage({ ok: true, out: String(out), ms: performance.now() - t0 });
        } catch (err) {
          postMessage({ ok: false, error: String((err && err.message) || err), ms: performance.now() - t0 });
        }
      };`;
    const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    const worker = new Worker(url);
    return new Promise((resolve) => {
      const done = (result) => {
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(url);
        resolve(result);
      };
      const timer = setTimeout(() => done({ ok: false, error: T(`Stopped after ${TIME_LIMIT_MS / 1000} seconds. Is there an endless loop, or a slower algorithm than needed?`, `${TIME_LIMIT_MS / 1000} másodperc után leállítottam. Végtelen ciklus van benne, vagy a szükségesnél lassabb az algoritmus?`) }), TIME_LIMIT_MS);
      worker.onmessage = (e) => done(e.data);
      worker.onerror = (e) => {
        e.preventDefault();
        done({ ok: false, error: `${e.message}${e.lineno ? ` (${T("line", "sor")} ${Math.max(1, e.lineno - 5)})` : ""}` });
      };
      worker.postMessage(input);
    });
  }

  async function run(pg) {
    const status = pg.querySelector(".pg-status");
    const result = pg.querySelector(".pg-result");
    const runBtn = pg.querySelector("[data-run]");
    runBtn.disabled = true;
    status.textContent = T("Running…", "Fut…");
    let input = "";
    try {
      input = pg.dataset.input ? await load(pg.dataset.input) : "";
    } catch (e) {
      status.textContent = T(`The input could not be loaded (${e.message}).`, `A bemenetet nem sikerült betölteni (${e.message}).`);
      runBtn.disabled = false;
      return;
    }
    const res = await execute(pg.querySelector(".pg-code").value, input);
    runBtn.disabled = false;
    result.hidden = false;
    const { h } = window.CG;
    if (!res.ok) {
      status.textContent = "";
      result.replaceChildren(h("p", { class: "pg-bad", text: T("Your code stopped with an error", "A kódod hibával leállt") }), h("pre", { class: "code", text: res.error }));
      return;
    }
    const got = normalize(res.out);
    let want = "";
    try {
      want = normalize(await load(pg.dataset.expected));
    } catch {}
    status.textContent = T(`Finished in ${nf(Math.round(res.ms))} ms.`, `Lefutott ${nf(Math.round(res.ms))} ms alatt.`);
    const yours = h("pre", { class: "code pg-out", text: got ? head(got, 40) : T("(empty output)", "(üres kimenet)") });
    if (got === want) {
      result.replaceChildren(h("p", { class: "pg-ok", text: T("✓ Correct! It matches the expected answer.", "✓ Helyes! Egyezik a várt válasszal.") }), h("p", { class: "pg-label", text: T("Your output", "A kimeneted") }), yours);
      return;
    }
    const a = got.split("\n");
    const b = want.split("\n");
    let line = 0;
    while (line < Math.max(a.length, b.length) && a[line] === b[line]) line++;
    const reveal = h("pre", { class: "code pg-out", hidden: true, text: head(want, 40) });
    const multi = pg.dataset.multi === "1";
    result.replaceChildren(
      h("p", {
        class: "pg-bad",
        text: T(
          `✗ Not yet: line ${line + 1} differs from the expected answer${a.length !== b.length ? ` (you have ${a.length} line${a.length === 1 ? "" : "s"}, expected ${b.length})` : ""}.`,
          `✗ Még nem jó: a ${line + 1}. sor eltér a várt választól${a.length !== b.length ? ` (neked ${a.length} sorod van, ${b.length} kellene)` : ""}.`,
        ),
      }),
      multi
        ? h("p", {
            class: "vis-note",
            text: T(
              "This task accepts more than one correct answer (or its official answer has a known mistake), so a difference from our reference isn't always wrong. Check your answer against the rules.",
              "Ennél a feladatnál több helyes válasz is lehet (vagy a hivatalos válaszban ismert hiba van), így az eltérés a mi referenciánktól nem feltétlenül hiba. Vesd össze a válaszodat a szabályokkal.",
            ),
          })
        : "",
      h("p", { class: "pg-label", text: T("Your output", "A kimeneted") }),
      yours,
      window.CG.button(T("Show the expected answer (spoiler)", "Mutasd a várt választ (spoiler)"), { onclick: (e) => ((reveal.hidden = false), e.target.remove()) }),
      reveal,
    );
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-challenge]");
    if (!btn) return;
    const article = btn.closest(".task-page");
    setChallenge(article, !article.classList.contains("challenge"));
  });

  // When a task opens, bring back the mode the visitor left it in.
  function restore() {
    const article = document.querySelector(".task-page:not([hidden])");
    const pg = article?.querySelector(".playground");
    if (pg && store.get(`cg-challenge-${pg.dataset.slug}`) === "1" && !article.classList.contains("challenge")) setChallenge(article, true);
  }
  window.addEventListener("hashchange", restore);
  restore();
})();
