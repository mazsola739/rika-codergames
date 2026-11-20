CG.visual("2024-2", (root, _, { h, s, slider, stats, fmt }) => {
  const stage = h("div", { class: "vis-frame" });
  const tiles = stats([["Sum of the diamond", ""], ["(N − 1)(N² + 1)", ""]]);
  function draw(N) {
    const m = (N - 1) / 2;
    const size = Math.min(44, 620 / N);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${N * size} ${N * size}`, role: "img", "aria-label": `${N} by ${N} grid with the diamond highlighted`, style: { maxWidth: `${Math.min(620, N * 46)}px`, margin: "0 auto" } });
    let sum = 0;
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const v = r * N + c + 1;
        const on = Math.abs(r - m) + Math.abs(c - m) === m;
        if (on) sum += v;
        svg.append(s("rect", { x: c * size + 1, y: r * size + 1, width: size - 2, height: size - 2, rx: 3, class: on ? "f-accent" : "f-cell", opacity: on ? 0.85 : 1 }));
        if (size >= 18) svg.append(s("text", { x: c * size + size / 2, y: r * size + size / 2 + size * 0.12, "text-anchor": "middle", "font-size": size * (v > 99 ? 0.28 : 0.34), class: on ? "f-surface" : "f-muted", "font-weight": on ? 700 : 400, text: String(v) }));
      }
    stage.replaceChildren(svg);
    tiles.set(0, fmt(sum));
    tiles.set(1, fmt((N - 1) * (N * N + 1)));
  }
  root.append(slider({ label: "N", min: 3, max: 25, step: 2, value: 5, onInput: draw }), tiles, stage);
  draw(5);
});
