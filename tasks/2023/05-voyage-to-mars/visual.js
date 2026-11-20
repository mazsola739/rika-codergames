CG.visual("2023-5", (root, d, { h, css, onTheme, stats, bytes, fmt }) => {
  const wv = new Float32Array(bytes(d.wv).buffer);
  const chosen = bytes(d.chosen);
  const isChosen = (i) => (chosen[i >> 3] >> (i & 7)) & 1;
  let maxW = 0;
  let maxV = 0;
  for (let i = 0; i < d.count; i++) ((maxW = Math.max(maxW, wv[2 * i])), (maxV = Math.max(maxV, wv[2 * i + 1])));
  const W = 960;
  const H = 560;
  const M = { l: 60, r: 16, t: 16, b: 40 };
  const canvas = h("canvas", { class: "vis-canvas", width: W, height: H, role: "img", "aria-label": "Scatter plot of all machines", style: { imageRendering: "auto", maxWidth: "760px" } });
  const ctx = canvas.getContext("2d");
  const x = (w) => M.l + (w / maxW) * (W - M.l - M.r);
  const y = (v) => H - M.b - (v / maxV) * (H - M.t - M.b);
  let packed = 0;
  for (let i = 0; i < d.count; i++) packed += isChosen(i);
  function draw() {
    ctx.fillStyle = css("--bg");
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = css("--line");
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(M.l, M.t);
    ctx.lineTo(M.l, H - M.b);
    ctx.lineTo(W - M.r, H - M.b);
    ctx.stroke();
    for (const pass of [0, 1])
      for (let i = 0; i < d.count; i++) {
        if (isChosen(i) !== pass) continue;
        ctx.fillStyle = pass ? css("--accent") : css("--muted");
        ctx.globalAlpha = pass ? 0.75 : 0.35;
        ctx.fillRect(x(wv[2 * i]) - 1.5, y(wv[2 * i + 1]) - 1.5, 3, 3);
      }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = css("--fg");
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(x(0), y(0));
    const wEnd = Math.min(maxW, maxV / d.breakRatio);
    ctx.lineTo(x(wEnd), y(wEnd * d.breakRatio));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = css("--muted");
    ctx.font = "14px Inter, system-ui, sans-serif";
    ctx.fillText("size →", W - M.r - 50, H - 12);
    ctx.save();
    ctx.translate(18, M.t + 80);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("usefulness →", 0, 0);
    ctx.restore();
    ctx.fillText(`${fmt(d.breakRatio, 2)} per unit of size`, x(wEnd) - 150, y(wEnd * d.breakRatio) + 22);
  }
  root.append(
    stats([["Machines", fmt(d.count)], ["Packed", fmt(packed)], ["Size used", `${fmt(d.used, 2)} / ${fmt(d.capacity)}`], ["Value (optimal)", fmt(d.value, 2)], ["Upper bound", fmt(d.bound, 2)]]),
    h("div", { class: "vis-frame" }, canvas),
  );
  onTheme(draw);
  draw();
});
