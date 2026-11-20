CG.visual("2025-women-1", (root, pairs, { h, s, slider, stats }) => {
  const stage = h("div", { class: "vis-frame" });
  const words = h("p", { class: "vis-mono", style: { overflowWrap: "anywhere" } });
  const tiles = stats([["Lengths", ""], ["Letters that differ", ""], ["Answer", ""]]);
  function draw(k) {
    const [a, b = ""] = pairs[k - 1];
    const diff = Array(26).fill(0);
    for (const ch of a) diff[ch.charCodeAt(0) - 97]++;
    for (const ch of b) diff[ch.charCodeAt(0) - 97]--;
    const max = Math.max(1, ...diff.map(Math.abs));
    const W = 640;
    const H = 150;
    const bw = (W - 20) / 26;
    const mid = H / 2 - 6;
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Letter count differences" });
    svg.append(s("line", { x1: 10, x2: W - 10, y1: mid, y2: mid, class: "s-line" }));
    diff.forEach((d, i) => {
      const hgt = (Math.abs(d) / max) * (mid - 10);
      if (d) svg.append(s("rect", { x: 10 + i * bw + 2, y: d > 0 ? mid - hgt : mid, width: bw - 4, height: hgt, rx: 2, class: "f-bad" }));
      svg.append(s("text", { x: 10 + i * bw + bw / 2, y: H - 4, "text-anchor": "middle", class: d ? "t-label t-strong" : "t-label", text: String.fromCharCode(97 + i) }));
    });
    stage.replaceChildren(svg);
    words.textContent = `${a}  ·  ${b}`;
    const bad = diff.filter((d) => d).length;
    tiles.set(0, `${a.length} / ${b.length}`);
    tiles.set(1, String(bad));
    tiles.set(2, a.length === b.length && !bad ? "YES" : "NO");
  }
  root.append(slider({ label: "Pair", min: 1, max: pairs.length, value: 2, onInput: draw, format: (v) => `#${v}` }), words, tiles, stage);
  draw(2);
});
