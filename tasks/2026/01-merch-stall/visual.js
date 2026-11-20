CG.visual("2026-1", (root, sets, { h, s, segmented, slider, stats, scale, fmt, button }) => {
  let set = sets[0];
  let L = 1;
  let P = 1;

  // The same reasoning as solution.ts: each fan type (direction, patience K) gives a ceiling.
  function fanTypes(L) {
    const { prices: p, shares } = set;
    const n = p.length;
    const minOf = (a, b) => {
      let m = Infinity;
      for (let i = a; i <= b; i++) m = Math.min(m, p[i]);
      return m;
    };
    const fans = [];
    for (let K = 1; K <= n; K++) {
      const weight = shares[K - 1] / 200;
      if (!weight) continue;
      const lr = K >= L + 1 ? Math.min(minOf(0, L - 1), minOf(L, K - 2) - 1) : null;
      const seenAt = n - L + 1;
      const rl = K >= seenAt ? Math.min(minOf(L, n - 1), minOf(L - (K - seenAt), L - 1) - 1) : null;
      fans.push({ dir: "→", K, weight, ceiling: lr });
      fans.push({ dir: "←", K, weight, ceiling: rl });
    }
    return fans;
  }
  const revenue = (fans, P) => P * fans.reduce((sum, f) => sum + (f.ceiling !== null && f.ceiling >= P ? f.weight : 0), 0);
  function bestFor(L) {
    const fans = fanTypes(L);
    let best = { P: 1, r: 0 };
    for (const c of [...new Set(fans.map((f) => f.ceiling).filter((c) => c !== null && c >= 1))].sort((a, b) => a - b)) {
      const r = revenue(fans, c);
      if (r > best.r + 1e-9) best = { P: c, r };
    }
    return best;
  }
  function overall() {
    let best = { L: 1, P: 1, r: -1 };
    for (let l = 1; l < set.prices.length; l++) {
      const b = bestFor(l);
      if (b.r > best.r + 1e-9) best = { L: l, ...b };
    }
    return best;
  }

  const row = h("div", { class: "vis-frame" });
  const chart = h("div", { class: "vis-frame" });
  const table = h("div", { class: "tablewrap" });
  const tiles = stats([[CG.t("Revenue now", "Mostani bevétel"), ""], [CG.t("Best price here", "Legjobb ár itt"), ""], [CG.t("Best overall", "Legjobb összesen"), ""], [CG.t("Official answer", "Hivatalos válasz"), ""]]);
  const maxP = () => Math.max(...set.prices);
  const posSlider = slider({ label: CG.t("Position L", "Hely (L)"), min: 1, max: set.prices.length - 1, value: 1, onInput: (v) => ((L = v), draw()) });
  const priceSlider = slider({ label: CG.t("Price P", "Ár (P)"), min: 1, max: maxP(), value: 1, onInput: (v) => ((P = v), draw()) });
  const jump = button(CG.t("Jump to the best", "Ugrás a legjobbra"), {
    onclick: () => {
      const b = overall();
      L = b.L;
      P = b.P;
      posSlider.set(L);
      priceSlider.set(P);
      draw();
    },
  });

  function drawRow() {
    const n = set.prices.length;
    const bars = [...set.prices.slice(0, L), P, ...set.prices.slice(L)];
    const W = 640;
    const Hh = 150;
    const top = Math.max(...bars);
    const bw = W / bars.length;
    const y = scale(0, top, Hh - 18, 18);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${Hh}`, role: "img", "aria-label": CG.t("Prices of the stalls in the row, with the new stall highlighted", "A sorban álló standok árai, kiemelve az új standot") });
    bars.forEach((v, i) => {
      const ours = i === L;
      svg.append(s("rect", { x: i * bw + bw * 0.12, y: y(v), width: bw * 0.76, height: Hh - 18 - y(v), rx: 2, class: ours ? "f-accent" : v < P ? "f-wall" : "f-line" }));
      if (bars.length <= 12) svg.append(s("text", { x: i * bw + bw / 2, y: y(v) - 4, "text-anchor": "middle", class: ours ? "t-label t-strong" : "t-label", text: String(v) }));
    });
    svg.append(s("text", { x: 0, y: Hh - 3, class: "t-label", text: CG.t("← fans walking right start here", "← a jobbra haladó szurkolók innen indulnak") }));
    svg.append(s("text", { x: W, y: Hh - 3, "text-anchor": "end", class: "t-label", text: CG.t("fans walking left start here →", "a balra haladó szurkolók innen indulnak →") }));
    row.replaceChildren(svg, h("div", { class: "vis-legend" }, h("span", {}, h("i", { style: { background: "var(--accent)" } }), CG.t("our stall", "a mi standunk")), h("span", {}, h("i", { style: { background: "var(--wall)" } }), CG.t("cheaper than us", "olcsóbb nálunk")), h("span", {}, h("i", { style: { background: "var(--line)" } }), CG.t("not cheaper", "nem olcsóbb"))));
  }

  function drawChart(fans) {
    const W = 640;
    const Hh = 210;
    const m = { l: 46, r: 12, t: 12, b: 28 };
    // Show prices up to a bit above the highest ceiling (beyond it nobody buys), or up to P.
    const ceilings = fans.map((f) => f.ceiling).filter((c) => c !== null && c >= 1);
    const top = Math.min(maxP(), Math.max(P + 1, Math.ceil((ceilings.length ? Math.max(...ceilings) : maxP()) * 1.3)));
    const values = Array.from({ length: top }, (_, i) => revenue(fans, i + 1));
    const peak = Math.max(1, ...values);
    const x = scale(1, top, m.l, W - m.r);
    const y = scale(0, peak, Hh - m.b, m.t);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${Hh}`, role: "img", "aria-label": CG.t("Expected revenue for every price at this position", "Várható bevétel minden árra ezen a helyen") });
    for (const t of [0, 0.5, 1]) {
      svg.append(s("line", { x1: m.l, x2: W - m.r, y1: y(peak * t), y2: y(peak * t), class: "s-line" }));
      svg.append(s("text", { x: m.l - 6, y: y(peak * t) + 4, "text-anchor": "end", class: "t-label", text: fmt(peak * t, peak * t < 10 && t ? 1 : 0) }));
    }
    svg.append(s("text", { x: W - m.r, y: Hh - 6, "text-anchor": "end", class: "t-label", text: CG.t(`price → ${top}`, `ár → ${top}`) }));
    svg.append(s("text", { x: m.l, y: Hh - 6, class: "t-label", text: "1" }));
    const d = values.map((v, i) => `${i ? "L" : "M"}${x(i + 1).toFixed(1)},${y(v).toFixed(1)}`).join("");
    svg.append(s("path", { d, fill: "none", class: "s-info", "stroke-width": 1.6 }));
    for (const c of new Set(fans.map((f) => f.ceiling).filter((c) => c !== null && c >= 1 && c <= top)))
      svg.append(s("circle", { cx: x(c), cy: y(revenue(fans, c)), r: 3.2, class: "f-info" }));
    svg.append(s("line", { x1: x(P), x2: x(P), y1: m.t, y2: Hh - m.b, class: "s-accent", "stroke-width": 1.5, "stroke-dasharray": "4 3" }));
    svg.append(s("circle", { cx: x(P), cy: y(revenue(fans, P)), r: 5, class: "f-accent" }));
    chart.replaceChildren(svg, h("div", { class: "vis-legend" }, h("span", {}, h("i", { style: { background: "var(--info)" } }), CG.t("revenue at each price (dots: ceilings)", "bevétel áranként (pontok: plafonok)")), h("span", {}, h("i", { style: { background: "var(--accent)" } }), CG.t("your price", "a te árad"))));
  }

  function drawTable(fans) {
    const rows = fans.map((f) =>
      h(
        "tr",
        {},
        h("td", { text: f.dir === "→" ? CG.t("left → right", "balról jobbra") : CG.t("right → left", "jobbról balra") }),
        h("td", { class: "num", text: String(f.K) }),
        h("td", { class: "num", text: fmt(f.weight * 100, 1) + "%" }),
        h("td", { class: "num", text: f.ceiling === null ? CG.t("never reaches us", "sosem ér el hozzánk") : f.ceiling < 1 ? CG.t("never buys", "sosem vásárol") : CG.t(`up to ${f.ceiling}`, `legfeljebb ${f.ceiling}`) }),
        h("td", { text: f.ceiling !== null && f.ceiling >= P ? CG.t("buys ✓", "vásárol ✓") : "–" }),
      ),
    );
    const buying = fans.filter((f) => f.ceiling !== null && f.ceiling >= P).length;
    const wasOpen = table.querySelector("details")?.open;
    table.replaceChildren(
      h(
        "details",
        { class: "more", open: wasOpen },
        h("summary", {}, CG.t(`Who buys from us at ${P}: ${buying} of ${fans.length} kinds of fans`, `Kik vásárolnak tőlünk, ha az ár ${P}: ${fans.length} szurkolótípusból ${buying}`)),
        h("div", { class: "tablewrap more-body" }, h("table", { class: "vis-table" }, h("thead", {}, h("tr", {}, ...CG.t(["Fans walking", "Patience K", "Share", "Buys from us at", `At ${P}`], ["Haladási irány", "Türelem (K)", "Arány", "Tőlünk vásárol, ha az ár", `Ha az ár ${P}`]).map((t) => h("th", { text: t })))), h("tbody", {}, rows))),
      ),
    );
  }

  function draw() {
    const fans = fanTypes(L);
    const here = bestFor(L);
    const all = overall();
    tiles.set(0, fmt(revenue(fans, P), 2));
    tiles.set(1, `${here.P} → ${fmt(here.r, 2)}`);
    tiles.set(2, `L ${all.L}, P ${all.P} → ${fmt(all.r, 2)}`);
    tiles.set(3, set.official);
    drawRow();
    drawChart(fans);
    drawTable(fans);
  }

  const picker = segmented(
    sets.map((x, i) => ({ value: i, label: CG.t(x.name, x.name === "Real input" ? "Valódi bemenet" : "A feladat példája") })),
    (i) => {
      set = sets[i];
      L = 1;
      P = 1;
      posSlider.setMax(set.prices.length - 1);
      priceSlider.setMax(maxP());
      jump.click();
    },
    0,
    CG.t("Data", "Adatok"),
  );
  root.append(h("div", { class: "vis-row" }, picker, jump), tiles, h("div", { class: "vis-row" }, posSlider, priceSlider), row, chart, table);
  jump.click();
});
