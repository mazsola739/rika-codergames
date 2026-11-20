CG.visual("2025-women-3", (root, lines, { h, s, stats }) => {
  const EN = [8.17, 1.49, 2.78, 4.25, 12.7, 2.23, 2.02, 6.09, 6.97, 0.15, 0.77, 4.03, 2.41, 6.75, 7.51, 1.93, 0.1, 5.99, 6.33, 9.06, 2.76, 0.98, 2.36, 0.15, 1.97, 0.07].map((p) => Math.log(p / 100));
  const PENALTY = 25;
  const shift = (t, k) => t.replace(/[a-zA-Z]/g, (ch) => { const b = ch <= "Z" ? 65 : 97; return String.fromCharCode(b + ((ch.charCodeAt(0) - b - k + 26) % 26)); });
  const scores = lines.map((l) => {
    const letters = l.toLowerCase().replace(/[^a-z]/g, "");
    return Array.from({ length: 26 }, (_, k) => [...letters].reduce((sum, ch) => sum + EN[(ch.charCodeAt(0) - 97 - k + 26) % 26], 0));
  });
  // Viterbi, as in solution.ts
  const best = [scores[0]];
  const from = [scores[0].map(() => -1)];
  for (let i = 1; i < lines.length; i++) {
    const prev = best[i - 1];
    const top = prev.indexOf(Math.max(...prev));
    best.push(scores[i].map((sc, k) => sc + Math.max(prev[k], prev[top] - PENALTY)));
    from.push(scores[i].map((_, k) => (prev[k] >= prev[top] - PENALTY ? k : top)));
  }
  const chosen = [];
  for (let i = lines.length - 1, k = best.at(-1).indexOf(Math.max(...best.at(-1))); i >= 0; k = from[i--][k]) chosen.unshift(k);
  const own = scores.map((row) => row.indexOf(Math.max(...row)));
  const cell = 22;
  const W = 40 + 26 * cell;
  const H = 20 + lines.length * cell;
  const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Scores of every shift for every line" });
  for (let k = 0; k < 26; k++) svg.append(s("text", { x: 40 + k * cell + cell / 2, y: 13, "text-anchor": "middle", class: "t-label", "font-size": 10, text: String(k) }));
  scores.forEach((row, i) => {
    const lo = Math.min(...row);
    const hi = Math.max(...row);
    svg.append(s("text", { x: 32, y: 20 + i * cell + cell * 0.68, "text-anchor": "end", class: "t-label", "font-size": 10, text: String(i + 1) }));
    row.forEach((sc, k) => svg.append(s("rect", { x: 40 + k * cell + 1, y: 20 + i * cell + 1, width: cell - 2, height: cell - 2, rx: 3, class: "f-info", opacity: 0.05 + 0.85 * ((sc - lo) / (hi - lo || 1)) ** 3 })));
    svg.append(s("circle", { cx: 40 + own[i] * cell + cell / 2, cy: 20 + i * cell + cell / 2, r: cell * 0.36, fill: "none", class: own[i] === chosen[i] ? "s-fg" : "s-bad", "stroke-width": 2 }));
  });
  svg.append(s("polyline", { points: chosen.map((k, i) => `${40 + k * cell + cell / 2},${20 + i * cell + cell / 2}`).join(" "), fill: "none", class: "s-accent", "stroke-width": 3, "stroke-linejoin": "round", opacity: 0.85 }));
  const keys = chosen.filter((k, i) => k !== chosen[i - 1]);
  const poem = h("div", { class: "vis-text" }, lines.map((l, i) => h("div", {}, h("span", { class: "dim", text: `${String(i + 1).padStart(2)}  ` }), own[i] !== chosen[i] ? h("mark", { text: shift(l, chosen[i]) }) : shift(l, chosen[i]))));
  root.append(
    stats([["Lines", String(lines.length)], ["Keys", keys.join(", ")], ["Lines saved by the penalty", String(own.filter((k, i) => k !== chosen[i]).length)]]),
    h("div", { class: "vis-frame" }, svg),
    poem,
  );
});
