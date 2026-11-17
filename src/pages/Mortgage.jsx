import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DEALS } from "../data/deals";
import { useApp } from "../context/AppContext";
import { PageHead } from "../components/bits";
import { fmt, levy, money, PRICE_OPTIONS } from "../lib/format";

function calc(s) {
  const d = DEALS.find((x) => x.id === s.deal);
  const rate = (s.deal === "own" ? s.own : d.rate) / 100, r = rate / 12, n = s.term * 12;
  const depAmt = (s.price * s.dep) / 100, loan = s.price - depAmt;
  const m = r === 0 ? loan / n : s.io ? loan * r : (loan * r) / (1 - Math.pow(1 + r, -n));
  const total = s.io ? m * n + loan : m * n;
  const rs = (rate + 0.03) / 12, stress = s.io ? loan * rs : (loan * rs) / (1 - Math.pow(1 + rs, -n));
  const lv = levy(s.price, s.ftb), notary = s.price * 0.008, upfront = depAmt + lv + notary + 420 + d.fee;
  const income = (+s.inc1 || 0) + (+s.inc2 || 0);
  const yrs = [];
  let bal = loan;
  for (let y = 1; y <= s.term; y++) {
    let ip = 0, pp = 0;
    for (let k = 0; k < 12; k++) { const i = bal * r; ip += i; const p = s.io ? 0 : m - i; pp += p; bal -= p; }
    if (s.io && y === s.term) { pp += bal; bal = 0; }
    yrs.push({ y, ip, pp, bal: Math.max(0, bal) });
  }
  return { d, rate, depAmt, loan, m, total, interest: total - loan, stress, lv, notary, upfront, income, maxLoan: income * 4.5, monthlyInc: income / 12, yrs, ltv: (loan / s.price) * 100 };
}

