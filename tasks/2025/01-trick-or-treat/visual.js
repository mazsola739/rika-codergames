CG.visual("2025-1", (root, cases, { h, s, player, segmented }) => {
  const stage = h("div", { class: "vis-frame" });
  const memo = h("p", { class: "vis-mono" });
  let p;
  function load(k) {
    const { weights, target } = cases[k];
    const trace = [];
    const seen = new Map();
    let found = null;
    for (let j = 0; j < weights.length && !found; j++) {
      const need = target - weights[j];
      const i = seen.get(need);
      if (i !== undefined) found = [i, j];
      trace.push({ j, need, hit: i, seen: new Map(seen) });
      if (!seen.has(weights[j])) seen.set(weights[j], j);
    }
    const render = (step) => {
      if (!weights.length) {
        stage.replaceChildren(h("p", { class: "vis-note", text: "Empty bucket: nothing to pick, the answer is null." }));
        memo.textContent = "";
        return;
      }
      const t = trace[step];
      const size = Math.min(44, 620 / weights.length);
      const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${weights.length * size + 4} ${size + 26}`, role: "img", "aria-label": "Chocolates in the bucket" });
      weights.forEach((w, i) => {
        const cls = i === t.j ? "f-accent" : i === t.hit ? "f-good" : i < t.j ? "f-info" : "f-cell";
        svg.append(s("rect", { x: 2 + i * size, y: 2, width: size - 4, height: size - 4, rx: 6, class: cls, opacity: i < t.j && i !== t.hit ? 0.45 : 1 }));
        svg.append(s("text", { x: 2 + i * size + (size - 4) / 2, y: 2 + size * 0.58, "text-anchor": "middle", "font-size": size * 0.34, "font-weight": 600, class: cls === "f-cell" ? "f-fg" : "f-surface", text: String(w) }));
        svg.append(s("text", { x: 2 + i * size + (size - 4) / 2, y: size + 18, "text-anchor": "middle", class: "t-label", "font-size": 10, text: String(i) }));
      });
      stage.replaceChildren(svg);
      memo.textContent = `seen: {${[...t.seen].map(([w, i]) => `${w}→${i}`).join(", ")}}   need ${target} − ${weights[t.j]} = ${t.need}   ${t.hit !== undefined ? `found at index ${t.hit} → [${t.hit}, ${t.j}]` : "not seen yet"}`;
    };
    if (p) p.el.remove();
    p = player({ count: Math.max(1, trace.length), render, interval: 700, label: (i) => (!trace.length ? "" : trace[i].hit !== undefined ? `Answer: [${trace[i].hit}, ${trace[i].j}]` : i === trace.length - 1 ? "No pair adds up: null" : `Chocolate ${i}`) });
    root.append(p.el);
    p.set(Math.max(0, trace.length - 1));
  }
  root.append(h("div", { class: "vis-row" }, segmented(cases.map((c, i) => ({ value: i, label: `#${i + 1} · target ${c.target}` })), load, 0, "Case")), stage, memo);
  load(0);
});
