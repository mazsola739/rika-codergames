CG.visual("2026-2", (root, d, { h, css, onTheme, player, segmented, stats, fmt, bytes }) => {
  // One canvas pixel per Braille dot: a cell is 2 pixels wide and 4 tall.
  const W = d.cols * 2;
  const H = d.rows * 4;
  const pos = new Uint16Array(bytes(d.pos).buffer);
  const noise = bytes(d.noise);
  const isNoise = (i) => (noise[i >> 3] >> (i & 7)) & 1;
  const xy = (p) => {
    const cell = p >> 3;
    const dot = p & 7;
    const col = cell % d.cols;
    const row = Math.floor(cell / d.cols);
    const dx = dot === 7 || (dot >= 3 && dot <= 5) ? 1 : 0;
    const dy = dot < 3 ? dot : dot < 6 ? dot - 3 : 3;
    return [col * 2 + dx, row * 4 + dy];
  };
  const coords = Array.from(pos, xy);
  const validTotal = coords.length - [...Array(coords.length).keys()].filter(isNoise).length;

  const canvas = h("canvas", { class: "vis-canvas", width: W, height: H, role: "img", "aria-label": CG.t("The Braille raster as pixels", "A Braille-raszter pixelekként") });
  const ctx = canvas.getContext("2d");
  let showDecoys = true;
  const STEPS = 120;
  const upto = (step) => Math.round((coords.length * step) / (STEPS - 1));
  const tiles = stats([[CG.t("Dots placed", "Elhelyezett pontok"), "0"], [CG.t("Decoys thrown away", "Kidobott csalik"), "0"], [CG.t("Records read", "Beolvasott rekordok"), "0"]]);
  const reading = h("div", { class: "visual-body", hidden: true });

  function draw(step) {
    const n = upto(step);
    ctx.fillStyle = css("--bg");
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = css("--fg");
    let placed = 0;
    let decoys = 0;
    for (let i = 0; i < n; i++) {
      if (isNoise(i)) {
        decoys++;
        continue;
      }
      placed++;
      ctx.fillRect(coords[i][0], coords[i][1], 1, 1);
    }
    // Decoys of the last stretch flash in the accent colour before they are discarded.
    if (showDecoys && step < STEPS - 1) {
      ctx.fillStyle = css("--accent");
      for (let i = Math.max(0, n - Math.ceil(coords.length / 12)); i < n; i++) if (isNoise(i)) ctx.fillRect(coords[i][0] - 1, coords[i][1] - 1, 3, 3);
    }
    tiles.set(0, `${fmt(placed)} / ${fmt(validTotal)}`);
    tiles.set(1, fmt(decoys));
    tiles.set(2, fmt(n));
    reading.hidden = step < STEPS - 1;
  }

  const p = player({ count: STEPS, render: draw, interval: 60, label: (i) => (i === STEPS - 1 ? CG.t("Done: the picture and the metadata rows are complete.", "Kész: a kép és a metaadatsorok teljesek.") : CG.t(`Replaying the log: ${Math.round((i / (STEPS - 1)) * 100)}%`, `A napló visszajátszása: ${Math.round((i / (STEPS - 1)) * 100)}%`)) });
  const toggle = segmented(
    [
      { value: true, label: CG.t("Flash decoys", "Csalik villogtatása") },
      { value: false, label: CG.t("Hide decoys", "Csalik elrejtése") },
    ],
    (v) => {
      showDecoys = v;
      draw(p.index);
    },
    true,
    CG.t("Decoy records", "Csalirekordok"),
  );

  for (const [i, row] of d.text.entries()) {
    const label = CG.t(["Row 43 · location", "Row 44 · depicted", "Row 45 · artist"], ["43. sor · helyszín", "44. sor · ábrázolt alakok", "45. sor · művész"])[i];
    reading.append(
      h(
        "div",
        { class: "vis-text" },
        h("span", { class: "dim", text: label + "\n" }),
        h("span", { text: row.braille + "\n", style: { fontSize: "20px", letterSpacing: "2px" } }),
        h("mark", { text: row.letters }),
        h("span", { class: "dim", text: CG.t(`
In English: ${row.english}`, `
Magyarul: ${["AVUS, északi kanyar", "Ewald Kluge egy DKW-n és Ernst Jakob Henne egy BMW-n", "Max Esser szobra"][i]}`) }),
      ),
    );
  }

  root.append(
    tiles,
    h("div", { class: "vis-frame" }, canvas),
    p.el,
    h("div", { class: "vis-row" }, toggle, h("span", { class: "vis-note", text: CG.t("Black dots come from VALID records; pink flashes are NOISE records being discarded.", "A fekete pontok a VALID rekordokból jönnek; a rózsaszín villanások a kidobott NOISE rekordok.") })),
    reading,
  );
  onTheme(() => draw(p.index));
  p.set(STEPS - 1);
});
