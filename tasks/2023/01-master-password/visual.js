CG.visual("2023-1", (root, input, { h, s, stats }) => {
  const MATRIX = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.";
  const pairs = [...input.matchAll(/\{\s*(\d+)\s*,\s*(\d+)\s*\}/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const decoded = pairs.map(([r, c]) => MATRIX[r * 8 + c]).join("");
  const words = decoded.split(/[,.]/).filter(Boolean);
  const overlap = (a, b) => {
    for (let k = Math.min(a.length, b.length); k > 0; k--) if (a.toLowerCase().endsWith(b.slice(0, k).toLowerCase())) return k;
    return 0;
  };
  // the matrix, with how often each character is used
  const use = new Map();
  for (const [r, c] of pairs) use.set(r * 8 + c, (use.get(r * 8 + c) ?? 0) + 1);
  const most = Math.max(...use.values());
  const svg = s("svg", { class: "vis-svg", viewBox: "0 0 330 330", role: "img", "aria-label": CG.t("The 8 by 8 character matrix, shaded by how often each character is used", "A 8 × 8-as karaktermátrix, aszerint árnyalva, hogy melyik karakter milyen gyakran fordul elő"), style: { maxWidth: "330px" } });
  for (let i = 0; i < 64; i++) {
    const x = 6 + (i % 8) * 40;
    const y = 6 + Math.floor(i / 8) * 40;
    svg.append(s("rect", { x, y, width: 36, height: 36, rx: 6, class: "f-accent", opacity: 0.08 + 0.85 * ((use.get(i) ?? 0) / most) }));
    svg.append(s("text", { x: x + 18, y: y + 24, "text-anchor": "middle", "font-size": 15, "font-weight": 600, class: "f-fg t-mono", text: MATRIX[i] }));
  }
  const chain = h("div", { class: "vis-text" });
  let removed = 0;
  let longest = "";
  words.forEach((w, i) => {
    const k = i ? overlap(words[i - 1], w) : 0;
    if (k) {
      chain.append(h("s", { class: "dim", text: w.slice(0, k) }));
      removed += k;
      if (k > longest.length) longest = w.slice(0, k);
    }
    chain.append(h("span", { text: w.slice(k) }));
    if (i < words.length - 1) chain.append(h("span", { class: "dim", text: " · " }));
  });
  root.append(
    stats([[CG.t("Words", "Szavak"), String(words.length)], [CG.t("Characters removed", "Kihagyott karakterek"), String(removed)], [CG.t("Longest removed", "Leghosszabb kihagyott"), longest]]),
    h("div", { class: "vis-row", style: { alignItems: "flex-start" } }, h("div", { class: "vis-frame", style: { flex: "0 1 350px" } }, svg), h("div", { style: { flex: "1 1 280px", minWidth: 0 } }, chain)),
  );
});
