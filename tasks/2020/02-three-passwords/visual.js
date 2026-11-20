CG.visual("2020-2", (root, _, { h, s, segmented }) => {
  const names = ["left", "middle", "right"];
  const choice = { point: 1, ask: 0, yes: 0, no: 2 };
  const table = h("div", { class: "tablewrap" });
  const notes = h("div", { class: "vis-frame" });
  // The three notes: where you point (hand), which note you ask about (question mark).
  function drawNotes() {
    const svg = s("svg", { class: "vis-svg", viewBox: "0 0 420 150", role: "img", "aria-label": "The three notes and your choices" });
    names.forEach((n, i) => {
      const x = 30 + i * 130;
      svg.append(s("rect", { x, y: 30, width: 100, height: 80, rx: 10, class: i === choice.point ? "f-accent" : "f-cell", opacity: i === choice.point ? 0.9 : 1, stroke: "var(--line)" }));
      svg.append(s("text", { x: x + 50, y: 78, "text-anchor": "middle", "font-size": 28, "font-weight": 700, class: i === choice.point ? "f-surface" : "f-fg", text: i === choice.ask ? "?" : "•••" }));
      svg.append(s("text", { x: x + 50, y: 134, "text-anchor": "middle", class: "t-label", text: n + (i === choice.point ? " · pointed at" : i === choice.ask ? " · asked about" : "") }));
    });
    notes.replaceChildren(svg);
  }
  const verdict = h("p", { class: "vis-note" });
  const pick = (key, label) =>
    h(
      "div",
      { class: "vis-row" },
      h("span", { class: "vis-note", style: { minWidth: "9em" }, text: label }),
      segmented(names.map((n, i) => ({ value: i, label: n })), (v) => ((choice[key] = v), draw()), choice[key], label),
    );
  function draw() {
    let ok = true;
    const rows = [0, 1, 2].map((wrong) => {
      const answers = choice.point === wrong ? [true, false] : [choice.ask !== wrong];
      const outcomes = answers.map((yes) => {
        const taken = yes ? choice.yes : choice.no;
        const good = taken !== wrong;
        ok &&= good;
        return `${yes ? "yes" : "no"} → takes the ${names[taken]} note ${good ? "✓" : "✗"}`;
      });
      return h(
        "tr",
        {},
        h("td", { text: names[wrong] }),
        h("td", { text: choice.point === wrong ? "random (you point at the wrong note)" : "true" }),
        h("td", { text: outcomes.join(" · ") }),
      );
    });
    table.replaceChildren(
      h("table", { class: "vis-table" }, h("thead", {}, h("tr", {}, ...["Wrong note is", "Answer is", "What happens"].map((t) => h("th", { text: t })))), h("tbody", {}, rows)),
    );
    verdict.textContent = ok ? "This strategy always finds a right password." : "This strategy can fail: look for the ✗.";
    verdict.style.color = ok ? "var(--good)" : "var(--bad)";
    drawNotes();
  }
  root.append(notes, pick("point", "Point at"), pick("ask", "Ask “is … right?”"), pick("yes", "On yes, take"), pick("no", "On no, take"), table, verdict);
  draw();
});
