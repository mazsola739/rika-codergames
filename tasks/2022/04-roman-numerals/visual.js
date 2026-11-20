CG.visual("2022-4", (root, lines, { h, s, stats, slider, scale, fmt }) => {
  const VALUE = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const parse = (r) => [...r].reduce((t, ch, i) => t + (VALUE[ch] < (VALUE[r[i + 1]] ?? 0) ? -VALUE[ch] : VALUE[ch]), 0);
  const DIG = [
    ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
    ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
    ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
  ];
  const write = (n) => "M".repeat(Math.floor(n / 1000)) + DIG[2][Math.floor(n / 100) % 10] + DIG[1][Math.floor(n / 10) % 10] + DIG[0][n % 10];
  const id = "roman-input";
  const input = h("input", { id, type: "text", value: lines[0], class: "vis-mono", style: { font: "500 16px var(--font-mono)", padding: "6px 10px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--bg)", color: "var(--fg)", width: "100%", maxWidth: "340px" }, "aria-label": "Roman numeral" });
  const tiles = stats([["Value", ""], ["Shortest form", ""], ["Characters saved", ""]]);
  function show() {
    const r = input.value.toUpperCase().replace(/[^IVXLCDM]/g, "");
    if (!r) return;
    const v = parse(r);
    tiles.set(0, fmt(v));
    tiles.set(1, write(v));
    tiles.set(2, String(r.length - write(v).length));
  }
  input.addEventListener("input", show);
  const saved = lines.map((l) => l.length - write(parse(l)).length);
  const W = 640;
  const H = 90;
  const x = scale(0, saved.length, 0, W);
  const top = Math.max(1, ...saved);
  const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Characters saved per input line" });
  saved.forEach((v, i) => v && svg.append(s("rect", { x: x(i), y: H - 14 - (v / top) * (H - 24), width: Math.max(0.6, W / saved.length), height: (v / top) * (H - 24), class: "f-info" })));
  svg.append(s("text", { x: W, y: H - 2, "text-anchor": "end", class: "t-label", text: `${fmt(saved.reduce((a, b) => a + b, 0))} characters saved in total` }));
  root.append(
    h("div", { class: "vis-row" }, h("label", { for: id, class: "vis-note", text: "Numeral" }), input),
    slider({ label: "Input line", min: 1, max: lines.length, value: 1, onInput: (v) => ((input.value = lines[v - 1]), show()), format: (v) => `#${v}` }),
    tiles,
    h("div", { class: "vis-frame" }, svg),
  );
  show();
});
