CG.visual("2025-women-5", (root, tests, { h, s, scale, stats }) => {
  const LIMITS = { CITY: { CLEAR: 50, RAIN: 40, FOG: 30 }, RURAL: { CLEAR: 100, RAIN: 80, FOG: 60 }, HIGHWAY: { CLEAR: Infinity, RAIN: 130, FOG: 100 } };
  const lanes = [];
  for (const road of ["CITY", "RURAL", "HIGHWAY"]) for (const w of ["CLEAR", "RAIN", "FOG"]) lanes.push([road, w]);
  const maxSpeed = Math.max(...tests.map((t) => Number(t[1])), 160);
  const W = 640;
  const LH = 34;
  const H = 24 + lanes.length * LH;
  const x = scale(0, maxSpeed, 130, W - 10);
  const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Speed of every test per road type and weather" });
  for (let v = 0; v <= maxSpeed; v += 20) {
    svg.append(s("line", { x1: x(v), x2: x(v), y1: 14, y2: H - 4, class: "s-line" }));
    svg.append(s("text", { x: x(v), y: 10, "text-anchor": "middle", class: "t-label", "font-size": 10, text: String(v) }));
  }
  let faulty = 0;
  lanes.forEach(([road, w], i) => {
    const y = 20 + i * LH;
    const limit = LIMITS[road][w];
    svg.append(s("text", { x: 0, y: y + LH / 2 + 4, class: "t-label", text: `${road.toLowerCase()} · ${w.toLowerCase()}` }));
    if (limit !== Infinity) svg.append(s("rect", { x: x(limit) - 1.5, y: y + 2, width: 3, height: LH - 4, rx: 1.5, class: "f-fg" }));
    else svg.append(s("text", { x: W - 10, y: y + LH / 2 + 4, "text-anchor": "end", class: "t-label", text: "no limit" }));
    const inLane = tests.filter((t) => t[2] === road && t[3] === w);
    inLane.forEach((t, j) => {
      const speed = Number(t[1]);
      const flagged = t[4] === "TRUE";
      const wrong = speed > limit !== flagged;
      if (wrong) faulty++;
      const cy = y + 6 + ((j * 7) % (LH - 12));
      svg.append(
        s("circle", { cx: x(speed), cy, r: wrong ? 5 : 3.5, class: wrong ? "s-accent" : "s-muted", fill: flagged ? (wrong ? "var(--accent)" : "var(--muted)") : "var(--surface)", "stroke-width": wrong ? 2 : 1.2 }, s("title", { text: `${t[0]}: ${speed} km/h, expects ${flagged ? "a violation" : "no violation"}${wrong ? " (faulty)" : ""}` })),
      );
    });
  });
  root.append(stats([["Tests", String(tests.length)], ["Faulty", String(faulty)]]), h("div", { class: "vis-frame" }, svg), h("p", { class: "vis-note", text: "Hover a dot for its test ID." }));
});
