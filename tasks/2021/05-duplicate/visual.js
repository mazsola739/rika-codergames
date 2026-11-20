CG.visual("2021-5", (root, lines, { h, s, segmented }) => {
  const box = h("div", { class: "visual-body" });
  function draw(k) {
    const { n, values } = lines[k];
    const sum = values.reduce((a, b) => a + b, 0);
    const expected = ((n - 2) * (n - 1)) / 2;
    const dup = sum - expected;
    // The array as a row of boxes (wrapping), with both copies of the duplicate highlighted.
    const per = Math.min(values.length, 17);
    const rows = Math.ceil(values.length / per);
    const size = 36;
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${per * size + 8} ${rows * size + 8}`, role: "img", "aria-label": CG.t(`Array of ${n} numbers`, `${n} számból álló tömb`), style: { maxWidth: `${per * 44}px` } });
    values.forEach((v, i) => {
      const x = 4 + (i % per) * size;
      const y = 4 + Math.floor(i / per) * size;
      const hit = v === dup;
      svg.append(s("rect", { x: x + 2, y: y + 2, width: size - 4, height: size - 4, rx: 6, class: hit ? "f-accent" : "f-cell" }));
      svg.append(s("text", { x: x + size / 2, y: y + size / 2 + 5, "text-anchor": "middle", "font-size": 14, "font-weight": hit ? 700 : 500, class: hit ? "f-surface" : "f-fg", text: String(v) }));
    });
    box.replaceChildren(
      h("div", { class: "vis-frame" }, svg),
      h("p", { class: "vis-mono", text: CG.t(`sum = ${sum}    0 + 1 + … + ${n - 2} = ${expected}    duplicate = ${sum} − ${expected} = ${dup}`, `összeg = ${sum}    0 + 1 + … + ${n - 2} = ${expected}    duplikált = ${sum} − ${expected} = ${dup}`) }),
    );
  }
  root.append(h("div", { class: "vis-row" }, segmented(lines.map((l, i) => ({ value: i, label: `N = ${l.n}` })), draw, 0, CG.t("Line", "Sor"))), box);
  draw(0);
});
