CG.visual("2026-3", (root, { n, edges }, { h, s, player, stats, hue }) => {
  const out = Array.from({ length: n + 1 }, () => []);
  const indeg = new Array(n + 1).fill(0);
  for (const [a, b] of edges) (out[a].push(b), indeg[b]++);
  // topological order (Kahn) and depth = longest distance from a source
  const order = [];
  const deg = [...indeg];
  const q = [];
  for (let v = 1; v <= n; v++) if (!deg[v]) q.push(v);
  while (q.length) {
    const v = q.shift();
    order.push(v);
    for (const w of out[v]) if (--deg[w] === 0) q.push(w);
  }
  const depth = new Array(n + 1).fill(0);
  for (const v of order) for (const w of out[v]) depth[w] = Math.max(depth[w], depth[v] + 1);
  const layers = [];
  for (let v = 1; v <= n; v++) (layers[depth[v]] ??= []).push(v);
  const W = 640;
  const H = 360;
  const pos = new Map();
  layers.forEach((vs, d) => vs.forEach((v, i) => pos.set(v, [24 + (d * (W - 48)) / (layers.length - 1), 20 + ((i + 0.5) * (H - 40)) / vs.length])));
  // path counts after processing the first k nodes of the order
  const countsAfter = (k) => {
    const ways = new Array(n + 1).fill(0n);
    ways[1] = 1n;
    for (let i = 0; i < k; i++) for (const w of out[order[i]]) ways[w] += ways[order[i]];
    return ways;
  };
  const final = countsAfter(order.length);
  const maxLog = Math.log10(Number(final.reduce((a, b) => (b > a ? b : a), 1n)));
  const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `Graph of ${n} nodes and ${edges.length} edges` });
  const edgeEls = edges.map(([a, b]) => {
    const [x1, y1] = pos.get(a);
    const [x2, y2] = pos.get(b);
    const el = s("line", { x1, y1, x2, y2, class: "s-line", "stroke-width": 0.6 });
    svg.append(el);
    return el;
  });
  const nodeEls = new Map();
  for (let v = 1; v <= n; v++) {
    const [x, y] = pos.get(v);
    const c = s("circle", { cx: x, cy: y, r: v === 1 || v === n ? 9 : 6.5, class: "f-cell", stroke: "var(--line)" }, s("title", { text: `node ${v}` }));
    svg.append(c);
    nodeEls.set(v, c);
  }
  const tiles = stats([["Processed", ""], ["Paths to node " + n, ""], ["Edges", String(edges.length)]]);
  function render(k) {
    const ways = countsAfter(k);
    const current = order[k - 1];
    for (let v = 1; v <= n; v++) {
      const w = ways[v];
      const c = nodeEls.get(v);
      if (w > 0n) {
        const t = Math.log10(Number(w)) / (maxLog || 1);
        c.setAttribute("class", "f-island");
        c.setAttribute("style", `--h:${Math.round(220 - 200 * t)}`);
      } else {
        c.setAttribute("class", "f-cell");
        c.removeAttribute("style");
      }
      c.setAttribute("stroke", v === current ? "var(--accent)" : "var(--line)");
      c.setAttribute("stroke-width", v === current ? 3 : 1);
      c.firstChild.textContent = `node ${v}: ${w.toLocaleString("en-US")} paths`;
    }
    edges.forEach(([a], i) => {
      const hot = a === current;
      edgeEls[i].setAttribute("class", hot ? "s-accent" : "s-line");
      edgeEls[i].setAttribute("stroke-width", hot ? 1.6 : 0.6);
    });
    tiles.set(0, `${k} / ${order.length}`);
    tiles.set(1, ways[n].toLocaleString("en-US"));
  }
  const p = player({ count: order.length + 1, render, interval: 220, label: (k) => (k === 0 ? "Only node 1 has a path (itself)." : `Node ${order[k - 1]} passes its ${countsAfter(k - 1)[order[k - 1]].toLocaleString("en-US")} paths along ${out[order[k - 1]].length} edges.`) });
  root.append(tiles, h("div", { class: "vis-frame" }, svg), p.el, h("p", { class: "vis-note", text: "Hover a node to see its count." }));
  p.set(order.length);
});
