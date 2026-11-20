CG.visual("2022-1", (root, arrays, { h, s, slider, stats, scale }) => {
  const stage = h("div", { class: "vis-frame" });
  const tiles = stats([[CG.t("Length n", "Hossz (n)"), ""], [CG.t("Most frequent", "Leggyakoribb"), ""], [CG.t("Deletions", "Törlések"), ""]]);
  function draw(k) {
    const arr = arrays[k - 1];
    const counts = new Map();
    for (const v of arr) counts.set(v, (counts.get(v) ?? 0) + 1);
    const values = [...counts.keys()].sort((a, b) => a - b);
    const top = Math.max(...counts.values());
    const keep = values.find((v) => counts.get(v) === top);
    const W = 640;
    const H = 170;
    const bw = Math.min(40, (W - 40) / values.length);
    const y = scale(0, top, H - 22, 12);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": CG.t("Histogram of the values", "Az értékek hisztogramja") });
    values.forEach((v, i) => {
      const x = 20 + i * bw;
      svg.append(s("rect", { x: x + bw * 0.1, y: y(counts.get(v)), width: bw * 0.8, height: H - 22 - y(counts.get(v)), rx: 2, class: v === keep ? "f-good" : "f-bad", opacity: v === keep ? 1 : 0.55 }));
      if (bw >= 14) svg.append(s("text", { x: x + bw / 2, y: H - 8, "text-anchor": "middle", class: "t-label", "font-size": 9, text: String(v) }));
    });
    stage.replaceChildren(svg);
    tiles.set(0, String(arr.length));
    tiles.set(1, `${keep} (${top}×)`);
    tiles.set(2, `${arr.length} − ${top} = ${arr.length - top}`);
  }
  root.append(slider({ label: CG.t("Array", "Tömb"), min: 1, max: arrays.length, value: arrays.length, onInput: draw, format: (v) => `#${v}` }), tiles, stage);
  draw(arrays.length);
});
