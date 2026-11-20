CG.visual("2021-1", (root, rows, { h, s, player, stats }) => {
  const H = rows.length;
  const W = rows[0].length;
  const find = (ch) => {
    for (let r = 0; r < H; r++) if (rows[r].includes(ch)) return [r, rows[r].indexOf(ch)];
  };
  const [sr, sc] = find("S");
  const [er, ec] = find("E");
  const dist = new Int32Array(H * W).fill(-1);
  const from = new Int32Array(H * W).fill(-1);
  const queue = [sr * W + sc];
  dist[queue[0]] = 0;
  for (let i = 0; i < queue.length; i++) {
    const cur = queue[i];
    const r = Math.floor(cur / W);
    const c = cur % W;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      if (nr < 0 || nr >= H || nc < 0 || nc >= W || rows[nr][nc] === "#" || dist[nr * W + nc] >= 0) continue;
      dist[nr * W + nc] = dist[cur] + 1;
      from[nr * W + nc] = cur;
      queue.push(nr * W + nc);
    }
  }
  const goal = er * W + ec;
  const pathLen = dist[goal];
  const path = [];
  for (let c = goal; c >= 0; c = from[c]) path.push(c);
  const maxDist = Math.max(...dist);
  const STEPS = pathLen + 2;

  // Draw the maze once; each step only recolours the cells.
  const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": CG.t(`Maze of ${H} by ${W} cells`, `${H} × ${W} cellás útvesztő`) });
  const cells = [];
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W; c++) {
      const rect = s("rect", { x: c, y: r, width: 1.02, height: 1.02, class: rows[r][c] === "#" ? "f-wall" : "f-cell" });
      cells.push(rect);
      svg.append(rect);
    }
  const pathLine = s("polyline", { fill: "none", class: "s-accent", "stroke-width": 0.42, "stroke-linecap": "round", "stroke-linejoin": "round" });
  svg.append(pathLine);
  for (const [r, c, label] of [[sr, sc, "S"], [er, ec, "E"]]) {
    svg.append(s("rect", { x: c, y: r, width: 1, height: 1, class: label === "S" ? "f-info" : "f-good" }));
    svg.append(s("text", { x: c + 0.5, y: r + 0.75, "text-anchor": "middle", "font-size": 0.7, "font-weight": 700, class: "f-surface", text: label }));
  }
  const tiles = stats([[CG.t("Steps from S", "Lépés S-től"), "0"], [CG.t("Cells reached", "Elért cellák"), "0"], [CG.t("Shortest path", "Legrövidebb út"), "?"]]);

  function render(step) {
    const front = Math.min(step, maxDist);
    let reached = 0;
    for (let i = 0; i < H * W; i++) {
      if (rows[Math.floor(i / W)][i % W] === "#") continue;
      const d = dist[i];
      if (d >= 0 && d <= front) {
        reached++;
        cells[i].setAttribute("class", d === front && step <= pathLen ? "f-accent" : "f-info");
        cells[i].setAttribute("opacity", String(0.2 + 0.55 * (1 - d / Math.max(1, maxDist))));
      } else {
        cells[i].setAttribute("class", "f-cell");
        cells[i].removeAttribute("opacity");
      }
    }
    const done = step > pathLen;
    pathLine.setAttribute("points", done ? path.map((cell) => `${(cell % W) + 0.5},${Math.floor(cell / W) + 0.5}`).join(" ") : "");
    tiles.set(0, String(Math.min(step, pathLen)));
    tiles.set(1, String(reached));
    tiles.set(2, done ? CG.t(`${pathLen} steps`, `${pathLen} lépés`) : "?");
  }
  const p = player({ count: STEPS, render, interval: 70, label: (i) => (i > pathLen ? CG.t("E reached: the path is traced back through the cells' predecessors.", "Elértük E-t: az út visszafelé, a cellák elődein át rajzolódik ki.") : CG.t(`The wave is ${i} steps from S.`, `A hullám ${i} lépésre van S-től.`)) });
  root.append(tiles, h("div", { class: "vis-frame" }, svg), p.el);
  p.set(STEPS - 1);
});
