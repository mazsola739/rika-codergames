CG.visual("2023-3", (root, [s1, s2], { h, css, onTheme, stats }) => {
  const n = s1.length;
  const m = s2.length;
  const W = m + 1;
  const L = new Uint16Array((n + 1) * W);
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) L[i * W + j] = s1[i - 1] === s2[j - 1] ? L[(i - 1) * W + j - 1] + 1 : Math.max(L[(i - 1) * W + j], L[i * W + j - 1]);
  const path = [];
  for (let i = n, j = m; i > 0 && j > 0; ) {
    path.push([i, j]);
    if (s1[i - 1] === s2[j - 1]) (i--, j--);
    else if (L[(i - 1) * W + j] >= L[i * W + j - 1]) i--;
    else j--;
  }
  const best = L[n * W + m];
  const canvas = h("canvas", { class: "vis-canvas", width: m + 1, height: n + 1, role: "img", "aria-label": "Heat map of the dynamic programming table", style: { imageRendering: "auto", maxWidth: "560px" } });
  const ctx = canvas.getContext("2d");
  function draw() {
    const img = ctx.createImageData(m + 1, n + 1);
    const fg = css("--info");
    const bg = css("--bg");
    const parse = (hex) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
    const [r1, g1, b1] = parse(fg.length === 7 ? fg : "#6b5fd3");
    const [r0, g0, b0] = parse(bg.length === 7 ? bg : "#f5f6f8");
    for (let i = 0; i <= n; i++)
      for (let j = 0; j <= m; j++) {
        const t = L[i * W + j] / best;
        const k = (i * (m + 1) + j) * 4;
        img.data[k] = r0 + (r1 - r0) * t;
        img.data[k + 1] = g0 + (g1 - g0) * t;
        img.data[k + 2] = b0 + (b1 - b0) * t;
        img.data[k + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
    ctx.fillStyle = css("--accent");
    for (const [i, j] of path) ctx.fillRect(j - 1, i - 1, 3, 3);
  }
  root.append(stats([["Length of s1 × s2", `${n} × ${m}`], ["Cells filled", (n * m).toLocaleString("en-US")], ["LCS length", String(best)]]), h("div", { class: "vis-frame" }, canvas));
  onTheme(draw);
  draw();
});
