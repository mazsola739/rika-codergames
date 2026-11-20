CG.visual("2020-1", (root, _, { h, s, player }) => {
  const numbers = [13, 14, 22, 23, 32];
  const steps = [
    { out: [], mark: [], text: CG.t("Michal picks one of five numbers. Peter knows the first digit, Janka the second.", "Michal választ egyet az öt szám közül. Peter az első számjegyet tudja, Janka a másodikat.") },
    { out: [], mark: [14], text: CG.t("Only 14 has a second digit (4) that no other number shares. If Janka had heard 4, she would know at once.", "Csak a 14 második számjegye (4) nem közös egyetlen másik számmal sem. Ha Janka 4-et hallott volna, azonnal tudná.") },
    { out: [13, 14], mark: [], text: CG.t("Peter: “I know Janka can’t tell.” So his digit can’t be 1, or the number might be 14. 13 and 14 are out.", "Peter: „Tudom, hogy Janka nem tudhatja.” A számjegye tehát nem lehet 1, különben a szám lehetne 14 is. A 13 és a 14 kiesik.") },
    { out: [13, 14, 22, 32], mark: [23], text: CG.t("Janka: “Now I know.” Among 22, 23 and 32 the digit 2 still fits two numbers, the digit 3 only one.", "Janka: „Most már tudom.” A 22, 23 és 32 közül a 2-es számjegy még két számra illik, a 3-as csak egyre.") },
  ];
  const stage = h("div", { class: "vis-frame" });
  const text = h("p", { class: "vis-note" });
  const render = (i) => {
    const st = steps[i];
    const svg = s("svg", { class: "vis-svg", viewBox: "0 0 562 120", role: "img", "aria-label": CG.t("The five candidate numbers", "Az öt jelölt szám") });
    numbers.forEach((n, k) => {
      const x = 12 + k * 110;
      const out = st.out.includes(n);
      const mark = st.mark.includes(n);
      svg.append(s("rect", { x, y: 14, width: 96, height: 92, rx: 12, class: mark ? "f-accent" : out ? "f-cell" : "f-surface", stroke: "var(--line)" }));
      svg.append(s("text", { x: x + 30, y: 76, "text-anchor": "middle", "font-size": 40, "font-weight": 600, class: out ? "f-muted" : mark ? "f-surface" : "f-fg", text: String(n)[0] }));
      svg.append(s("text", { x: x + 66, y: 76, "text-anchor": "middle", "font-size": 40, "font-weight": 600, class: out ? "f-muted" : mark ? "f-surface" : "f-info", text: String(n)[1] }));
      if (out) svg.append(s("line", { x1: x + 10, y1: 100, x2: x + 86, y2: 20, class: "s-bad", "stroke-width": 4, "stroke-linecap": "round" }));
    });
    stage.replaceChildren(svg);
    text.textContent = st.text;
  };
  const p = player({ count: steps.length, render, interval: 2200 });
  root.append(stage, text, p.el, h("div", { class: "vis-legend" }, h("span", {}, h("i", { style: { background: "var(--fg)" } }), CG.t("Peter’s digit", "Peter számjegye")), h("span", {}, h("i", { style: { background: "var(--info)" } }), CG.t("Janka’s digit", "Janka számjegye"))));
  p.set(0);
});
