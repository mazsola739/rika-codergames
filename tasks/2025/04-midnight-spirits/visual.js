CG.visual("2025-4", (root, maps, { h, s, segmented, stats }) => {
  let k = maps.length - 1;
  let show = "danger";
  const stage = h("div", { class: "vis-frame" });
  const tiles = stats([[CG.t("Size", "Méret"), ""], [CG.t("Safest total", "Legbiztonságosabb összeg"), ""], [CG.t("Path length", "Úthossz"), ""]]);
  function draw() {
    const g = maps[k];
    const R = g.length;
    const C = g[0].length;
    const best = g.map((row) => row.map(() => 0));
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) {
        const up = r ? best[r - 1][c] : Infinity;
        const left = c ? best[r][c - 1] : Infinity;
        best[r][c] = g[r][c] + (r || c ? Math.min(up, left) : 0);
      }
    const path = new Set();
    for (let r = R - 1, c = C - 1; ; ) {
      path.add(r * C + c);
      if (!r && !c) break;
      if (r && (!c || best[r - 1][c] < best[r][c - 1])) r--;
      else c--;
    }
    const maxV = Math.max(...g.flat());
    const maxB = best[R - 1][C - 1];
    const size = Math.min(56, 620 / C);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${C * size} ${R * size}`, role: "img", "aria-label": CG.t(`Danger map of ${R} by ${C}`, `${R} × ${C}-es veszélytérkép`), style: { maxWidth: `${Math.min(620, C * 58)}px`, margin: "0 auto" } });
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) {
        const on = path.has(r * C + c);
        const t = show === "danger" ? g[r][c] / maxV : best[r][c] / maxB;
        svg.append(s("rect", { x: c * size + 1, y: r * size + 1, width: size - 2, height: size - 2, rx: 4, class: show === "danger" ? "f-bad" : "f-info", opacity: 0.12 + 0.6 * t }));
        if (on) svg.append(s("rect", { x: c * size + 2.5, y: r * size + 2.5, width: size - 5, height: size - 5, rx: 4, fill: "none", class: "s-accent", "stroke-width": 3 }));
        if (size >= 20) svg.append(s("text", { x: c * size + size / 2, y: r * size + size / 2 + size * 0.12, "text-anchor": "middle", "font-size": size * (show === "best" && best[r][c] > 99 ? 0.28 : 0.34), class: "f-fg", "font-weight": on ? 700 : 400, text: String(show === "danger" ? g[r][c] : best[r][c]) }));
      }
    stage.replaceChildren(svg);
    tiles.set(0, `${R} × ${C}`);
    tiles.set(1, String(maxB));
    tiles.set(2, CG.t(`${path.size} cells`, `${path.size} cella`));
  }
  root.append(
    h("div", { class: "vis-row" }, segmented(maps.map((m, i) => ({ value: i, label: `${m.length}×${m[0].length}` })), (v) => ((k = v), draw()), k, CG.t("Map", "Térkép"))),
    h("div", { class: "vis-row" }, segmented([{ value: "danger", label: CG.t("Danger", "Veszély") }, { value: "best", label: CG.t("Best so far", "Legjobb eddig") }], (v) => ((show = v), draw()), show, CG.t("Numbers", "Számok"))),
    tiles,
    stage,
  );
  draw();
});
