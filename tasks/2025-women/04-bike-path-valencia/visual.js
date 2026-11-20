CG.visual("2025-women-4", (root, sets, { h, s, segmented, stats, scale }) => {
  const mapBox = h("div", { class: "vis-frame" });
  const timeBox = h("div", { class: "vis-frame" });
  const tiles = stats([[CG.t("Start", "Indulás"), ""], [CG.t("Arrival", "Érkezés"), ""], [CG.t("Waiting", "Várakozás"), ""]]);
  const clock = (t) => `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  const setName = (n) => {
    const en = n.replace(/^Set \d+\s*-\s*/, "");
    return CG.t(en, { Simple: "Egyszerű", Medium: "Közepes", Hard: "Nehéz", Large: "Nagy", "Tricky (forces waiting and detours)": "Trükkös (várakozásra és kerülőre kényszerít)", "Extreme (tight closures)": "Extrém (szoros lezárások)" }[en] ?? en);
  };
  function draw(k) {
    const [n, m, T] = sets[k].lines[0].split(/\s+/).map(Number);
    const roads = [];
    const adj = Array.from({ length: n + 1 }, () => []);
    for (const line of sets[k].lines.slice(1, 1 + m)) {
      const [u, v, mins, kk, ...rest] = line.split(/\s+/).map(Number);
      const closed = [];
      for (let j = 0; j < kk; j++) closed.push([rest[2 * j], rest[2 * j + 1]]);
      const road = { u, v, mins, closed };
      roads.push(road);
      adj[u].push([v, road]);
      adj[v].push([u, road]);
    }
    const depart = (t, road) => {
      let d = t;
      for (let moved = true; moved; ) {
        moved = false;
        for (const [a, b] of road.closed) if (a <= d && d < b) ((d = b), (moved = true));
      }
      return d;
    };
    const best = Array(n + 1).fill(Infinity);
    const prev = Array(n + 1).fill(null);
    const done = Array(n + 1).fill(false);
    best[1] = T;
    for (;;) {
      let u = -1;
      for (let x = 1; x <= n; x++) if (!done[x] && best[x] < Infinity && (u < 0 || best[x] < best[u])) u = x;
      if (u < 0) break;
      done[u] = true;
      for (const [v, road] of adj[u]) {
        const d = depart(best[u], road);
        if (d + road.mins < best[v]) ((best[v] = d + road.mins), (prev[v] = { from: u, road, wait: d - best[u], leave: d }));
      }
    }
    const legs = [];
    for (let v = n; prev[v]; v = prev[v].from) legs.unshift({ ...prev[v], to: v, arrive: best[v] });
    // map: stations on a circle
    const W = 640;
    const H = 260;
    const pos = (i) => [W / 2 + Math.cos((2 * Math.PI * (i - 1)) / n - Math.PI / 2) * 190, H / 2 + Math.sin((2 * Math.PI * (i - 1)) / n - Math.PI / 2) * 105];
    const onRoute = new Set(legs.map((l) => l.road));
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": CG.t("Stations and roads", "Állomások és utak") });
    for (const r of roads) {
      const [x1, y1] = pos(r.u);
      const [x2, y2] = pos(r.v);
      svg.append(s("line", { x1, y1, x2, y2, class: onRoute.has(r) ? "s-accent" : "s-line", "stroke-width": onRoute.has(r) ? 4 : 2, "stroke-dasharray": r.closed.length && !onRoute.has(r) ? "6 4" : null }));
      svg.append(s("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 5, "text-anchor": "middle", class: "t-label", text: `${r.mins}′` }));
    }
    for (let i = 1; i <= n; i++) {
      const [x, y] = pos(i);
      svg.append(s("circle", { cx: x, cy: y, r: 15, class: i === 1 ? "f-info" : i === n ? "f-good" : "f-surface", stroke: "var(--line)" }));
      svg.append(s("text", { x, y: y + 5, "text-anchor": "middle", "font-size": 13, "font-weight": 600, class: i === 1 || i === n ? "f-surface" : "f-fg", text: String(i) }));
    }
    mapBox.replaceChildren(svg, h("p", { class: "vis-note", text: CG.t("Dashed roads have closures. Station 1 is the start, the green one the destination.", "A szaggatott utakon vannak lezárások. Az 1-es állomás a kiindulópont, a zöld a cél.") }));
    // timeline
    const end = Math.max(best[n] === Infinity ? T + 60 : best[n], ...legs.flatMap((l) => l.road.closed.map((c) => c[1])));
    const x = scale(T, end, 120, W - 12);
    const TH = 30 + legs.length * 34;
    const tl = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${TH}`, role: "img", "aria-label": CG.t("Timeline of the route", "Az útvonal idővonala") });
    tl.append(s("defs", {}, s("pattern", { id: `hatch${k}`, width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, s("rect", { width: 2.5, height: 6, class: "f-bad" }))));
    legs.forEach((l, i) => {
      const y = 12 + i * 34;
      tl.append(s("text", { x: 0, y: y + 15, class: "t-label", text: `${l.from} → ${l.to} (${l.road.mins}′)` }));
      tl.append(s("rect", { x: 120, y, width: W - 132, height: 20, rx: 4, class: "f-cell" }));
      for (const [a, b] of l.road.closed) if (b > T && a < end) tl.append(s("rect", { x: x(Math.max(a, T)), y, width: x(Math.min(b, end)) - x(Math.max(a, T)), height: 20, fill: `url(#hatch${k})`, opacity: 0.7 }));
      if (l.wait) tl.append(s("rect", { x: x(l.leave - l.wait), y: y + 6, width: x(l.leave) - x(l.leave - l.wait), height: 8, rx: 2, class: "f-muted" }));
      tl.append(s("rect", { x: x(l.leave), y: y + 3, width: x(l.arrive) - x(l.leave), height: 14, rx: 4, class: "f-accent" }));
    });
    tl.append(s("text", { x: 120, y: TH - 2, class: "t-label", text: clock(T) }));
    tl.append(s("text", { x: W - 12, y: TH - 2, "text-anchor": "end", class: "t-label", text: clock(end) }));
    timeBox.replaceChildren(tl);
    tiles.set(0, `${clock(T)} (${T})`);
    tiles.set(1, best[n] === Infinity ? CG.t("unreachable", "elérhetetlen") : `${clock(best[n])} (${best[n]})`);
    tiles.set(2, CG.t(`${legs.reduce((sum, l) => sum + l.wait, 0)} min`, `${legs.reduce((sum, l) => sum + l.wait, 0)} perc`));
  }
  root.append(h("div", { class: "vis-row" }, segmented(sets.map((x, i) => ({ value: i, label: `${i + 1}. ${setName(x.name)}` })), draw, 0, CG.t("Set", "Készlet"))), tiles, mapBox, timeBox);
  draw(0);
});
