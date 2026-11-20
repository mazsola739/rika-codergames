CG.visual("2024-3", (root, cases, { h, s, player, segmented }) => {
  const mod = (a, m) => ((a % m) + m) % m;
  const stage = h("div", { class: "vis-frame" });
  let p;
  function load(k) {
    const { m, initial, target } = cases[k];
    const n = initial.length;
    const rows = Math.round((Math.sqrt(8 * n + 1) - 1) / 2);
    const start = (r) => (r * (r + 1)) / 2;
    // The manual turns, top-down (same as solution.ts), shortest direction.
    const turns = [];
    let above = [];
    for (let r = 0; r < rows; r++) {
      const totals = [];
      for (let j = 0; j <= r; j++) {
        const from = (above[j - 1] ?? 0) + (above[j] ?? 0);
        let t = mod(target[start(r) + j] - initial[start(r) + j] - from, m);
        if (t > m / 2) t -= m;
        turns.push(t);
        totals.push(t + from);
      }
      above = totals;
    }
    // faces after the first k manual turns, applying the cascade literally
    const facesAfter = (k) => {
      const f = [...initial];
      const spin = (r, j, x) => {
        if (r >= rows) return;
        f[start(r) + j] = mod(f[start(r) + j] + x, m);
        spin(r + 1, j, x);
        spin(r + 1, j + 1, x);
      };
      for (let i = 0; i < k; i++) {
        if (!turns[i]) continue;
        const r = Math.floor((Math.sqrt(8 * i + 1) - 1) / 2);
        spin(r, i - start(r), turns[i]);
      }
      return f;
    };
    const size = Math.min(58, 620 / rows);
    const W = rows * size + 20;
    const H = rows * size * 0.92 + 30;
    function render(step) {
      const f = facesAfter(step);
      const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Pyramid of pillars", style: { maxWidth: `${Math.min(640, W * 1.6)}px`, margin: "0 auto" } });
      for (let r = 0; r < rows; r++)
        for (let j = 0; j <= r; j++) {
          const i = start(r) + j;
          const cx = W / 2 + (j - r / 2) * size;
          const cy = 18 + r * size * 0.92;
          const done = i < step;
          const ok = f[i] === mod(target[i], m);
          const active = i === step - 1;
          svg.append(s("circle", { cx, cy: cy + size * 0.35, r: size * 0.4, class: "f-island", style: `--h:${(f[i] * 360) / m}`, stroke: active ? "var(--accent)" : "var(--line)", "stroke-width": active ? 3 : 1 }));
          svg.append(s("text", { x: cx, y: cy + size * 0.42, "text-anchor": "middle", "font-size": size * 0.32, "font-weight": 700, class: "f-fg", text: String(f[i]) }));
          if (size >= 28) svg.append(s("text", { x: cx, y: cy + size * 0.68, "text-anchor": "middle", "font-size": size * 0.18, class: "t-label", text: done && ok ? "✓" : `→${mod(target[i], m)}` }));
        }
      stage.replaceChildren(svg);
    }
    if (!p) {
      p = player({ count: n + 1, render, interval: 500, label: (i) => (i === 0 ? "Start position." : `Turn ${i} of ${n}: pillar ${i} by ${turns[i - 1] > 0 ? "+" : ""}${turns[i - 1]}${turns[i - 1] === 0 ? " (no turn needed)" : ""}.`) });
      root.append(p.el);
    }
    p.reset(n + 1);
    p.set(n);
  }
  // A new case gets a new player (its steps and drawing depend on the pyramid).
  let current = 0;
  root.append(h("div", { class: "vis-row" }, segmented(cases.map((c, i) => ({ value: i, label: `${c.name} · ${c.m} faces` })), (k) => rebuild(k), 0, "Pyramid")), stage);
  function rebuild(k) {
    current = k;
    if (p) {
      p.el.remove();
      p = null;
    }
    load(k);
  }
  rebuild(current);
});
