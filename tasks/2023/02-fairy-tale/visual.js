CG.visual("2023-2", (root, text, { h, s, scale, segmented, fmt }) => {
  const EN = [8.17, 1.49, 2.78, 4.25, 12.7, 2.23, 2.02, 6.09, 6.97, 0.15, 0.77, 4.03, 2.41, 6.75, 7.51, 1.93, 0.1, 5.99, 6.33, 9.06, 2.76, 0.98, 2.36, 0.15, 1.97, 0.07];
  const codes = [...text].map((c) => c.charCodeAt(0) - 65);
  const column = (k, j) => codes.filter((_, i) => i % k === j);
  const ioc = (xs) => {
    const c = Array(26).fill(0);
    xs.forEach((x) => c[x]++);
    return c.reduce((s, x) => s + x * (x - 1), 0) / (xs.length * (xs.length - 1));
  };
  const iocs = Array.from({ length: 20 }, (_, i) => { const k = i + 1; return [...Array(k).keys()].reduce((s, j) => s + ioc(column(k, j)), 0) / k; });
  const K = iocs.findIndex((v) => v > 0.06) + 1;
  const shiftOf = (xs) => {
    let best = 0, bestScore = Infinity;
    for (let sh = 0; sh < 26; sh++) {
      const c = Array(26).fill(0);
      xs.forEach((x) => c[(x - sh + 26) % 26]++);
      const sc = c.reduce((s, x, i) => s + (x - (EN[i] / 100) * xs.length) ** 2 / ((EN[i] / 100) * xs.length), 0);
      if (sc < bestScore) [best, bestScore] = [sh, sc];
    }
    return best;
  };
  const key = [...Array(K).keys()].map((j) => shiftOf(column(K, j)));
  const plain = codes.map((c, i) => String.fromCharCode(65 + ((c - key[i % K] + 26) % 26))).join("");

  // chart 1: IoC per key length
  const W = 640, H = 170;
  const x = scale(0.5, 20.5, 40, W - 10);
  const y = scale(0.03, 0.075, H - 24, 10);
  const c1 = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": CG.t("Index of coincidence per key length", "Koincidenciaindex kulcshosszanként") });
  for (const [v, cls, label] of [[0.066, "s-good", CG.t("English 0.066", "angol 0,066")], [0.038, "s-muted", CG.t("random 0.038", "véletlen 0,038")]]) {
    c1.append(s("line", { x1: 40, x2: W - 10, y1: y(v), y2: y(v), class: cls, "stroke-dasharray": "4 3" }));
    c1.append(s("text", { x: W - 12, y: y(v) - 4, "text-anchor": "end", class: "t-label", text: label }));
  }
  iocs.forEach((v, i) => {
    c1.append(s("rect", { x: x(i + 1) - 10, y: y(v), width: 20, height: H - 24 - y(v), rx: 3, class: i + 1 === K ? "f-accent" : (i + 1) % K === 0 ? "f-info" : "f-line" }));
    c1.append(s("text", { x: x(i + 1), y: H - 8, "text-anchor": "middle", class: "t-label", text: String(i + 1) }));
  });

  // chart 2: letter counts of one column (shifted back) vs English
  const colChart = h("div", { class: "vis-frame" });
  function drawColumn(j) {
    const xs = column(K, j).map((v) => (v - key[j] + 26) % 26);
    const counts = Array(26).fill(0);
    xs.forEach((v) => counts[v]++);
    const max = Math.max(...counts.map((c) => c / xs.length), 0.13);
    const cx = scale(0, 26, 20, W - 10);
    const cy = scale(0, max, H - 24, 10);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": CG.t(`Letter frequencies of column ${j + 1}`, `A ${j + 1}. oszlop betűgyakoriságai`) });
    counts.forEach((c, i) => {
      const bw = (W - 30) / 26;
      svg.append(s("rect", { x: cx(i) + 2, y: cy(c / xs.length), width: bw - 4, height: H - 24 - cy(c / xs.length), rx: 2, class: "f-info", opacity: 0.8 }));
      svg.append(s("line", { x1: cx(i) + 1, x2: cx(i) + bw - 1, y1: cy(EN[i] / 100), y2: cy(EN[i] / 100), class: "s-accent", "stroke-width": 2.5 }));
      svg.append(s("text", { x: cx(i) + bw / 2, y: H - 8, "text-anchor": "middle", class: "t-label", text: String.fromCharCode(65 + i) }));
    });
    colChart.replaceChildren(svg, h("p", { class: "vis-note", text: CG.t(`Column ${j + 1}: shift ${key[j]} (key letter ${String.fromCharCode(65 + key[j])}). Blue: its letters after shifting back; pink: English.`, `${j + 1}. oszlop: ${key[j]} eltolás (kulcsbetű: ${String.fromCharCode(65 + key[j])}). Kék: a betűi visszatolás után; rózsaszín: angol.`) }));
  }
  const keyPick = segmented(key.map((k, j) => ({ value: j, label: String.fromCharCode(65 + k) })), drawColumn, 0, CG.t("Key letter", "Kulcsbetű"));
  const out = h("div", { class: "vis-text" }, plain);
  let showPlain = true;
  const toggle = segmented([{ value: true, label: CG.t("Decrypted", "Visszafejtve") }, { value: false, label: CG.t("Cipher text", "Titkos szöveg") }], (v) => ((showPlain = v), (out.textContent = v ? plain : text)), true, CG.t("Text", "Szöveg"));
  root.append(
    h("div", { class: "vis-frame" }, c1),
    h("p", { class: "vis-note", text: CG.t(`Key length ${K}, average IoC ${fmt(iocs[K - 1], 3)}. Its multiples (blue) look English too.`, `Kulcshossz: ${K}, átlagos IoC: ${fmt(iocs[K - 1], 3)}. A többszörösei (kék) is angolnak tűnnek.`) }),
    h("div", { class: "vis-row" }, h("span", { class: "vis-note", text: CG.t("Key:", "Kulcs:") }), keyPick),
    colChart,
    h("div", { class: "vis-row" }, toggle),
    out,
  );
  drawColumn(0);
});
