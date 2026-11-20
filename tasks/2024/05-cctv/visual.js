CG.visual("2024-5", (root, cases, { h, s, segmented, stats, button, rng }) => {
  let base = cases[0];
  let cells = [];
  let presses = 0;
  let timer = null;
  let random = rng(2024);

  // Same idea as solution.ts, but also returns how far to shift (+ = down/right).
  function axis(positions, size) {
    const occupied = [...new Set(positions)].sort((a, b) => a - b);
    if (occupied.length === size) return { span: size, moves: 0, shift: 0, gap: null };
    let best = null;
    for (let i = 0; i < occupied.length; i++) {
      const next = occupied[(i + 1) % occupied.length];
      const gap = (next - occupied[i] - 1 + size) % size;
      const span = size - gap;
      const start = next;
      let option = { moves: 0, shift: 0 };
      if (start > size - span) {
        // Shift down/right to wrap the start to 0, or up/left to bring it to size - span.
        const down = size - start;
        const up = start - (size - span);
        option = down <= up ? { moves: down, shift: down } : { moves: up, shift: -up };
      }
      const cand = { span, ...option, gap: [occupied[i], next] };
      if (!best || span < best.span || (span === best.span && cand.moves < best.moves)) best = cand;
    }
    return best;
  }

  const box = () => {
    const rs = cells.map((c) => c[0]);
    const cs = cells.map((c) => c[1]);
    return { r0: Math.min(...rs), r1: Math.max(...rs), c0: Math.min(...cs), c1: Math.max(...cs) };
  };

  const tiles = stats([[CG.t("Presses", "Gombnyomások"), "0"], [CG.t("Compactness now", "Mostani tömörség"), ""], [CG.t("Best possible", "A lehető legjobb"), ""]]);
  const board = h("div", { class: "vis-frame" });
  const note = h("p", { class: "vis-note" });

  function draw() {
    const { h: H, w: W } = base;
    const b = box();
    const area = (b.r1 - b.r0 + 1) * (b.c1 - b.c0 + 1);
    const rows = axis(cells.map((c) => c[0]), H);
    const cols = axis(cells.map((c) => c[1]), W);
    const S = 1; // cell size in SVG units
    const M = 1.4; // margin for the occupancy bars
    const svg = s("svg", { class: "vis-svg", viewBox: `${-M} ${-M} ${W + M + 0.2} ${H + M + 0.2}`, tabindex: 0, role: "img", "aria-label": CG.t(`Grid of ${H} by ${W} cells with ${cells.length} camera images. Use the arrow keys to shift them.`, `${H} × ${W} cellás rács ${cells.length} kameraképpel. A nyílbillentyűkkel tolhatod el őket.`), style: { maxWidth: `${Math.min(680, 60 * W + 80)}px`, margin: "0 auto" } });
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) svg.append(s("rect", { x: c + 0.05, y: r + 0.05, width: 0.9, height: 0.9, rx: 0.12, class: "f-cell" }));
    // occupancy bars: top for columns, left for rows
    const occR = new Set(cells.map((c) => c[0]));
    const occC = new Set(cells.map((c) => c[1]));
    for (let r = 0; r < H; r++) svg.append(s("rect", { x: -M + 0.25, y: r + 0.2, width: 0.6, height: 0.6, rx: 0.1, class: occR.has(r) ? "f-info" : "f-line" }));
    for (let c = 0; c < W; c++) svg.append(s("rect", { x: c + 0.2, y: -M + 0.25, width: 0.6, height: 0.6, rx: 0.1, class: occC.has(c) ? "f-info" : "f-line" }));
    svg.append(s("rect", { x: b.c0 * S + 0.02, y: b.r0 + 0.02, width: (b.c1 - b.c0 + 1) - 0.04, height: (b.r1 - b.r0 + 1) - 0.04, fill: "none", class: "s-accent", "stroke-width": 0.08, "stroke-dasharray": "0.25 0.15", rx: 0.15 }));
    cells.forEach(([r, c], i) => {
      svg.append(s("rect", { x: c + 0.15, y: r + 0.15, width: 0.7, height: 0.7, rx: 0.15, class: "f-accent" }));
      svg.append(s("text", { x: c + 0.5, y: r + 0.62, "text-anchor": "middle", "font-size": 0.38, class: "f-surface", "font-weight": 600, text: String(i + 1) }));
    });
    svg.addEventListener("keydown", (e) => {
      const move = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
      if (!move) return;
      e.preventDefault();
      shift(...move);
      board.querySelector("svg").focus();
    });
    board.replaceChildren(svg);
    tiles.set(0, String(presses));
    tiles.set(1, String(area));
    tiles.set(2, CG.t(`${rows.span * cols.span} in ${rows.moves + cols.moves} presses`, `${rows.span * cols.span}, ${rows.moves + cols.moves} gombnyomással`));
    const bestArea = rows.span * cols.span;
    const bestMoves = rows.moves + cols.moves;
    note.textContent =
      area !== bestArea
        ? CG.t(`The shortest block covering the rows is ${rows.span} long, for the columns ${cols.span}. Shift the images to get compactness ${bestArea}.`, `A sorokat lefedő legrövidebb blokk ${rows.span} hosszú, az oszlopoké ${cols.span}. Told el a képeket, hogy a tömörség ${bestArea} legyen.`)
        : presses === 0
          ? CG.t("Already as compact as it gets, no presses needed.", "Már most is a lehető legtömörebb, nem kell gombot nyomni.")
          : presses === bestMoves
            ? CG.t(`Compactness ${area} in ${presses} presses: optimal.`, `Tömörség: ${area}, ${presses} gombnyomással: optimális.`)
            : CG.t(`Compactness ${area} reached in ${presses} presses. It can be done in ${bestMoves}.`, `Tömörség: ${area}, ${presses} gombnyomással. ${bestMoves} gombnyomással is meg lehet csinálni.`);
  }

  function shift(dr, dc) {
    const { h: H, w: W } = base;
    cells = cells.map(([r, c]) => [(r + dr + H) % H, (c + dc + W) % W]);
    presses++;
    draw();
  }

  function reset(c) {
    clearInterval(timer);
    base = c;
    cells = c.cells.map((x) => [...x]);
    presses = 0;
    draw();
  }

  function solve() {
    reset(base);
    const rows = axis(cells.map((c) => c[0]), base.h);
    const cols = axis(cells.map((c) => c[1]), base.w);
    const steps = [];
    for (let i = 0; i < Math.abs(rows.shift); i++) steps.push([Math.sign(rows.shift), 0]);
    for (let i = 0; i < Math.abs(cols.shift); i++) steps.push([0, Math.sign(cols.shift)]);
    if (!steps.length) return draw();
    timer = setInterval(() => {
      const st = steps.shift();
      if (!st) return clearInterval(timer);
      shift(...st);
    }, 450);
  }

  function randomCase() {
    const H = 6 + Math.floor(random() * 4);
    const W = 8 + Math.floor(random() * 5);
    const k = 4 + Math.floor(random() * 4);
    const set = new Set();
    // keep the images in a few nearby rows/columns that wrap around, so the puzzle is interesting
    const r0 = Math.floor(random() * H);
    const c0 = Math.floor(random() * W);
    while (set.size < k) set.add(`${(r0 + Math.floor(random() * Math.ceil(H / 2))) % H},${(c0 + Math.floor(random() * Math.ceil(W / 2))) % W}`);
    return { name: "Random", h: H, w: W, cells: [...set].map((x) => x.split(",").map(Number)) };
  }

  const pickerOptions = [...cases.map((c, i) => ({ value: i, label: CG.t(c.name, c.name.replace(/^Case (\d+)$/, "$1. eset")) })), { value: "random", label: CG.t("Random grid", "Véletlen rács") }];
  const picker = segmented(pickerOptions, (v) => reset(v === "random" ? randomCase() : cases[v]), 0, CG.t("Grid", "Rács"));
  const arrows = h(
    "div",
    { class: "seg", role: "group", "aria-label": CG.t("Shift every image", "Minden kép eltolása") },
    button("←", { "aria-label": CG.t("Left", "Balra"), onclick: () => shift(0, -1) }),
    button("↑", { "aria-label": CG.t("Up", "Fel"), onclick: () => shift(-1, 0) }),
    button("↓", { "aria-label": CG.t("Down", "Le"), onclick: () => shift(1, 0) }),
    button("→", { "aria-label": CG.t("Right", "Jobbra"), onclick: () => shift(0, 1) }),
  );
  root.append(
    h("div", { class: "vis-row" }, picker),
    tiles,
    board,
    h("div", { class: "vis-row" }, arrows, button(CG.t("Show the solution", "Mutasd a megoldást"), { class: "vis-btn primary", onclick: solve }), button(CG.t("Reset", "Visszaállítás"), { onclick: () => reset(base) })),
    note,
  );
  reset(cases[0]);
});
