import { fmt } from "../lib/format";

const Q = ["Q4 24", "Q1 25", "Q2 25", "Q3 25", "Q4 25", "Q1 26", "Q2 26", "Q3 26"];
const NAT = [3880, 3920, 3990, 4010, 4070, 4150, 4190, 4240];
const CAP = [6410, 6460, 6550, 6590, 6640, 6720, 6760, 6800];

export default function MarketChart() {
  const cw = 560, ch = 240, pl = 48, pr = 96, pt = 16, pb = 30, y0 = 3500, y1 = 7000;
  const X = (i) => pl + (i * (cw - pl - pr)) / (Q.length - 1);
  const Y = (v) => pt + (1 - (v - y0) / (y1 - y0)) * (ch - pt - pb);
  const series = (d, c) => (
    <g key={c}>
      <polyline points={d.map((v, i) => `${X(i)},${Y(v)}`).join(" ")} style={{ fill: "none", stroke: `var(--${c})`, strokeWidth: 2.5, strokeLinejoin: "round" }} />
      <circle cx={X(d.length - 1)} cy={Y(d[d.length - 1])} r="4.5" style={{ fill: `var(--${c})` }} />
    </g>
  );
  return (
    <svg className="chart" viewBox={`0 0 ${cw} ${ch}`} role="img" aria-label="Asking price per square metre, Q4 2024 to Q3 2026. Port Aubel rose from 6,410 to 6,800 SC; national median rose from 3,880 to 4,240 SC.">
      {[3500, 4500, 5500, 6500].map((v) => (
        <g key={v}><line x1={pl} x2={cw - pr} y1={Y(v)} y2={Y(v)} style={{ stroke: "var(--line)", strokeWidth: 1 }} />
          <text x={pl - 8} y={Y(v) + 4} textAnchor="end" style={{ fill: "var(--muted)" }}>{fmt(v)}</text></g>
      ))}
      {Q.map((t, i) => (i % 2 === 0 || i === Q.length - 1 ? <text key={t} x={X(i)} y={ch - 8} textAnchor="middle" style={{ fill: "var(--muted)" }}>{t}</text> : null))}
      {series(CAP, "accent")}{series(NAT, "ochre")}
      <text x={X(7) + 10} y={Y(6800) + 4} style={{ fill: "var(--accent)", fontWeight: 500 }}>Port Aubel</text>
      <text x={X(7) + 10} y={Y(6800) + 18} style={{ fill: "var(--muted)" }}>6,800</text>
      <text x={X(7) + 10} y={Y(4240) + 4} style={{ fill: "var(--ochre)", fontWeight: 500 }}>National</text>
      <text x={X(7) + 10} y={Y(4240) + 18} style={{ fill: "var(--muted)" }}>4,240</text>
    </svg>
  );
}
