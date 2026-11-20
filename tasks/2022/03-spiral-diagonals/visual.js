CG.visual("2022-3", (root, _, { h, s, slider, stats, fmt }) => {
  const stage = h("div", { class: "vis-frame" });
  const tiles = stats([["Diagonal sum", ""], ["By the formula", ""], ["For 501 × 501", "83,960,501"]]);
  function spiral(n) {
    const g = Array.from({ length: n }, () => Array(n).fill(0));
    let r = (n - 1) / 2;
    let c = (n - 1) / 2;
    let v = 1;
    g[r][c] = v;
    // Clockwise: right, down, left, up, with run lengths 1,1,2,2,3,3,...
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (let run = 1, d = 0; v < n * n; run++)
      for (let twice = 0; twice < 2 && v < n * n; twice++, d = (d + 1) % 4)
        for (let k = 0; k < run && v < n * n; k++) {
          r += dirs[d][0];
          c += dirs[d][1];
          g[r][c] = ++v;
        }
    return g;
  }
  function draw(n) {
    const g = spiral(n);
    const size = Math.min(48, 600 / n);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${n * size} ${n * size}`, role: "img", "aria-label": `Number spiral of side ${n}`, style: { maxWidth: `${Math.min(600, n * 52)}px`, margin: "0 auto" } });
    let sum = 0;
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) {
        const diag = r === c || r + c === n - 1;
        if (diag) sum += g[r][c];
        const ring = Math.max(Math.abs(r - (n - 1) / 2), Math.abs(c - (n - 1) / 2));
        svg.append(s("rect", { x: c * size + 1, y: r * size + 1, width: size - 2, height: size - 2, rx: 3, class: diag ? "f-accent" : "f-cell", opacity: diag ? 0.35 + (0.6 * ring) / ((n - 1) / 2 || 1) : 1 }));
        svg.append(s("text", { x: c * size + size / 2, y: r * size + size / 2 + size * 0.13, "text-anchor": "middle", "font-size": size * (g[r][c] > 99 ? 0.28 : 0.36), class: diag ? "f-fg" : "f-muted", "font-weight": diag ? 700 : 400, text: String(g[r][c]) }));
      }
    let formula = 1;
    for (let k = 3; k <= n; k += 2) formula += 4 * k * k - 6 * (k - 1);
    stage.replaceChildren(svg);
    tiles.set(0, fmt(sum));
    tiles.set(1, fmt(formula));
  }
  root.append(slider({ label: "Side", min: 1, max: 13, step: 2, value: 5, onInput: draw }), tiles, stage);
  draw(5);
});
