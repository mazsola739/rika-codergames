CG.visual("2025-women-2", (root, d, { h, s, css, onTheme, stats, bytes }) => {
  const R = d.rows;
  const C = d.cols;
  const v = bytes(d.values);
  const at = (r, c) => v[((r % R) + R) % R * C + (((c % C) + C) % C)];
  const HALF = [[-1, 0], [-2, 0], [0, 1], [0, 2], [1, 1], [2, 2], [-1, 1], [-2, 2]];
  const centres = [];
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      const p = at(r, c);
      if (!HALF.every(([dr, dc]) => p > at(r + dr, c + dc) && p > at(r - dr, c - dc))) continue;
      centres.push({ r, c, stable: HALF.every(([dr, dc]) => at(r + dr, c + dc) === at(r - dr, c - dc)) });
    }
  const max = Math.max(...v);
  const S = 3;
  const canvas = h("canvas", { class: "vis-canvas", width: C * S, height: R * S, role: "img", "aria-label": "Heat map of the universe with its gravitational centres", style: { imageRendering: "auto", maxWidth: "600px", cursor: "pointer" } });
  const ctx = canvas.getContext("2d");
  let selected = centres.find((x) => !x.stable) ?? centres[0];
  const detail = h("div", { class: "vis-frame" });
  function draw() {
    ctx.fillStyle = css("--bg");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = css("--fg");
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) {
        const x = at(r, c);
        if (!x) continue;
        ctx.globalAlpha = 0.15 + (0.85 * x) / max;
        ctx.fillRect(c * S, r * S, S, S);
      }
    ctx.globalAlpha = 1;
    for (const m of centres) {
      ctx.strokeStyle = m.stable ? css("--good") : css("--accent");
      ctx.lineWidth = m === selected ? 3 : 2;
      ctx.beginPath();
      ctx.arc(m.c * S + S / 2, m.r * S + S / 2, m === selected ? 11 : 7, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  function showDetail() {
    const { r, c } = selected;
    const svg = s("svg", { class: "vis-svg", viewBox: "0 0 250 250", role: "img", "aria-label": `The 5 by 5 neighbourhood of the centre at row ${r}, column ${c}`, style: { maxWidth: "250px" } });
    for (let dr = -2; dr <= 2; dr++)
      for (let dc = -2; dc <= 2; dc++) {
        const onAxis = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
        const val = at(r + dr, c + dc);
        const mirror = at(r - dr, c - dc);
        const centre = !dr && !dc;
        const cls = centre ? "f-info" : !onAxis ? "f-cell" : val === mirror ? "f-good" : "f-bad";
        svg.append(s("rect", { x: (dc + 2) * 50 + 2, y: (dr + 2) * 50 + 2, width: 46, height: 46, rx: 6, class: cls, opacity: onAxis ? 0.75 : 1 }));
        svg.append(s("text", { x: (dc + 2) * 50 + 25, y: (dr + 2) * 50 + 32, "text-anchor": "middle", "font-size": 20, "font-weight": 600, class: onAxis ? "f-fg" : "f-muted", text: String(val) }));
      }
    detail.replaceChildren(
      h("div", { class: "vis-row" }, svg, h("p", { class: "vis-note", style: { flex: "1 1 220px" }, text: `Centre at row ${r}, column ${c}: ${selected.stable ? "stable, every axis value equals its mirror image." : "unstable, the red cells differ from the cell mirrored through the centre."}` })),
    );
    draw();
  }
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const c = ((e.clientX - rect.left) / rect.width) * C;
    const r = ((e.clientY - rect.top) / rect.height) * R;
    let best = null;
    for (const m of centres) {
      const dist = Math.hypot(m.c + 0.5 - c, m.r + 0.5 - r);
      if (!best || dist < best[0]) best = [dist, m];
    }
    if (best && best[0] < 8) ((selected = best[1]), showDetail());
  });
  const list = h(
    "select",
    { "aria-label": "Gravitational centre", class: "vis-btn", onchange: (e) => ((selected = centres[Number(e.target.value)]), showDetail()) },
    centres.map((m, i) => h("option", { value: i, text: `${m.stable ? "stable" : "unstable"} · row ${m.r}, col ${m.c}`, selected: m === selected })),
  );
  root.append(
    stats([["Centres", String(centres.length)], ["Stable", String(centres.filter((m) => m.stable).length)], ["Unstable", String(centres.filter((m) => !m.stable).length)]]),
    h("div", { class: "vis-frame" }, canvas),
    h("div", { class: "vis-row" }, list),
    detail,
  );
  onTheme(draw);
  showDetail();
});
