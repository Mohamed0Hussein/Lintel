import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { XY, RLAB, TOWNS } from "../data/map";
import { REGIONS } from "../data/regions";
import { PH } from "../data/photos";
import { OFFICES } from "../data/agents";
import { shortPrice, money, fmt } from "../lib/format";
import { Photo } from "./Photo";
import { PriceText } from "./bits";

const MOUNTAINS = [[338, 150], [360, 134], [384, 144], [408, 124], [432, 140], [456, 128], [318, 164], [480, 146]];

/** The static country map: sea, coastline, islands, borders, river, lake, mountains, rail and ferry. */
export const MapBase = memo(function MapBase() {
  return (
    <g>
      <rect x="-400" y="-300" width="1600" height="1200" style={{ fill: "var(--sea)" }} />
      <polygon className="land" points="80,500 116,364 72,248 176,124 336,76 504,108 636,60 712,184 676,320 624,412 524,516 320,564 172,552" />
      <path className="isle" d="M732 476c14-8 32-2 34 12s-10 26-26 24-20-28-8-36z" />
      <path className="isle" d="M700 524c8-6 22-4 22 8s-12 16-20 12-8-14-2-20z" />
      <path className="isle" d="M760 532c6-4 16-2 16 6s-8 12-14 9-6-11-2-15z" />
      <path className="bd" d="M176 124 C220 210,254 260,250 300 S262 420,300 562" />
      <path className="bd" d="M250 300 C330 268,380 262,420 260 S520 250,600 80" />
      <path className="bd" d="M420 260 C440 330,476 380,470 430 S440 520,432 548" />
      <path className="river" d="M392 214 C370 280,340 320,360 366 S430 470,480 512" />
      <ellipse className="lake" cx="468" cy="198" rx="24" ry="10" />
      {MOUNTAINS.map(([x, y]) => <path key={x} className="mt" d={`M${x - 14} ${y + 12}L${x} ${y - 9}L${x + 14} ${y + 12}`} />)}
      <path className="rail" d="M600 392 Q480 404 362 362 T168 476" />
      <path className="ferry" d="M630 396 Q700 420 738 480" />
      <text className="sl" x="20" y="590">WESTERN SEA</text><text className="sl" x="640" y="36">NORTH STRAIT</text><text className="sl" x="690" y="440">FERRY</text>
      <g transform="translate(24 548)"><line x1="0" y1="0" x2="80" y2="0" style={{ stroke: "var(--ink)", strokeWidth: 2 }} /><line x1="0" y1="-4" x2="0" y2="4" style={{ stroke: "var(--ink)" }} /><line x1="80" y1="-4" x2="80" y2="4" style={{ stroke: "var(--ink)" }} /><text x="40" y="-7" textAnchor="middle" className="sl" style={{ letterSpacing: ".05em" }}>20 km</text></g>
      <g transform="translate(772 30)"><path d="M0 -14L6 6L0 2L-6 6Z" style={{ fill: "var(--ink)" }} /><text y="20" textAnchor="middle" className="sl" style={{ letterSpacing: 0 }}>N</text></g>
    </g>
  );
});

