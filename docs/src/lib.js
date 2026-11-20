// Small toolkit shared by every task visualisation: element helpers, a step player, segmented
// switches, sliders, stat tiles and theme-aware colours. Each tasks/<edition>/<task>/visual.js
// registers itself with CG.visual("<edition>-<n>", (root, data, CG) => { ... }) and is started
// the first time its task is shown.
window.CG = (() => {
  const registry = {};
  const SVG_NS = "http://www.w3.org/2000/svg";

  function build(el, attrs, kids) {
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "text") el.textContent = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) el.append(kid);
    return el;
  }
  const h = (tag, attrs, ...kids) => build(document.createElement(tag), attrs, kids);
  const s = (tag, attrs, ...kids) => build(document.createElementNS(SVG_NS, tag), attrs, kids);

  // ----- theme -----
  const themeListeners = new Set();
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const onTheme = (fn) => themeListeners.add(fn);
  const themeChanged = () => themeListeners.forEach((fn) => fn());
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", themeChanged);

  // ----- number formatting -----
  const fmt = (n, digits = 0) => Number(n).toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });

  // ----- controls -----
  const button = (label, attrs = {}) => h("button", { type: "button", class: "vis-btn", ...attrs, text: label });

  // A segmented switch: options [{ value, label }]; calls onChange(value).
  function segmented(options, onChange, initial, ariaLabel) {
    const group = h("div", { class: "seg", role: "group", "aria-label": ariaLabel });
    const buttons = options.map((o) => button(o.label, { "aria-pressed": String(o.value === initial) }));
    buttons.forEach((b, i) =>
      b.addEventListener("click", () => {
        buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        onChange(options[i].value);
      }),
    );
    group.append(...buttons);
    group.select = (value) => {
      const i = options.findIndex((o) => o.value === value);
      if (i >= 0) buttons[i].click();
    };
    return group;
  }

  // A labelled range slider; calls onInput(value) while dragging.
  function slider({ label, min, max, step = 1, value, onInput, format = (v) => v }) {
    const id = "s" + Math.random().toString(36).slice(2, 9);
    const out = h("output", { for: id, class: "vis-out" }, format(value));
    const input = h("input", { type: "range", id, min, max, step, value });
    input.addEventListener("input", () => {
      out.textContent = format(Number(input.value));
      onInput(Number(input.value));
    });
    const el = h("label", { class: "vis-slider", for: id }, h("span", { text: label }), input, out);
    el.set = (v) => {
      input.value = v;
      out.textContent = format(Number(input.value));
    };
    el.setMax = (m) => (input.max = m);
    return el;
  }

  // Stat tiles: stats([["Label", "value"], ...]) -> element with .set(i, value).
  function stats(items) {
    const values = items.map(([, v]) => h("b", { text: v }));
    const el = h("div", { class: "vis-stats" }, items.map(([label], i) => h("div", { class: "vis-stat" }, h("small", { text: label }), values[i])));
    el.set = (i, v) => (values[i].textContent = v);
    return el;
  }

  // Step player: first/prev/play/next/last, a scrubber and a status line.
  function player({ count, render, label, interval = 500 }) {
    let i = 0;
    let timer = null;
    const status = h("span", { class: "vis-status", "aria-live": "polite" });
    const range = h("input", { type: "range", min: 0, max: Math.max(0, count - 1), value: 0, "aria-label": "Step" });
    const playBtn = button("▶ Play", { class: "vis-btn primary" });
    const stop = () => {
      clearInterval(timer);
      timer = null;
      playBtn.textContent = "▶ Play";
    };
    const set = (n) => {
      i = Math.max(0, Math.min(count - 1, n));
      range.value = i;
      status.textContent = label ? label(i) : `Step ${i + 1} of ${count}`;
      render(i);
    };
    playBtn.addEventListener("click", () => {
      if (timer) return stop();
      if (i >= count - 1) set(0);
      playBtn.textContent = "⏸ Pause";
      timer = setInterval(() => (i < count - 1 ? set(i + 1) : stop()), interval);
    });
    range.addEventListener("input", () => {
      stop();
      set(Number(range.value));
    });
    const el = h(
      "div",
      { class: "vis-player" },
      button("⏮", { "aria-label": "Back to the start", onclick: () => (stop(), set(0)) }),
      button("◀", { "aria-label": "Previous step", onclick: () => (stop(), set(i - 1)) }),
      playBtn,
      button("▶", { "aria-label": "Next step", onclick: () => (stop(), set(i + 1)) }),
      button("⏭", { "aria-label": "Skip to the end", onclick: () => (stop(), set(count - 1)) }),
      range,
      status,
    );
    const api = {
      el,
      set,
      stop,
      get index() {
        return i;
      },
      reset(newCount) {
        stop();
        count = newCount;
        range.max = Math.max(0, count - 1);
        set(0);
      },
    };
    return api;
  }

  // Linear scale.
  const scale = (d0, d1, r0, r1) => (v) => (d1 === d0 ? r0 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0));

  // A distinct hue for the n-th thing (golden-angle steps).
  const hue = (n) => Math.round((n * 137.508) % 360);

  // Decode base64 into a typed array.
  function bytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  // Simple deterministic random numbers.
  function rng(seed) {
    let x = seed >>> 0 || 1;
    return () => ((x = (Math.imul(x, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  }

  function visual(id, init) {
    registry[id] = init;
  }

  function start(id, root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    const init = registry[id];
    if (!init) return;
    const node = document.getElementById("vd-" + id);
    const data = node ? JSON.parse(node.textContent) : null;
    root.textContent = "";
    try {
      init(root, data, CG);
    } catch (e) {
      root.append(h("p", { class: "vis-note", text: "This visualisation could not start: " + e.message }));
      console.error(e);
    }
  }

  return { visual, start, h, s, css, onTheme, themeChanged, fmt, button, segmented, slider, stats, player, scale, hue, bytes, rng };
})();
