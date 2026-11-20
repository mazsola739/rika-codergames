CG.visual("2021-2", (root, shelves, { h, s, player, stats, segmented, fmt }) => {
  let shelf = shelves[0];
  let rule = "dp";

  function order(prices, kind) {
    const n = prices.length;
    const picks = [];
    if (kind === "greedy") {
      for (let i = 0, j = n - 1; i <= j; ) picks.push(prices[i] <= prices[j] ? i++ : j--);
      return picks;
    }
    const best = new Float64Array(n * n);
    const left = new Uint8Array(n * n);
    for (let len = 1; len <= n; len++)
      for (let i = 0; i + len - 1 < n; i++) {
        const j = i + len - 1;
        const year = n - len + 1;
        if (len === 1) ((best[i * n + j] = year * prices[i]), (left[i * n + j] = 1));
        else {
          const a = year * prices[i] + best[(i + 1) * n + j];
          const b = year * prices[j] + best[i * n + j - 1];
          left[i * n + j] = a >= b ? 1 : 0;
          best[i * n + j] = Math.max(a, b);
        }
      }
    for (let i = 0, j = n - 1; i <= j; ) picks.push(left[i * n + j] ? i++ : j--);
    return picks;
  }

  const stage = h("div", { class: "vis-frame" });
  const tiles = stats([["Year", ""], ["Earned so far", ""], ["Optimal total", ""], ["Greedy total", ""]]);
  let picks = [];
  const total = (prices, ps) => ps.reduce((sum, idx, y) => sum + (y + 1) * prices[idx], 0);

  function render(step) {
    const n = shelf.prices.length;
    const soldYear = new Map(picks.slice(0, step).map((idx, y) => [idx, y + 1]));
    const bw = Math.min(56, 620 / n);
    const W = bw * n + 20;
    const max = Math.max(...shelf.prices);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} 150`, role: "img", "aria-label": "The shelf of bottles" });
    shelf.prices.forEach((p, i) => {
      const x = 10 + i * bw;
      const hgt = 20 + (p / max) * 80;
      const sold = soldYear.get(i);
      const next = picks[step] === i;
      svg.append(s("rect", { x: x + bw * 0.18, y: 112 - hgt, width: bw * 0.64, height: hgt, rx: bw * 0.18, class: sold ? "f-cell" : next ? "f-accent" : "f-info", opacity: sold ? 1 : 0.85 }));
      if (bw > 18) svg.append(s("text", { x: x + bw / 2, y: 128, "text-anchor": "middle", class: "t-label", text: String(p) }));
      if (sold && bw > 18) svg.append(s("text", { x: x + bw / 2, y: 145, "text-anchor": "middle", class: "t-label t-strong", text: `y${sold}` }));
    });
    stage.replaceChildren(svg);
    tiles.set(0, String(step));
    tiles.set(1, fmt(total(shelf.prices, picks.slice(0, step))));
  }
  const p = player({ count: 2, render, interval: 500, label: (i) => (i === 0 ? "Nothing sold yet. The pink bottle is sold next." : i >= picks.length ? "Shelf empty." : `Year ${i}: sold the bottle priced ${shelf.prices[picks[i - 1]]}.`) });
  function load() {
    picks = order(shelf.prices, rule);
    tiles.set(2, fmt(total(shelf.prices, order(shelf.prices, "dp"))));
    tiles.set(3, fmt(total(shelf.prices, order(shelf.prices, "greedy"))));
    p.reset(picks.length + 1);
    p.set(picks.length);
  }
  const shelfPick = segmented(shelves.map((x, i) => ({ value: i, label: x.name })), (i) => ((shelf = shelves[i]), load()), 0, "Shelf");
  const rulePick = segmented(
    [
      { value: "dp", label: "Optimal order" },
      { value: "greedy", label: "Greedy: cheaper end first" },
    ],
    (v) => ((rule = v), load()),
    "dp",
    "Selling rule",
  );
  root.append(h("div", { class: "vis-row" }, shelfPick), h("div", { class: "vis-row" }, rulePick), tiles, stage, p.el);
  load();
});
