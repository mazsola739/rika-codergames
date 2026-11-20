CG.visual("2022-2", (root, _, { h, s, slider, stats }) => {
  const stage = h("div", { class: "vis-frame" });
  const tiles = stats([["LCM(1 … N)", ""], ["Second smallest", ""]]);
  const isPrime = (p) => p > 1 && [...Array(Math.floor(Math.sqrt(p)) + 1).keys()].slice(2).every((d) => p % d);
  // n adds a new factor exactly when it is a prime power p^k: then the LCM gains one more p.
  const primePower = (n) => {
    for (let p = 2; p <= n; p++) if (isPrime(p)) {
      let x = n;
      while (x % p === 0) x /= p;
      if (x === 1) return p;
      if (n % p === 0) return null;
    }
    return null;
  };
  function draw(N) {
    let lcm = 1n;
    const W = 640;
    const cols = 10;
    const size = 60;
    const rows = Math.ceil(N / cols);
    const svg = s("svg", { class: "vis-svg", viewBox: `0 0 ${W} ${rows * size + 8}`, role: "img", "aria-label": `Numbers 1 to ${N}` });
    for (let n = 1; n <= N; n++) {
      const p = primePower(n);
      if (p) lcm *= BigInt(p);
      const x = 4 + ((n - 1) % cols) * size;
      const y = 4 + Math.floor((n - 1) / cols) * size;
      svg.append(s("rect", { x, y, width: size - 6, height: size - 6, rx: 8, class: p ? "f-accent" : "f-cell", opacity: p ? 0.9 : 1 }));
      svg.append(s("text", { x: x + (size - 6) / 2, y: y + 26, "text-anchor": "middle", "font-size": 17, "font-weight": 600, class: p ? "f-surface" : "f-muted", text: String(n) }));
      svg.append(s("text", { x: x + (size - 6) / 2, y: y + 44, "text-anchor": "middle", "font-size": 10, class: p ? "f-surface" : "f-muted", text: p ? `×${p}` : n === 1 ? "" : "nothing new" }));
    }
    stage.replaceChildren(svg);
    tiles.set(0, lcm.toLocaleString("en-US"));
    tiles.set(1, (2n * lcm).toLocaleString("en-US"));
  }
  root.append(slider({ label: "N", min: 2, max: 30, value: 21, onInput: draw }), tiles, stage);
  draw(21);
});
