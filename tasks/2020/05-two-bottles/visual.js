CG.visual("2020-5", (root, _, { h, s, slider, stats, scale, segmented }) => {
  const FLOORS = 1000;
  let strategy = "steps";
  const firstDrops = (kind) => {
    if (kind === "half") return [500];
    const out = [];
    for (let f = 0, step = 45; step > 0 && f + step <= FLOORS; step--) out.push((f += step));
    return out;
  };
  // Drops needed when the bottle breaks from floor `b` upwards (b = FLOORS + 1: never breaks).
  function plan(b, kind) {
    const drops = [];
    let safe = 0;
    for (const f of firstDrops(kind)) {
      drops.push({ floor: f, bottle: 1, broke: f >= b });
      if (f >= b) break;
      safe = f;
    }
    const top = drops.at(-1).broke ? drops.at(-1).floor - 1 : FLOORS;
    for (let f = safe + 1; f <= top; f++) {
      drops.push({ floor: f, bottle: 2, broke: f >= b });
      if (f >= b) break;
    }
    return drops;
  }
  let breakAt = 600;
  const building = h("div", { class: "vis-frame" });
  const chart = h("div", { class: "vis-frame" });
  const tiles = stats([[CG.t("Drops for this floor", "Ejtések ennél az emeletnél"), ""], [CG.t("Worst case", "Legrosszabb eset"), ""], [CG.t("Bottle 1 drops", "Az 1. üveg ejtései"), ""]]);
  const list = h("p", { class: "vis-mono" });

  function draw() {
    const drops = plan(breakAt, strategy);
    const W = 640;
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} 90`, role: "img", "aria-label": CG.t("The building lying on its side with every drop marked", "Az oldalára fektetett épület, minden ejtés bejelölve") });
    const x = scale(1, FLOORS, 12, W - 12);
    svg.append(s("rect", { x: 12, y: 40, width: W - 24, height: 14, rx: 7, class: "f-cell" }));
    svg.append(s("rect", { x: x(breakAt), y: 40, width: W - 12 - x(breakAt), height: 14, rx: 0, class: "f-bad", opacity: 0.35 }));
    drops.forEach((d, i) => {
      svg.append(s("line", { x1: x(d.floor), x2: x(d.floor), y1: d.bottle === 1 ? 22 : 58, y2: d.bottle === 1 ? 40 : 72, class: d.bottle === 1 ? "s-accent" : "s-info", "stroke-width": 2 }));
      if (d.bottle === 1) svg.append(s("text", { x: x(d.floor), y: 18, "text-anchor": "middle", class: "t-label", "font-size": 9, text: String(i + 1) }));
    });
    svg.append(s("text", { x: 12, y: 88, class: "t-label", text: CG.t("floor 1", "1. emelet") }));
    svg.append(s("text", { x: W - 12, y: 88, "text-anchor": "end", class: "t-label", text: CG.t("floor 1000", "1000. emelet") }));
    building.replaceChildren(svg, h("div", { class: "vis-legend" }, h("span", {}, h("i", { style: { background: "var(--accent)" } }), CG.t("bottle 1 (numbered)", "1. üveg (számozva)")), h("span", {}, h("i", { style: { background: "var(--info)" } }), CG.t("bottle 2", "2. üveg")), h("span", {}, h("i", { style: { background: "var(--bad)", opacity: 0.4 } }), CG.t("floors where it breaks", "emeletek, ahol eltörik"))));

    const all = Array.from({ length: FLOORS }, (_, i) => plan(i + 1, strategy).length);
    const worst = Math.max(...all);
    const H = 150;
    const cx = scale(1, FLOORS, 36, W - 10);
    const cy = scale(0, Math.max(worst, 45), H - 20, 10);
    const c = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": CG.t("Drops needed for every floor", "Szükséges ejtések emeletenként") });
    c.append(s("path", { d: all.map((v, i) => `${i ? "L" : "M"}${cx(i + 1).toFixed(1)},${cy(v).toFixed(1)}`).join(""), fill: "none", class: "s-info", "stroke-width": 1.2 }));
    c.append(s("line", { x1: 36, x2: W - 10, y1: cy(worst), y2: cy(worst), class: "s-accent", "stroke-dasharray": "4 3" }));
    c.append(s("text", { x: 32, y: cy(worst) + 4, "text-anchor": "end", class: "t-label", text: String(worst) }));
    c.append(s("circle", { cx: cx(breakAt), cy: cy(all[breakAt - 1]), r: 4, class: "f-accent" }));
    c.append(s("text", { x: W - 10, y: H - 4, "text-anchor": "end", class: "t-label", text: CG.t("breaking floor →", "törési emelet →") }));
    chart.replaceChildren(c);
    tiles.set(0, String(drops.length));
    tiles.set(1, String(worst));
    tiles.set(2, String(drops.filter((d) => d.bottle === 1).length));
    list.textContent = drops.map((d) => `${d.floor}${d.broke ? "✗" : ""}`).join(" → ");
  }
  const pick = segmented(
    [
      { value: "steps", label: CG.t("Shrinking steps (45, 44, …)", "Csökkenő lépések (45, 44, …)") },
      { value: "half", label: CG.t("Start at 500", "Indulás az 500. emeletről") },
    ],
    (v) => ((strategy = v), draw()),
    "steps",
    CG.t("Strategy", "Stratégia"),
  );
  root.append(h("div", { class: "vis-row" }, pick), slider({ label: CG.t("Breaks from floor", "Ettől az emelettől törik"), min: 1, max: FLOORS, value: breakAt, onInput: (v) => ((breakAt = v), draw()) }), tiles, building, list, chart);
  draw();
});
