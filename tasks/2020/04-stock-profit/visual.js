CG.visual("2020-4", (root, _, { h, s, player, stats, scale, rng, segmented, fmt }) => {
  const series = {
    example: [30, 8, 20, 7, 18, 3],
    walk: (() => {
      // A random walk that rises early (global maximum near the start) and sinks late (minimum near the end).
      const r = rng(4);
      let v = 60;
      return Array.from({ length: 70 }, (_, i) => {
        v += (r() - 0.5) * 9 + (i < 12 ? 2.4 : i > 50 ? -1.6 : 0);
        return Math.max(4, Math.round(v));
      });
    })(),
  };
  let data = series.walk;
  const chart = h("div", { class: "vis-frame" });
  const tiles = stats([["Cheapest so far", ""], ["Best trade so far", ""], ["Profit", ""]]);

  function steps() {
    let low = 0;
    let best = null;
    return data.map((v, i) => {
      if (v < data[low]) low = i;
      else if (!best || v - data[low] > data[best[1]] - data[best[0]]) best = [low, i];
      return { low, best: best && [...best] };
    });
  }
  let trace = steps();

  function render(i) {
    const W = 640;
    const H = 230;
    const m = { l: 34, r: 10, t: 14, b: 22 };
    const max = Math.max(...data);
    const x = scale(0, data.length - 1, m.l, W - m.r);
    const y = scale(0, max, H - m.b, m.t);
    const st = trace[i];
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Price chart with the scan position" });
    svg.append(s("line", { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, class: "s-line" }));
    const gmax = data.indexOf(max);
    const gmin = data.indexOf(Math.min(...data));
    for (const g of [gmax, gmin]) svg.append(s("circle", { cx: x(g), cy: y(data[g]), r: 7, fill: "none", class: "s-muted", "stroke-width": 1.5, "stroke-dasharray": "3 2" }));
    svg.append(s("rect", { x: x(i) - 0.5, y: m.t, width: x(data.length - 1) - x(i) + 1, height: H - m.b - m.t, class: "f-cell", opacity: 0.6 }));
    svg.append(s("path", { d: data.map((v, k) => `${k ? "L" : "M"}${x(k)},${y(v)}`).join(""), fill: "none", class: "s-info", "stroke-width": 2 }));
    if (st.best) {
      const [a, b] = st.best;
      svg.append(s("line", { x1: x(a), x2: x(b), y1: y(data[a]), y2: y(data[b]), class: "s-good", "stroke-width": 4, "stroke-linecap": "round", opacity: 0.85 }));
    }
    svg.append(s("circle", { cx: x(st.low), cy: y(data[st.low]), r: 6, class: "f-accent" }));
    svg.append(s("line", { x1: x(i), x2: x(i), y1: m.t, y2: H - m.b, class: "s-fg", "stroke-width": 1.2 }));
    svg.append(s("text", { x: m.l - 6, y: y(max) + 4, "text-anchor": "end", class: "t-label", text: String(max) }));
    chart.replaceChildren(svg);
    tiles.set(0, `${data[st.low]} (day ${st.low + 1})`);
    tiles.set(1, st.best ? `buy ${data[st.best[0]]}, sell ${data[st.best[1]]}` : "none yet");
    tiles.set(2, st.best ? fmt(data[st.best[1]] - data[st.best[0]]) : "0");
  }
  const p = player({ count: data.length, render, interval: 140, label: (i) => `Price ${i + 1} of ${data.length}: ${data[i]}` });
  const pick = segmented(
    [
      { value: "walk", label: "Random walk" },
      { value: "example", label: "Example from the task" },
    ],
    (v) => {
      data = series[v];
      trace = steps();
      p.reset(data.length);
      p.set(data.length - 1);
    },
    "walk",
    "Prices",
  );
  root.append(h("div", { class: "vis-row" }, pick), tiles, chart, p.el);
  p.set(data.length - 1);
});
