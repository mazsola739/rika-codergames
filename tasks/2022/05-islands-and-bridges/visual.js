CG.visual("2022-5", (root, cases, { h, s, segmented, stats, hue }) => {
  let current = 0;
  let mode = "correct";
  const tiles = stats([["Islands", ""], ["Bridge material", ""], ["Bridges", ""]]);
  const svgWrap = h("div", { class: "vis-frame" });
  const note = h("p", { class: "vis-note" });

  function draw() {
    const c = cases[current];
    const H = c.rows.length;
    const W = c.rows[0].length;
    const labels = mode === "correct" ? c.correct : c.official;
    // Islands the official program merged: one of its labels covers several real islands.
    const realOf = new Map();
    c.correct.forEach((real, i) => {
      if (real < 0) return;
      const off = c.official[i];
      if (!realOf.has(off)) realOf.set(off, new Set());
      realOf.get(off).add(real);
    });
    const merged = new Set([...realOf].filter(([, set]) => set.size > 1).map(([off]) => off));
    const pad = 1;
    const svg = s("svg", { class: "vis-svg", viewBox: `${-pad} ${-pad} ${W + 2 * pad} ${H + 2 * pad}`, role: "img", "aria-label": `${c.name}: ${H} by ${W} map` });
    svg.append(s("rect", { x: 0, y: 0, width: W, height: H, class: "f-water", rx: 0.3 }));
    for (let r = 0; r < H; r++)
      for (let col = 0; col < W; col++) {
        const lab = labels[r * W + col];
        if (lab < 0) continue;
        const rect = s("rect", { x: col + 0.04, y: r + 0.04, width: 0.92, height: 0.92, rx: 0.12, class: "f-island", style: `--h:${hue(lab + 1)}` });
        if (mode === "official" && merged.has(lab)) rect.setAttribute("class", "f-island s-accent"), rect.setAttribute("stroke-width", "0.12");
        svg.append(rect);
      }
    if (mode === "correct") {
      // A bridge covers its water cells from edge to edge (so a one-cell bridge is a short bar).
      for (const [r1, c1, r2, c2, vertical] of c.bridges) {
        const ends = vertical ? { x1: c1 + 0.5, y1: r1 + 0.08, x2: c2 + 0.5, y2: r2 + 0.92 } : { x1: c1 + 0.08, y1: r1 + 0.5, x2: c2 + 0.92, y2: r2 + 0.5 };
        svg.append(s("line", { ...ends, class: "s-accent", "stroke-width": 0.42, "stroke-linecap": "round" }));
      }
    } else {
      // Where the flood fill leaks: land on the top row with land on the bottom row of the same
      // column, and land in the left column with land in the right column of the same row.
      for (let col = 0; col < W; col++)
        if (c.rows[0][col] === "1" && c.rows[H - 1][col] === "1") {
          svg.append(s("path", { d: `M${col + 0.5} -0.15 l-0.35 -0.55 h0.7 z`, class: "f-accent" }));
          svg.append(s("path", { d: `M${col + 0.5} ${H + 0.15} l-0.35 0.55 h0.7 z`, class: "f-accent" }));
        }
      for (let r = 0; r < H; r++)
        if (c.rows[r][0] === "1" && c.rows[r][W - 1] === "1") {
          svg.append(s("path", { d: `M-0.15 ${r + 0.5} l-0.55 -0.35 v0.7 z`, class: "f-accent" }));
          svg.append(s("path", { d: `M${W + 0.15} ${r + 0.5} l0.55 -0.35 v0.7 z`, class: "f-accent" }));
        }
    }
    svgWrap.replaceChildren(svg);
    const n = mode === "correct" ? c.islands : c.officialIslands;
    tiles.set(0, String(n));
    tiles.set(1, String(mode === "correct" ? c.material : c.officialMaterial));
    tiles.set(2, mode === "correct" ? String(c.bridges.length) : "–");
    const diff = c.material - c.officialMaterial;
    note.textContent =
      mode === "correct"
        ? `Correct answer: ${c.material}. The official program answers ${c.officialMaterial}${diff ? `, ${diff} too little` : ", the same"}.`
        : merged.size
          ? `The official program merges ${[...merged].reduce((sum, off) => sum + realOf.get(off).size, 0)} real islands into ${merged.size} (outlined), so it sees ${c.officialIslands} islands instead of ${c.islands} and needs only ${c.officialMaterial}.`
          : "On this map the leak doesn't merge any islands, so both answers agree.";
  }

  const picker = segmented(cases.map((c, i) => ({ value: i, label: c.name })), (v) => ((current = v), draw()), 0, "Map");
  const modes = segmented(
    [
      { value: "correct", label: "Correct" },
      { value: "official", label: "Official program" },
    ],
    (v) => ((mode = v), draw()),
    "correct",
    "Which islands",
  );
  root.append(h("div", { class: "vis-row" }, picker), h("div", { class: "vis-row" }, modes), tiles, svgWrap, note);
  draw();
});