/** Keeps track of an element's rendered size. */
function useSize(ref) {
  const [size, setSize] = useState({ w: 600, h: 450 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width || 600, h: e.contentRect.height || 450 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export function ResultsMap({ list, hover, limit, setLimit, onBounds, showLimit }) {
  const wrapRef = useRef(), svgRef = useRef();
  const size = useSize(wrapRef);
  const A = size.h / size.w;
  const [vb, setVbRaw] = useState([0, 0, 800, 600]);
  const [sel, setSel] = useState(null);
  const drag = useRef(null), moved = useRef(false);

  const clampVb = useCallback(([x, y, w]) => {
    w = Math.max(150, Math.min(Math.max(800, 600 / A), w));
    const h = w * A;
    x = w > 880 ? 400 - w / 2 : Math.max(-40, Math.min(840 - w, x));
    y = h > 660 ? 300 - h / 2 : Math.max(-30, Math.min(630 - h, y));
    return [x, y, w, h];
  }, [A]);
  const setVb = useCallback((v) => setVbRaw(clampVb(v)), [clampVb]);

  const fit = useCallback(() => {
    const pts = list.map((l) => XY[l.id]).filter(Boolean);
    if (!pts.length) return setVb([0, 0, 800]);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const w = Math.max(x1 - x0 + 160, (y1 - y0 + 160) / A, 240);
    setVb([(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - (w * A) / 2, w]);
  }, [list, A, setVb]);

  const listKey = list.map((l) => l.id).sort().join(",");
  // Refit when the filtered set or the panel shape changes.
  useEffect(() => { fit(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [listKey, Math.round(A * 100)]);
  useEffect(() => { onBounds?.(vb); }, [vb, onBounds]);
  useEffect(() => { if (sel && !list.some((l) => l.id === sel)) setSel(null); }, [list, sel]);

  const zoomAt = useCallback((cx, cy, f) => setVbRaw((v) => clampVb([cx - (cx - v[0]) * f, cy - (cy - v[1]) * f, v[2] * f])), [clampVb]);

  // Wheel zoom needs a non-passive listener.
  useEffect(() => {
    const svg = svgRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const ctm = svg.getScreenCTM(); if (!ctm) return;
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      zoomAt(pt.x, pt.y, e.deltaY > 0 ? 1.18 : 1 / 1.18);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const k = vb[2] / size.w; // map units per screen pixel
  const clusters = useMemo(() => {
    const thr = 48 * k, cls = [];
    list.filter((l) => XY[l.id]).forEach((l) => {
      const [x, y] = XY[l.id];
      const c = cls.find((c) => Math.hypot(c.x - x, c.y - y) < thr);
      if (c) { c.items.push(l); const n = c.items.length; c.x = (c.x * (n - 1) + x) / n; c.y = (c.y * (n - 1) + y) / n; }
      else cls.push({ x, y, items: [l] });
    });
    const rank = (c) => (c.items.some((l) => l.id === sel || l.id === hover) ? 1 : 0);
    return cls.sort((a, b) => rank(a) - rank(b) || a.y - b.y);
  }, [list, k, sel, hover]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, vb, id: e.pointerId, s: size.w / vb[2] };
    moved.current = false;
  };
  const onPointerMove = (e) => {
    const d = drag.current; if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!moved.current && Math.hypot(dx, dy) < 5) return;
    if (!moved.current) { moved.current = true; try { svgRef.current.setPointerCapture(d.id); } catch { /* ignore */ } }
    setVb([d.vb[0] - dx / d.s, d.vb[1] - dy / d.s, d.vb[2]]);
  };
  const onPointerUp = () => { drag.current = null; setTimeout(() => { moved.current = false; }, 0); };
  const click = (fn) => (e) => { e.stopPropagation(); if (!moved.current) fn(); };
  const key = (fn) => (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } };

  const selL = sel && list.find((l) => l.id === sel);
  const [x, y, w, h] = vb;

  return (
    <div className="mapwrap" ref={wrapRef}>
      <svg ref={svgRef} className={`map-svg${drag.current && moved.current ? " dragging" : ""}`} viewBox={vb.join(" ")} preserveAspectRatio="xMidYMid slice"
        role="group" aria-label="Map of Solvenne. Price pins show homes that match your filters."
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        onClick={() => { if (!moved.current) setSel(null); }}>
        <MapBase />
        <g>
          {RLAB.map(([t, lx, ly]) => <text key={t} className="rl" textAnchor="middle" transform={`translate(${lx} ${ly}) scale(${k})`}>{t}</text>)}
          {TOWNS.filter((t) => k < 0.95 || t[3]).map(([n, tx, ty, c]) => (
            <g key={n} className="town" transform={`translate(${tx} ${ty}) scale(${k})`}><circle r={c ? 4 : 2.5} /><text y="16" textAnchor="middle">{n}</text></g>
          ))}
        </g>
        <g>
          {clusters.map((c) => {
            if (c.items.length > 1) {
              const go = () => zoomAt(c.x, c.y, 0.45);
              return (
                <g key={c.items.map((l) => l.id).join()} className="cl" tabIndex={0} role="button" aria-label={`${c.items.length} homes here. Zoom in`}
                  transform={`translate(${c.x} ${c.y}) scale(${k})`} onClick={click(go)} onKeyDown={key(go)}>
                  <circle r="17" /><text textAnchor="middle" dy="4">{c.items.length}</text>
                </g>
              );
            }
            const l = c.items[0], t = shortPrice(l), tw = t.length * 6.4 + 16, pick = () => setSel(l.id);
            return (
              <g key={l.id} className={`pin${l.mode === "rent" ? " rent" : ""}${l.id === sel ? " on" : ""}${l.id === hover ? " hl" : ""}`} tabIndex={0} role="button"
                aria-label={`${l.title}, ${l.mode === "rent" ? money(l.price) + " per month" : money(l.price)}`}
                transform={`translate(${c.x} ${c.y}) scale(${k})`} onClick={click(pick)} onKeyDown={key(pick)}>
                <path d="M-5 -9L0 0L5 -9Z" /><rect x={-tw / 2} y="-31" width={tw} height="22" rx="11" /><text textAnchor="middle" y="-16">{t}</text>
              </g>
            );
          })}
        </g>
      </svg>
      {showLimit && (
        <label className="map-area" htmlFor="map-limit"><input type="checkbox" id="map-limit" checked={limit} onChange={(e) => setLimit(e.target.checked)} /> Limit list to map area</label>
      )}
      <div className="map-ctrl">
        <button type="button" aria-label="Zoom in" onClick={() => zoomAt(x + w / 2, y + h / 2, 0.6)}>+</button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomAt(x + w / 2, y + h / 2, 1 / 0.6)}>−</button>
        <button type="button" aria-label="Show all results" title="Show all results" onClick={fit}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" style={{ stroke: "currentColor", strokeWidth: 1.6, fill: "none" }} /></svg>
        </button>
      </div>
      <div className="map-key"><span><i />For sale</span><span><i className="r" />To rent</span><span>Drag to move, scroll to zoom</span></div>
      {selL && (
        <div className="map-pop">
          {PH[selL.id] && <Photo id={PH[selL.id][0]} alt={selL.title} sizes="140px" />}
          <div className="b">
            <button className="x" aria-label="Close preview" onClick={() => setSel(null)}>✕</button>
            <div className="price"><PriceText l={selL} /></div>
            <h3>{selL.title}</h3>
            <p className="loc">{selL.district}, {REGIONS[selL.region].name}</p>
            <p className="loc" style={{ color: "var(--ink)" }}>{selL.type === "plot" ? `${fmt(selL.plot)} m² plot` : `${selL.beds || "Studio"}${selL.beds ? " bed" : ""} · ${selL.baths} bath · ${selL.area} m²`}</p>
            <Link className="link" to={`/listing/${selL.id}`} style={{ justifySelf: "start", marginTop: ".2rem" }}>View this home</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function inBounds(l, vb) {
  const p = XY[l.id], [x, y, w, h] = vb;
  return p && p[0] >= x && p[0] <= x + w && p[1] >= y && p[1] <= y + h;
}

/** Office map on the contact page. */
export function OfficeMap({ sel, setSel }) {
  const ref = useRef();
  const size = useSize(ref);
  const keys = Object.keys(OFFICES);
  const o = sel && OFFICES[sel];
  const vb = o ? [o.xy[0] - 170, o.xy[1] - 128, 340, 256] : [0, 0, 800, 600];
  const k = vb[2] / size.w;
  return (
    <div className="omap" ref={ref}>
      <svg id="omap" className="map-svg" viewBox={vb.join(" ")} preserveAspectRatio="xMidYMid slice" role="group" aria-label="Map of Solvenne showing Lintel's four offices">
        <MapBase />
        {keys.map((key, n) => {
          const f = OFFICES[key], on = sel === key, right = f.xy[0] > 650;
          const pick = () => setSel(on ? "" : key);
          return (
            <g key={key} className={`opin${on ? " on" : ""}`} tabIndex={0} role="button" aria-label={`${f.name} office`}
              transform={`translate(${f.xy[0]} ${f.xy[1]}) scale(${k})`} onClick={pick} onKeyDown={(e) => { if (e.key === "Enter") pick(); }}>
              <circle className="o" r="15" />
              <text textAnchor="middle" dy="4.5" style={{ font: "700 12px var(--mono)", fill: on ? "var(--accent-ink)" : "var(--accent)" }}>{n + 1}</text>
              <text className="lbl" x={right ? -22 : 22} dy="5" textAnchor={right ? "end" : "start"}>{f.name}</text>
            </g>
          );
        })}
      </svg>
      {sel && <button className="reset" type="button" onClick={() => setSel("")}>Show all offices</button>}
    </div>
  );
}
