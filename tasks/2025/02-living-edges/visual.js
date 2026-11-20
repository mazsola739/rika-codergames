CG.visual("2025-2", (root, { n, events }, { h, s, player, stats, hue }) => {
  const COLS = 10;
  const pos = (v) => [30 + ((v - 1) % COLS) * 62, 30 + Math.floor((v - 1) / COLS) * 62];
  const used = new Set(events.filter((e) => e !== "?").flat());
  const stage = h("div", { class: "vis-frame" });
  const tiles = stats([[CG.t("Event", "Esemény"), ""], [CG.t("Cursed components", "Átkozott komponensek"), "0"], [CG.t("Answers so far", "Eddigi válaszok"), ""]]);
  // Replay with a union-find up to step k.
  function state(k) {
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const cyc = new Uint8Array(n + 1);
    const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    let cursed = 0;
    const answers = [];
    const edges = [];
    for (let i = 0; i < k; i++) {
      const e = events[i];
      if (e === "?") {
        answers.push(cursed);
        continue;
      }
      const [u, v] = e;
      edges.push([u, v, i === k - 1]);
      const a = find(u);
      const b = find(v);
      if (a === b) {
        if (!cyc[a]) ((cyc[a] = 1), cursed++);
      } else {
        if (cyc[a] && cyc[b]) cursed--;
        parent[b] = a;
        cyc[a] = cyc[a] || cyc[b] ? 1 : 0;
      }
    }
    return { find, cyc, cursed, answers, edges };
  }
  function render(k) {
    const st = state(k);
    const rows = Math.ceil(n / COLS);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${COLS * 62} ${rows * 62}`, role: "img", "aria-label": CG.t("Houses and corridors", "Házak és folyosók") });
    for (const [u, v, fresh] of st.edges) {
      const [x1, y1] = pos(u);
      const [x2, y2] = pos(v);
      const bend = Math.abs(y1 - y2) < 1 && Math.abs(x1 - x2) > 62 ? -26 : 0;
      svg.append(s("path", { d: `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + bend} ${x2},${y2}`, fill: "none", class: fresh ? "s-accent" : "s-muted", "stroke-width": fresh ? 3 : 1.5 }));
    }
    for (let v = 1; v <= n; v++) {
      const [x, y] = pos(v);
      const r = st.find(v);
      const alone = !st.edges.some(([a, b]) => a === v || b === v);
      svg.append(s("circle", { cx: x, cy: y, r: 13, class: alone ? "f-cell" : "f-island", style: `--h:${hue(r)}`, stroke: st.cyc[r] && !alone ? "var(--accent)" : "var(--line)", "stroke-width": st.cyc[r] && !alone ? 3.5 : 1, opacity: used.has(v) ? 1 : 0.4 }));
      svg.append(s("text", { x, y: y + 4, "text-anchor": "middle", "font-size": 10, class: "f-fg", text: String(v) }));
    }
    stage.replaceChildren(svg);
    const e = events[k - 1];
    tiles.set(0, k === 0 ? CG.t("start", "kezdés") : e === "?" ? `? → ${st.answers.at(-1)}` : `+ ${e[0]} ${e[1]}`);
    tiles.set(1, String(st.cursed));
    tiles.set(2, st.answers.slice(-10).join(" ") || "–");
  }
  const p = player({ count: events.length + 1, render, interval: 350, label: (k) => CG.t(`Event ${k} of ${events.length}`, `${k}/${events.length}. esemény`) });
  root.append(tiles, stage, p.el);
  p.set(events.length);
});
