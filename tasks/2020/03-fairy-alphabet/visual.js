CG.visual("2020-3", (root, d, { h, s, player, stats, button, fmt }) => {
  const A = "abcdefghijklmnopqrstuvwxyz";
  const FREQ = "etaoinshrdlcumwfgypbvkjxqz";
  const code = (ch) => ch.charCodeAt(0) - 97;
  const WORDS = new Set(d.words);
  const lower = d.cipher.toLowerCase();
  const B = 27;
  const pair = new Float64Array(B * B);
  {
    const counts = new Float64Array(B * B);
    const totals = new Float64Array(B);
    for (const w of WORDS) {
      const s = `{${w}{`;
      for (let i = 0; i + 1 < s.length; i++) {
        counts[code(s[i]) * B + code(s[i + 1])]++;
        totals[code(s[i])]++;
      }
    }
    for (let i = 0; i < B * B; i++) pair[i] = Math.log((counts[i] + 0.5) / (totals[Math.floor(i / B)] + 0.5 * B));
  }
  const distinct = new Map();
  for (const w of lower.match(/[a-z]+/g)) distinct.set(w, (distinct.get(w) ?? 0) + 1);
  const wordCodes = [...distinct].map(([w, n]) => ({ codes: [...w].map(code), n }));
  function score(key) {
    let total = 0;
    for (const { codes, n } of wordCodes) {
      let prev = 26;
      let plain = "";
      let ws = 0;
      for (const c of codes) {
        ws += pair[prev * B + key[c]];
        plain += A[key[c]];
        prev = key[c];
      }
      ws += pair[prev * B + 26];
      if (WORDS.has(plain)) ws += 3 * plain.length;
      total += n * ws;
    }
    return total;
  }
  const decrypt = (key) =>
    d.cipher.replace(/[a-zA-Z]/g, (ch) => {
      const p = A[key[code(ch.toLowerCase())]];
      return ch === ch.toLowerCase() ? p : p.toUpperCase();
    });

  function crack() {
    const snaps = [];
    const counts = [...A].map((c) => [...lower].filter((x) => x === c).length);
    const order = [...Array(26).keys()].sort((a, b) => counts[b] - counts[a] || a - b);
    const start = Array(26).fill(0);
    order.forEach((c, r) => (start[c] = code(FREQ[r])));
    let best = score(start);
    snaps.push({ key: [...start], score: best, note: CG.t("Start: the most frequent cipher letter becomes e, the next t, …", "Kezdés: a leggyakoribb titkos betűből e lesz, a következőből t, …") });
    const climb = (k, label) => {
      let cur = score(k);
      for (let improved = true; improved; ) {
        improved = false;
        for (let i = 0; i < 26; i++)
          for (let j = i + 1; j < 26; j++) {
            [k[i], k[j]] = [k[j], k[i]];
            const sc = score(k);
            if (sc > cur + 1e-9) {
              cur = sc;
              improved = true;
              if (cur > best + 1e-9) {
                best = cur;
                snaps.push({ key: [...k], score: cur, note: CG.t(`${label}: swapped ${A[k[j]]} ↔ ${A[k[i]]}`, `${label}: csere ${A[k[j]]} ↔ ${A[k[i]]}`) });
              }
            } else [k[i], k[j]] = [k[j], k[i]];
          }
      }
      return [k, cur];
    };
    let [bestKey] = climb([...start], CG.t("Climbing", "Mászás"));
    let seed = 2020;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    for (let r = 0; r < 40; r++) {
      const k = [...bestKey];
      for (let t = 0; t < 3; t++) {
        const i = Math.floor(rnd() * 26);
        const j = Math.floor(rnd() * 26);
        [k[i], k[j]] = [k[j], k[i]];
      }
      const [k2, s2] = climb(k, CG.t(`Restart ${r + 1}`, `${r + 1}. újraindítás`));
      if (s2 >= best - 1e-9) bestKey = k2;
    }
    return snaps;
  }

  // Letter counts of the cipher text, most frequent first: where frequency analysis starts.
  const counts = [...A].map((c) => [c, [...lower].filter((x) => x === c).length]).sort((a, b) => b[1] - a[1]);
  const top = counts[0][1];
  const freq = s("svg", { class: "vis-svg", viewBox: "0 0 640 130", role: "img", "aria-label": CG.t("Letter counts of the cipher text", "A titkos szöveg betűszámai") });
  counts.forEach(([c, n], i) => {
    const hgt = (n / top) * 92;
    freq.append(s("rect", { x: 6 + i * 24.4, y: 104 - hgt, width: 19, height: hgt, rx: 3, class: i < 6 ? "f-accent" : "f-info", opacity: i < 6 ? 0.9 : 0.55 }));
    freq.append(s("text", { x: 15.5 + i * 24.4, y: 122, "text-anchor": "middle", class: "t-label t-mono", text: c }));
  });
  const text = h("div", { class: "vis-text" }, d.cipher);
  const tiles = stats([[CG.t("Improvements", "Javulások"), "–"], [CG.t("Score", "Pontszám"), "–"], [CG.t("Title", "Cím"), "?"]]);
  const holder = h("div", { class: "visual-body" });
  const go = button(CG.t("Crack it", "Feltörés"), {
    class: "vis-btn primary",
    onclick: () => {
      go.disabled = true;
      go.textContent = CG.t("Cracking…", "Feltörés…");
      setTimeout(() => {
        const snaps = crack();
        go.remove();
        const p = player({
          count: snaps.length,
          interval: 160,
          label: (i) => snaps[i].note,
          render: (i) => {
            const now = decrypt(snaps[i].key);
            const before = i ? decrypt(snaps[i - 1].key) : now;
            text.replaceChildren(...[...now].map((ch, k) => (ch !== before[k] ? h("mark", { text: ch }) : ch)));
            tiles.set(0, `${i + 1} / ${snaps.length}`);
            tiles.set(1, fmt(snaps[i].score));
            tiles.set(2, /cinderella/i.test(now) ? "Cinderella" : "?");
          },
        });
        holder.append(p.el);
        p.set(0);
        p.el.querySelector(".primary").click();
      }, 30);
    },
  });
  holder.append(h("div", { class: "vis-row" }, go));
  root.append(
    tiles,
    h("div", { class: "vis-frame" }, freq, h("p", { class: "vis-note", text: CG.t("Cipher letters by frequency. The pink six probably stand for e, t, a, o, i, n: the starting guess.", "A titkos betűk gyakoriság szerint. A rózsaszín hat valószínűleg az e, t, a, o, i, n: ez a kiinduló tipp.") })),
    holder,
    text,
  );
});
