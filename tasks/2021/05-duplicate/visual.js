CG.visual("2021-5", (root, lines, { h, segmented }) => {
  const box = h("div", { class: "visual-body" });
  function draw(k) {
    const { n, values } = lines[k];
    const sum = values.reduce((a, b) => a + b, 0);
    const expected = ((n - 2) * (n - 1)) / 2;
    const dup = sum - expected;
    const chips = h(
      "div",
      { class: "vis-text", style: { whiteSpace: "normal", display: "flex", flexWrap: "wrap", gap: "4px" } },
      values.map((v) => (v === dup ? h("mark", { text: String(v), style: { padding: "0 6px" } }) : h("span", { text: String(v), style: { padding: "0 6px", border: "1px solid var(--line)", borderRadius: "4px" } }))),
    );
    box.replaceChildren(chips, h("p", { class: "vis-mono", text: `sum = ${sum}    0 + 1 + … + ${n - 2} = ${expected}    duplicate = ${sum} − ${expected} = ${dup}` }));
  }
  root.append(h("div", { class: "vis-row" }, segmented(lines.map((l, i) => ({ value: i, label: `N = ${l.n}` })), draw, 0, "Line")), box);
  draw(0);
});
