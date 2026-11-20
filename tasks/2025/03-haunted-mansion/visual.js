CG.visual("2025-3", (root, d, { h, s, player, segmented, fmt }) => {
  const stage = h("div", { class: "vis-frame" });
  const note = h("p", { class: "vis-note" });
  let p;
  function load(k) {
    const ex = d.examples[k];
    const out = new Map(ex.rooms.map((l) => { const [r, ...to] = l.split(",").map(Number); return [r, to]; }));
    const rooms = [...out.keys()].sort((a, b) => a - b);
    const indeg = new Map(rooms.map((r) => [r, 0]));
    for (const to of out.values()) for (const t of to) indeg.set(t, indeg.get(t) + 1);
    const entrance = rooms.find((r) => indeg.get(r) === 0);
    const first = new Set(ex.vanished);
    const extra = new Set(rooms.filter((r) => !first.has(r) && new Set(out.get(r).filter((t) => first.has(t))).size >= 2));
    const gone = (r) => first.has(r) || extra.has(r);
    const reach = new Set();
    if (!gone(entrance)) {
      const q = [entrance];
      reach.add(entrance);
      for (let i = 0; i < q.length; i++) for (const t of out.get(q[i])) if (!reach.has(t) && !gone(t)) (reach.add(t), q.push(t));
    }
    // layered layout by longest distance from the entrance (the graph has no cycles)
    const depth = new Map(rooms.map((r) => [r, 0]));
    for (let pass = 0; pass < rooms.length; pass++) for (const [r, to] of out) for (const t of to) depth.set(t, Math.max(depth.get(t), depth.get(r) + 1));
    const layers = new Map();
    for (const r of rooms) (layers.has(depth.get(r)) || layers.set(depth.get(r), []), layers.get(depth.get(r)).push(r));
    const W = 560;
    const H = 230;
    const nl = layers.size;
    const at = new Map();
    for (const [dd, rs] of layers) rs.forEach((r, i) => at.set(r, [60 + (dd * (W - 120)) / Math.max(1, nl - 1), 30 + ((i + 0.5) * (H - 60)) / rs.length]));
    const texts = [
      `Room ${entrance} has no passage leading into it: the main entrance.`,
      `Rooms ${[...first].join(", ")} vanish.`,
      extra.size ? `The spell: room ${[...extra].join(", ")} has passages to two vanished rooms and vanishes too.` : "The spell: no room has passages to two vanished rooms.",
      `From the entrance ${reach.size} room${reach.size === 1 ? "" : "s"} can still be reached.`,
    ];
    const render = (step) => {
      const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "The example mansion" });
      svg.append(s("defs", {}, s("marker", { id: `hm${k}`, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto" }, s("path", { d: "M0,0 L10,5 L0,10 z", class: "f-muted" }))));
      for (const [r, to] of out)
        for (const t of to) {
          const [x1, y1] = at.get(r);
          const [x2, y2] = at.get(t);
          const len = Math.hypot(x2 - x1, y2 - y1);
          const k2 = 20 / len;
          const live = step >= 3 && reach.has(r) && reach.has(t);
          svg.append(s("line", { x1: x1 + (x2 - x1) * k2, y1: y1 + (y2 - y1) * k2, x2: x2 - (x2 - x1) * k2, y2: y2 - (y2 - y1) * k2, class: live ? "s-good" : "s-line", "stroke-width": live ? 2.5 : 1.5, "marker-end": `url(#hm${k})` }));
        }
      for (const r of rooms) {
        const [x, y] = at.get(r);
        const cls = step >= 1 && first.has(r) ? "f-cell" : step >= 2 && extra.has(r) ? "f-cell" : step >= 3 && reach.has(r) ? "f-good" : r === entrance ? "f-info" : "f-surface";
        svg.append(s("circle", { cx: x, cy: y, r: 18, class: cls, stroke: step >= 2 && extra.has(r) ? "var(--accent)" : "var(--line)", "stroke-width": step >= 2 && extra.has(r) ? 3 : 1, "stroke-dasharray": (step >= 1 && first.has(r)) || (step >= 2 && extra.has(r)) ? "4 3" : null }));
        svg.append(s("text", { x, y: y + 5, "text-anchor": "middle", "font-size": 14, "font-weight": 600, class: (step >= 1 && first.has(r)) || (step >= 2 && extra.has(r)) ? "f-muted" : step >= 3 && reach.has(r) ? "f-surface" : "f-fg", text: String(r) }));
      }
      stage.replaceChildren(svg);
      note.textContent = texts[step];
    };
    if (p) p.el.remove();
    p = player({ count: 4, render, interval: 1600 });
    stage.after(p.el);
    p.set(3);
  }
  const real = d.real;
  const max = Math.max(...real.reachable);
  const bars = s("svg", { class: "vis-svg", viewBox: "0 0 640 130", role: "img", "aria-label": "Reachable rooms for each possible entrance" });
  real.entrances.forEach((e, i) => {
    const w = (real.reachable[i] / max) * 440;
    bars.append(s("text", { x: 0, y: 22 + i * 30, class: "t-label", text: `entrance ${e}` }));
    bars.append(s("rect", { x: 110, y: 10 + i * 30, width: w, height: 18, rx: 4, class: "f-good", opacity: 0.8 }));
    bars.append(s("text", { x: 116 + w, y: 24 + i * 30, class: "t-label t-strong", text: fmt(real.reachable[i]) }));
  });
  root.append(
    h("div", { class: "vis-row" }, segmented(d.examples.map((_, i) => ({ value: i, label: `Example ${i + 1}` })), load, 0, "Example")),
    stage,
    note,
    h("p", { class: "vis-note", text: `The real mansion: ${fmt(real.rooms)} rooms, ${real.extra} extra rooms vanish, and four rooms have no way in:` }),
    h("div", { class: "vis-frame" }, bars),
  );
  load(0);
});
