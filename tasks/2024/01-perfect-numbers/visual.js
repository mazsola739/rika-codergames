CG.visual("2024-1", (root, _, { h, s, segmented, fmt }) => {
  const isPrime = (n) => {
    if (n < 2) return false;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
    return true;
  };
  const divisors = (n) => {
    const out = [1];
    for (let d = 2; d * d <= n; d++) if (n % d === 0) out.push(d, ...(d * d === n ? [] : [n / d]));
    return out.sort((a, b) => a - b);
  };
  const rows = [];
  for (let p = 2; p <= 13; p++) {
    const m = 2 ** p - 1;
    rows.push({ p, m, prime: isPrime(m), n: 2 ** (p - 1) * m });
  }
  const perfect = rows.filter((r) => r.prime).map((r) => r.n);
  const bar = h("div", { class: "vis-frame" });
  function draw(n) {
    const ds = divisors(n);
    const W = 640;
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} 96`, role: "img", "aria-label": `Divisors of ${n} laid end to end` });
    svg.append(s("rect", { x: 10, y: 14, width: W - 20, height: 26, rx: 5, class: "f-cell" }));
    svg.append(s("text", { x: W - 10, y: 10, "text-anchor": "end", class: "t-label", text: fmt(n) }));
    let x = 10;
    ds.forEach((d, i) => {
      const w = ((W - 20) * d) / n;
      svg.append(s("rect", { x, y: 50, width: Math.max(0.5, w - 1), height: 26, rx: 3, class: "f-island", style: `--h:${(i * 47) % 360}` }));
      if (w > 34) svg.append(s("text", { x: x + w / 2, y: 67, "text-anchor": "middle", "font-size": 11, class: "f-fg", "font-weight": 600, text: fmt(d) }));
      x += w;
    });
    svg.append(s("text", { x: 10, y: 92, class: "t-label", text: `${ds.length} divisors: ${ds.length > 14 ? ds.slice(0, 12).map(fmt).join(" + ") + " + …" : ds.map(fmt).join(" + ")} = ${fmt(ds.reduce((a, b) => a + b, 0))}` }));
    bar.replaceChildren(svg);
  }
  const table = h(
    "div",
    { class: "tablewrap" },
    h(
      "table",
      { class: "vis-table" },
      h("thead", {}, h("tr", {}, ...["p", "2^p − 1", "prime?", "2^(p−1) · (2^p − 1)"].map((t) => h("th", { text: t })))),
      h("tbody", {}, rows.map((r) => h("tr", { style: { color: r.prime ? "var(--fg)" : "var(--muted)" } }, h("td", { text: String(r.p) }), h("td", { text: fmt(r.m) }), h("td", { text: r.prime ? "yes" : "no" }), h("td", { text: r.prime ? `${fmt(r.n)} ✓ perfect` : fmt(r.n) })))),
    ),
  );
  root.append(h("div", { class: "vis-row" }, segmented(perfect.map((n) => ({ value: n, label: fmt(n) })), draw, 28, "Perfect number")), bar, table);
  draw(28);
});