function YearChart({ c }) {
  const W = 640, H = 230, pl = 52, pr = 10, pt = 12, pb = 26, ys = c.yrs, n = ys.length;
  const mx = Math.max(...ys.map((y) => y.ip + y.pp)) * 1.05, bw = (W - pl - pr) / n, Y = (v) => pt + (1 - v / mx) * (H - pt - pb);
  const step = mx > 200000 ? 100000 : mx > 60000 ? 20000 : mx > 20000 ? 5000 : 2000;
  const ticks = [];
  for (let v = 0; v <= mx; v += step) ticks.push(v);
  return (
    <svg className="mc-chart chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Yearly payments split into interest and loan paid off, over ${n} years`}>
      {ticks.map((v) => <g key={v}><line x1={pl} x2={W - pr} y1={Y(v)} y2={Y(v)} style={{ stroke: "var(--line)" }} /><text x={pl - 6} y={Y(v) + 4} textAnchor="end" style={{ fill: "var(--muted)" }}>{v >= 1000 ? Math.round(v / 1000) + "k" : v}</text></g>)}
      {ys.map((y, i) => {
        const x = pl + i * bw + bw * 0.15, w = Math.max(1, bw * 0.7);
        return (
          <g key={y.y}>
            <rect x={x} y={Y(y.ip)} width={w} height={Y(0) - Y(y.ip)} style={{ fill: "var(--ochre)" }}><title>Year {y.y}: interest {money(y.ip)}</title></rect>
            {y.pp > 0 && <rect x={x} y={Y(y.ip + y.pp)} width={w} height={Y(y.ip) - Y(y.ip + y.pp)} style={{ fill: "var(--accent)" }}><title>Year {y.y}: paid off {money(y.pp)}</title></rect>}
            {(y.y === 1 || y.y % 5 === 0) && <text x={x + w / 2} y={H - 8} textAnchor="middle" style={{ fill: "var(--muted)" }}>{y.y}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export default function Mortgage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setFilter } = useApp();
  const [s, setS] = useState(() => ({ price: 450000, dep: 20, deal: "cm10", own: 4.2, term: 25, io: false, ftb: false, inc1: 52000, inc2: 34000, ...(state || {}) }));
  const set = (patch) => setS((x) => ({ ...x, ...patch }));
  const c = useMemo(() => calc({ ...s, price: Math.max(1, s.price) }), [s]);
  const ratio = c.monthlyInc ? (c.m / c.monthlyInc) * 100 : 0, stressRatio = c.monthlyInc ? (c.stress / c.monthlyInc) * 100 : 0;
  let v = "ok", vt = "Likely to be within a lender's limits", vp = `You are borrowing ${money(c.loan)}, which is ${(c.loan / (c.income || 1)).toFixed(1)} times your income. Most Solvenne lenders lend up to 4.5 times.`;
  if (!c.income) { v = "warn"; vt = "Add your income to check affordability"; vp = "Lenders usually lend up to 4.5 times gross yearly income."; }
  else if (c.loan > c.maxLoan) { v = "bad"; vt = "Above what most lenders will offer"; vp = `Lenders usually lend up to 4.5 times income, which is ${money(c.maxLoan)} for you. You would need a deposit of about ${money(Math.max(0, s.price - c.maxLoan))}, or a home around ${money(c.maxLoan / (1 - s.dep / 100))}.`; }
  else if (stressRatio > 45) { v = "warn"; vt = "Tight under the lender's stress test"; vp = `If rates rose 3 points, your payment would be ${money(c.stress)} a month, ${Math.round(stressRatio)}% of your gross monthly income. Lenders get cautious above 45%.`; }
  const first = c.yrs[0], last = c.yrs[c.yrs.length - 1];
  const searchHomes = () => {
    const max = PRICE_OPTIONS.buy.find((o) => o >= s.price);
    setFilter("buy", { min: "", max: max ? String(max) : "" });
    navigate("/buy");
  };
  return (
    <>
      <PageHead title="Mortgage calculator">See what a home would cost you each month, how much cash you need on the day, and whether a lender is likely to agree. Figures use Solvenne's stamp levy bands and notary fees.</PageHead>
      <div className="wrap mc">
        <form className="panel mc-in" onSubmit={(e) => e.preventDefault()}>
          <fieldset><div className="mc-row"><label htmlFor="mc-price" className="eyebrow">Home price</label></div>
            <div className="prefix"><span>SC</span><input className="input" id="mc-price" type="number" inputMode="numeric" min="50000" max="5000000" step="5000" value={s.price} onChange={(e) => set({ price: Math.max(0, +e.target.value || 0) })} /></div>
            <input type="range" min="50000" max="3000000" step="5000" value={Math.min(s.price, 3000000)} aria-label="Home price slider" onChange={(e) => set({ price: +e.target.value })} /></fieldset>
          <fieldset><div className="mc-row"><label htmlFor="mc-dep" className="eyebrow">Deposit</label><output>{s.dep}% · {money(c.depAmt)}</output></div>
            <input type="range" id="mc-dep" min="10" max="80" step="1" value={s.dep} onChange={(e) => set({ dep: +e.target.value })} /></fieldset>
          <fieldset><legend className="eyebrow">Mortgage deal</legend><div className="deals">{DEALS.map((d) => (
            <label key={d.id} className="deal">
              <input type="radio" name="mc-deal" value={d.id} checked={s.deal === d.id} onChange={() => set({ deal: d.id })} />
              <b>{d.name}{d.term && <> · <span style={{ fontWeight: 400 }}>{d.term}</span></>}</b>
              {d.id === "own" ? <span className="prefix" style={{ width: "6.5rem" }}><input className="input" type="number" step="0.05" min="0" max="15" value={s.own} aria-label="Your interest rate, percent" style={{ paddingLeft: ".6rem", minHeight: 36 }} onChange={(e) => set({ own: +e.target.value || 0, deal: "own" })} /></span> : <span className="rt">{d.rate.toFixed(1)}%</span>}
              <small>{d.note}</small>
            </label>
          ))}</div></fieldset>
          <fieldset><div className="mc-row"><label htmlFor="mc-term" className="eyebrow">Term</label><output>{s.term} years</output></div>
            <input type="range" id="mc-term" min="5" max="35" step="1" value={s.term} onChange={(e) => set({ term: +e.target.value })} /></fieldset>
          <fieldset><legend className="eyebrow">Repayment type</legend><div className="seg">
            <button type="button" aria-pressed={!s.io} onClick={() => set({ io: false })}>Repayment</button>
            <button type="button" aria-pressed={s.io} onClick={() => set({ io: true })}>Interest only</button></div></fieldset>
          <label style={{ display: "flex", gap: ".55rem", alignItems: "center", fontWeight: 500 }}><input type="checkbox" checked={s.ftb} onChange={(e) => set({ ftb: e.target.checked })} style={{ accentColor: "var(--accent)", width: 18, height: 18 }} /> I'm a first-time buyer</label>
          <fieldset><legend className="eyebrow">Gross yearly income</legend><div className="row2">
            <div className="prefix"><span>SC</span><input className="input" type="number" min="0" step="1000" value={s.inc1 || ""} aria-label="Your gross yearly income" onChange={(e) => set({ inc1: +e.target.value || 0 })} /></div>
            <div className="prefix"><span>SC</span><input className="input" type="number" min="0" step="1000" value={s.inc2 || ""} placeholder="Second buyer" aria-label="Second buyer's gross yearly income" onChange={(e) => set({ inc2: +e.target.value || 0 })} /></div>
          </div></fieldset>
        </form>
        <div style={{ display: "grid", gap: "1.25rem", minWidth: 0 }}>
          <div className="mc-hero" aria-live="polite">
            <span>{s.io ? "Monthly interest payment" : "Monthly repayment"} · {c.d.id === "own" ? `your rate of ${(+s.own).toFixed(2)}%` : `${c.d.name}, ${c.d.rate.toFixed(1)}%`}</span>
            <span className="big">{money(c.m)}</span>
            <span>for {s.term} years on a loan of {money(c.loan)} ({c.ltv.toFixed(0)}% of the price)</span>
          </div>
          {c.ltv > 90 && <p className="muted" style={{ fontSize: "var(--s-xs)", color: "var(--danger)" }}>The listed deals lend up to 90% of the price. Increase the deposit to at least 10%.</p>}
          <div className="calc-out">
            <div><b>{money(c.upfront)}</b><span>Cash needed on completion</span></div>
            <div><b>{money(c.interest)}</b><span>Total interest over {s.term} years</span></div>
            <div><b>{money(c.total)}</b><span>Total repaid{s.io ? ", incl. loan at end" : ""}</span></div>
            <div><b>{money(c.stress)}</b><span>Monthly payment if rates rise 3 points</span></div>
          </div>
          <div className={`verdict ${v}`}>
            <span className="dot" /><b>{vt}</b><p>{vp}</p>
            {c.income > 0 && <>
              <div className="meter" title="Loan as a share of the 4.5 times income limit"><i style={{ width: `${Math.min(100, (c.loan / c.maxLoan) * 100)}%`, ...(c.loan > c.maxLoan ? { background: "var(--e-g)" } : {}) }} /></div>
              <p style={{ gridColumn: 2, fontSize: "var(--s-xs)" }}>{money(c.loan)} of {money(c.maxLoan)} maximum · payments {Math.round(ratio)}% of gross monthly income</p>
            </>}
          </div>
          <div className="panel" style={{ display: "grid", gap: ".75rem" }}>
            <h2 className="h" style={{ fontSize: "var(--s-lg)" }}>Where your payments go each year</h2>
            <YearChart c={c} />
            <div className="key"><span><i style={{ background: "var(--ochre)" }} />Interest</span>{!s.io && <span><i style={{ background: "var(--accent)" }} />Loan paid off</span>}<span>Year of the mortgage along the bottom</span></div>
            {s.io ? <p className="muted" style={{ fontSize: "var(--s-sm)" }}>With interest only, the {money(c.loan)} loan stays the same and must be repaid in full at the end of the term.</p>
              : <p className="muted" style={{ fontSize: "var(--s-sm)" }}>In year 1, {Math.round((first.ip / (first.ip + first.pp)) * 100)}% of what you pay is interest. By year {s.term}, it is {Math.round((last.ip / (last.ip + last.pp)) * 100)}%.</p>}
            <details className="yrs"><summary>Year-by-year breakdown</summary><div className="tbl-wrap"><table><thead><tr><th>Year</th><th className="r">Interest</th><th className="r">Paid off</th><th className="r">Still owed</th></tr></thead>
              <tbody>{c.yrs.map((y) => <tr key={y.y}><td>{y.y}</td><td className="r">{fmt(y.ip)}</td><td className="r">{fmt(y.pp)}</td><td className="r">{fmt(y.bal)}</td></tr>)}</tbody></table></div></details>
          </div>
          <div className="panel"><h2 className="h" style={{ fontSize: "var(--s-lg)", marginBottom: ".75rem" }}>Cash on completion day</h2>
            <div className="tbl-wrap" style={{ border: 0 }}><table><tbody>
              <tr><td>Deposit ({s.dep}%)</td><td className="r">{money(c.depAmt)}</td></tr>
              <tr><td>Stamp levy{s.ftb && s.price <= 400000 ? " (first-time buyer relief)" : ""}</td><td className="r">{money(c.lv)}</td></tr>
              <tr><td>Notary fee, 0.8%</td><td className="r">{money(c.notary)}</td></tr>
              <tr><td>Registry fee</td><td className="r">SC 420</td></tr>
              <tr><td>Lender's fee</td><td className="r">{money(c.d.fee)}</td></tr>
              <tr><td><b>Total</b></td><td className="r"><b>{money(c.upfront)}</b></td></tr>
            </tbody></table></div>
            {s.ftb && s.price > 400000 && s.price <= 440000 && <p className="muted" style={{ fontSize: "var(--s-xs)", marginTop: ".5rem" }}>First-time buyer relief stops at SC 400,000. At this price you pay the full levy; see <Link className="link" to="/blog/first-time-buyer-stamp-levy">our article on the cliff edge</Link>.</p>}
          </div>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}><button type="button" className="btn" onClick={searchHomes}>See homes up to {money(s.price)}</button><Link className="btn ghost" to="/contact">Talk to an agent</Link></div>
          <p className="muted" style={{ fontSize: "var(--s-xs)" }}>Illustrative only. Lintel is not a mortgage lender or adviser, and the deals shown are examples. Speak to a licensed mortgage adviser before you commit.</p>
        </div>
      </div>
    </>
  );
}
