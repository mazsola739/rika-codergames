CG.visual("2023-4", (root, d, { h, s, player, stats }) => {
  const W = 640;
  const H = 520;
  const P = 24;
  const at = new Map(d.nodes.map((v, i) => [v, [P + d.pos[i][0] * (W - 2 * P), P + d.pos[i][1] * (H - 2 * P)]]));
  const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Network of 100 tourist points and their trails" });
  for (const [u, v] of d.edges) {
    const [x1, y1] = at.get(u);
    const [x2, y2] = at.get(v);
    svg.append(s("line", { x1, y1, x2, y2, class: "s-line", "stroke-width": 1 }));
  }
  const route = s("polyline", { fill: "none", class: "s-accent", "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" });
  svg.append(route);
  const dots = new Map();
  for (const v of d.nodes) {
    const [x, y] = at.get(v);
    const c = s("circle", { cx: x, cy: y, r: 7, class: "f-surface", stroke: "var(--muted)", "stroke-width": 1 });
    svg.append(c, s("text", { x, y: y + 2.6, "text-anchor": "middle", "font-size": 7, class: "f-fg", text: String(v) }));
    dots.set(v, c);
  }
  const tiles = stats([["Points visited", "0"], ["Trails", String(d.edges.length)], ["Current point", ""]]);
  function render(k) {
    const part = d.path.slice(0, k + 1);
    route.setAttribute("points", part.map((v) => at.get(v).join(",")).join(" "));
    const seen = new Set(part);
    for (const [v, c] of dots) {
      c.setAttribute("class", v === part.at(-1) ? "f-accent" : seen.has(v) ? "f-info" : "f-surface");
      c.setAttribute("r", v === part.at(-1) ? 9 : 7);
    }
    tiles.set(0, `${part.length} / ${d.nodes.length}`);
    tiles.set(2, String(part.at(-1)));
  }
  const p = player({ count: d.path.length, render, interval: 120, label: (k) => (k === d.path.length - 1 ? "Every point visited, none twice." : `Step ${k + 1}: at point ${d.path[k]}.`) });
  root.append(tiles, h("div", { class: "vis-frame" }, svg), p.el);
  p.set(d.path.length - 1);
});
