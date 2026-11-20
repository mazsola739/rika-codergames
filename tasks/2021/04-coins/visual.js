CG.visual("2021-4", (root, sets, { h, s, slider, segmented, scale }) => {
  const LIMIT = 200;
  let coins = sets[3] ?? sets[0];
  let amount = 30;
  function solve(cs) {
    const fewest = new Int32Array(LIMIT + 1).fill(1e9);
    const last = new Int32Array(LIMIT + 1).fill(-1);
    fewest[0] = 0;
    for (let x = 1; x <= LIMIT; x++) for (const c of cs) if (c <= x && fewest[x - c] + 1 < fewest[x]) ((fewest[x] = fewest[x - c] + 1), (last[x] = c));
    const optimal = (x) => {
      if (fewest[x] >= 1e9) return null;
      const out = [];
      for (let y = x; y > 0; y -= last[y]) out.push(last[y]);
      return out;
    };
    const greedy = (x) => {
      const out = [];
      for (const c of [...cs].sort((a, b) => b - a)) while (x >= c) ((x -= c), out.push(c));
      return x === 0 ? out : null;
    };
    return { optimal, greedy };
  }
  let sol = solve(coins);
  const rows = h("div", { class: "visual-body" });
  const chart = h("div", { class: "vis-frame" });
  const coinRow = (label, list) => {
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 640 ${list ? 54 : 30}`, role: "img", "aria-label": label });
    if (!list) svg.append(s("text", { x: 0, y: 20, class: "t-label", text: "cannot pay this amount exactly" }));
    else
      list.slice(0, 22).forEach((c, i) => {
        svg.append(s("circle", { cx: 24 + i * 28, cy: 26, r: 12 + Math.min(8, Math.log2(c)), class: "f-warn", opacity: 0.85 }));
        svg.append(s("text", { x: 24 + i * 28, y: 30, "text-anchor": "middle", "font-size": 10, "font-weight": 700, class: "f-surface", text: String(c) }));
      });
    if (list && list.length > 22) svg.append(s("text", { x: 636, y: 30, "text-anchor": "end", class: "t-label", text: `+${list.length - 22}` }));
    return h("div", {}, h("p", { class: "vis-note", text: `${label}: ${list ? `${list.length} coins` : "impossible"}` }), svg);
  };
  function draw() {
    rows.replaceChildren(coinRow("Greedy", sol.greedy(amount)), coinRow("Optimal (DP)", sol.optimal(amount)));
    const W = 640;
    const H = 110;
    const x = scale(0, LIMIT, 30, W - 8);
    const diffs = [];
    let worst = 1;
    for (let a = 1; a <= LIMIT; a++) {
      const g = sol.greedy(a);
      const o = sol.optimal(a);
      const d = o ? (g ? g.length - o.length : 9) : 0;
      diffs.push(d);
      worst = Math.max(worst, d);
    }
    const y = scale(0, worst, H - 20, 10);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Extra coins greedy needs, per amount" });
    diffs.forEach((d, i) => d && svg.append(s("rect", { x: x(i + 1) - 1, y: y(d), width: 2.2, height: H - 20 - y(d), class: "f-bad" })));
    svg.append(s("line", { x1: 30, x2: W - 8, y1: H - 20, y2: H - 20, class: "s-line" }));
    svg.append(s("line", { x1: x(amount), x2: x(amount), y1: 6, y2: H - 20, class: "s-accent", "stroke-dasharray": "3 2" }));
    svg.append(s("text", { x: 26, y: y(worst) + 4, "text-anchor": "end", class: "t-label", text: `+${worst}` }));
    svg.append(s("text", { x: W - 8, y: H - 4, "text-anchor": "end", class: "t-label", text: `amount → ${LIMIT}` }));
    const bad = diffs.filter((d) => d).length;
    chart.replaceChildren(svg, h("p", { class: "vis-note", text: bad ? `Greedy is worse (or stuck) for ${bad} of the amounts 1–${LIMIT}.` : `For these coins greedy is always optimal up to ${LIMIT}.` }));
  }
  const amountSlider = slider({ label: "Amount", min: 1, max: LIMIT, value: amount, onInput: (v) => ((amount = v), draw()) });
  const pick = segmented(sets.map((cs, i) => ({ value: i, label: cs.join(", ") })), (i) => ((coins = sets[i]), (sol = solve(coins)), draw()), sets.indexOf(coins), "Coins");
  root.append(h("div", { class: "vis-row" }, pick), amountSlider, rows, chart);
  draw();
});
