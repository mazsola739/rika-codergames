CG.visual("2024-4", (root, values, { h, css, onTheme, stats, fmt }) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const present = new Uint8Array(max - min + 1);
  values.forEach((v) => (present[v - min] = 1));
  const missing = [...present.keys()].filter((i) => !present[i]).map((i) => i + min);
  const PER_ROW = 400;
  const rows = Math.ceil(present.length / PER_ROW);
  const canvas = h("canvas", { class: "vis-canvas", width: PER_ROW, height: rows * 12, role: "img", "aria-label": CG.t("Barcode of present and missing numbers", "A meglévő és a hiányzó számok vonalkódja") });
  const ctx = canvas.getContext("2d");
  function draw() {
    ctx.fillStyle = css("--bg");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < present.length; i++) {
      ctx.fillStyle = present[i] ? css("--line") : css("--accent");
      ctx.fillRect(i % PER_ROW, Math.floor(i / PER_ROW) * 12, 1, 10);
    }
  }
  root.append(
    stats([[CG.t("Numbers in the array", "Számok a tömbben"), fmt(values.length)], [CG.t("Range", "Tartomány"), `${fmt(min)} … ${fmt(max)}`], [CG.t("Missing", "Hiányzó"), fmt(missing.length)]]),
    h("div", { class: "vis-frame" }, canvas),
    h("p", { class: "vis-note", text: CG.t(`Each row covers ${PER_ROW} numbers. First missing: ${missing.slice(0, 8).join(", ")} …`, `Minden sor ${PER_ROW} számot fed le. Az első hiányzók: ${missing.slice(0, 8).join(", ")} …`) }),
  );
  onTheme(draw);
  draw();
});
