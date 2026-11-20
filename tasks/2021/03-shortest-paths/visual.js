CG.visual("2021-3", (root, cases, { h, s, segmented }) => {
  const stage = h("div", { class: "vis-frame" });
  const note = h("p", { class: "vis-note" });
  function draw(k) {
    const { target, edges } = cases[k];
    const vertices = [...new Set([target, ...edges.flat()])].sort();
    const rev = new Map(vertices.map((v) => [v, []]));
    for (const [a, b] of edges) rev.get(b).push(a);
    const dist = new Map([[target, 0]]);
    const queue = [target];
    for (let i = 0; i < queue.length; i++) for (const u of rev.get(queue[i])) if (!dist.has(u)) (dist.set(u, dist.get(queue[i]) + 1), queue.push(u));
    const maxD = Math.max(...dist.values());
    const cols = new Map();
    for (const v of vertices) {
      const col = dist.has(v) ? maxD - dist.get(v) + 1 : 0;
      if (!cols.has(col)) cols.set(col, []);
      cols.get(col).push(v);
    }
    const ncol = maxD + 2;
    const tallest = Math.max(...[...cols.values()].map((c) => c.length));
    const W = 640;
    const H = Math.max(160, tallest * 34 + 40);
    const colX = (c) => 50 + (c * (W - 100)) / Math.max(1, ncol - 1);
    const pos = new Map();
    for (const [c, vs] of cols) vs.forEach((v, i) => pos.set(v, [colX(c), 30 + ((i + 0.5) * (H - 40)) / vs.length]));
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": CG.t(`Graph with target ${target}`, `Gráf, a cél: ${target}`) });
    svg.append(s("defs", {}, s("marker", { id: `arr${k}`, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" }, s("path", { d: "M0,0 L10,5 L0,10 z", class: "f-muted" }))));
    for (const [c] of cols) svg.append(s("text", { x: colX(c), y: 16, "text-anchor": "middle", class: "t-label", text: c === 0 ? "INF" : c === ncol - 1 ? CG.t("target", "cél") : `${maxD - c + 1}` }));
    for (const [a, b] of edges) {
      const [x1, y1] = pos.get(a);
      const [x2, y2] = pos.get(b);
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const sh = 14 / len;
      const onPath = dist.has(a) && dist.has(b) && dist.get(a) === dist.get(b) + 1;
      svg.append(s("line", { x1: x1 + (x2 - x1) * sh, y1: y1 + (y2 - y1) * sh, x2: x2 - (x2 - x1) * sh, y2: y2 - (y2 - y1) * sh, class: onPath ? "s-accent" : "s-line", "stroke-width": onPath ? 1.8 : 1.2, "marker-end": `url(#arr${k})` }));
    }
    for (const v of vertices) {
      const [x, y] = pos.get(v);
      const isT = v === target;
      svg.append(s("circle", { cx: x, cy: y, r: 13, class: isT ? "f-accent" : dist.has(v) ? "f-surface" : "f-cell", stroke: "var(--line)" }));
      svg.append(s("text", { x, y: y + 4, "text-anchor": "middle", "font-size": v.length > 4 ? 7 : 10, class: isT ? "f-surface" : "f-fg", "font-weight": 600, text: v.length > 9 ? v.slice(0, 8) + "…" : v }));
    }
    stage.replaceChildren(svg);
    note.textContent = CG.t(`Target ${target}: ${dist.size - 1} vertices can reach it, ${vertices.length - dist.size} cannot. Pink edges lie on shortest paths.`, `Cél: ${target}. ${dist.size - 1} csúcs eléri, ${vertices.length - dist.size} nem. A rózsaszín élek legrövidebb utakon vannak.`);
  }
  root.append(h("div", { class: "vis-row" }, segmented(cases.map((c, i) => ({ value: i, label: CG.t(`Target ${c.target}`, `Cél: ${c.target}`) })), draw, 0, CG.t("Graph", "Gráf"))), stage, note);
  draw(0);
});
