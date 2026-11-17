import { createElement as h } from "react";
import { rng } from "../lib/rng";

const S = (fill, stroke, w) => ({
  fill: fill === "none" ? "none" : `var(--${fill})`,
  ...(stroke ? { stroke: `var(--${stroke})`, strokeWidth: w || 1.3, strokeLinejoin: "round" } : {}),
});

/** Draws one building as SVG elements, seeded by the listing id. */
export function building(seed, type, x, W, G) {
  const r = rng(seed), pick = (a) => a[Math.floor(r() * a.length)];
  const wall = "wall-" + (1 + Math.floor(r() * 4));
  let floors = 2, roof = "gable", bw = W * 0.6, winW = 14, winH = 20, fh = 34;
  if (type === "apartment") { floors = 4 + Math.floor(r() * 2); roof = "flat"; bw = W * 0.62; }
  else if (type === "townhouse") { floors = 3 + Math.floor(r() * 2); roof = pick(["mansard", "gable"]); bw = W * 0.5; }
  else if (type === "villa") { floors = 1 + Math.floor(r() * 2); roof = pick(["flat", "hip"]); bw = W * 0.8; winW = 34; winH = 22; }
  else if (type === "cottage") { floors = 1; roof = "gable"; bw = W * 0.52; fh = 42; }
  else if (type === "house") { roof = pick(["gable", "hip"]); }

  const els = [];
  let k = 0;
  const E = (tag, props, child) => els.push(h(tag, { key: k++, ...props }, child));
  const tree = (tx, rad, s) => {
    E("line", { x1: tx, y1: G, x2: tx, y2: G - rad * 1.4, style: S("none", "ink", 1.3) });
    E("circle", { cx: tx, cy: G - rad * 1.6, r: rad, style: S(s > 0.5 ? "tree" : "tree-2", "ink", 1.1) });
  };
  const tx = r() < 0.5 ? W * 0.1 : W * 0.9;
  if (r() < 0.8 || type === "plot") tree(tx, 10 + r() * 8, r());

  if (type === "plot") {
    const bx = W * 0.28, bw2 = W * 0.44, top = G - 62;
    E("path", { d: `M${bx} ${G}V${top}L${bx + bw2 / 2} ${top - 36}L${bx + bw2} ${top}V${G}`, style: S("none", "muted", 1.2), strokeDasharray: "5 5" });
    [bx, bx + bw2].forEach((p) => E("line", { x1: p, y1: G, x2: p, y2: G - 14, style: S("none", "ochre", 3) }));
    E("text", { x: bx + bw2 / 2, y: G - 24, textAnchor: "middle", style: { fill: "var(--muted)", font: "500 10px var(--mono)" } }, "CONSENT 220 m²");
    return h("g", { transform: `translate(${x} 0)` }, els);
  }

  const bx = (W - bw) / 2, top = G - floors * fh, cx = bx + bw / 2;
  const roofH = Math.min(roof === "flat" ? 6 : 58, Math.max(8, top - 12), bw * 0.42);
  if ((roof === "gable" || roof === "hip") && r() < 0.75) {
    const chx = bx + bw * (r() < 0.5 ? 0.22 : 0.7);
    E("rect", { x: chx, y: top - roofH * 0.8, width: 10, height: roofH * 0.6, style: S("roof", "ink") });
  }
  if (roof === "gable") E("polygon", { points: `${bx - 8},${top} ${cx},${top - roofH} ${bx + bw + 8},${top}`, style: S("roof", "ink") });
  else if (roof === "hip") E("polygon", { points: `${bx - 8},${top} ${bx + bw * 0.28},${top - roofH * 0.8} ${bx + bw * 0.72},${top - roofH * 0.8} ${bx + bw + 8},${top}`, style: S("roof", "ink") });
  else if (roof === "mansard") {
    E("polygon", { points: `${bx - 4},${top} ${bx + 10},${top - 28} ${bx + bw - 10},${top - 28} ${bx + bw + 4},${top}`, style: S("roof", "ink") });
    const dc = Math.max(1, Math.floor(bw / 40));
    for (let i = 0; i < dc; i++) E("rect", { x: bx + (bw / dc) * (i + 0.5) - 6, y: top - 22, width: 12, height: 14, style: S("glass", "ink", 1) });
  } else E("rect", { x: bx - 6, y: top - 7, width: bw + 12, height: 7, style: S("roof", "ink") });

  E("rect", { x: bx, y: top, width: bw, height: floors * fh, style: S(wall, "ink") });
  const cols = Math.max(2, Math.floor(bw / (winW + 18))), cell = bw / cols, door = Math.floor(cols / 2);
  for (let f = 0; f < floors; f++) {
    const ground = f === floors - 1, y = top + f * fh + (fh - winH) / 2 - (ground ? 3 : 0);
    for (let c = 0; c < cols; c++) {
      const wx = bx + cell * c + (cell - winW) / 2;
      if (ground && c === door) {
        const dw = type === "villa" ? 22 : 16;
        E("rect", { x: bx + cell * c + (cell - dw) / 2, y: G - 28, width: dw, height: 28, style: S("roof", "ink") });
        continue;
      }
      E("rect", { x: wx, y, width: winW, height: winH, style: S("glass", "ink", 1) });
      if (winW < 20) E("line", { x1: wx + winW / 2, y1: y, x2: wx + winW / 2, y2: y + winH, style: S("none", "ink", 0.8) });
      if (type === "apartment" && !ground && f % 2 === 0) E("line", { x1: wx - 3, y1: y + winH + 3, x2: wx + winW + 3, y2: y + winH + 3, style: S("none", "ink", 2) });
    }
  }
  if (type === "townhouse") E("rect", { x: bx - 6, y: top + fh - 4, width: bw + 12, height: 3, style: S("roof", "ink", 0.8) });
  return h("g", { transform: `translate(${x} 0)` }, els);
}

/** A listing's front elevation, drawn on a hatched ground line. */
export default function Elevation({ listing, vb = [320, 220] }) {
  const [W, H] = vb, G = H - 22, bw = Math.min(W, 340);
  const hatch = [];
  for (let i = -10; i < W + 20; i += 10) hatch.push(<line key={i} x1={i} y1={G + 2} x2={i - 8} y2={H} style={S("none", "line", 1)} />);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" role="img" aria-label={`Elevation drawing of ${listing.title}`}>
      {building(listing.id, listing.type, (W - bw) / 2, bw, G)}
      {hatch}
      <line x1="0" y1={G} x2={W} y2={G} style={S("none", "ink", 1.6)} />
    </svg>
  );
}
