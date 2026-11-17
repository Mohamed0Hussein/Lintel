import { useState } from "react";
import { REGIONS } from "../data/regions";
import { PageHead } from "../components/bits";
import { money } from "../lib/format";

export default function Sell() {
  const [v, setV] = useState({ addr: "", region: "port-aubel", type: "1.04", area: 110, cond: "1" });
  const [sent, setSent] = useState(false);
  const r = REGIONS[v.region], area = +v.area || 0;
  const est = r.ppm * area * +v.type * +v.cond, rent = r.rent * area;
  const up = (k) => (e) => setV({ ...v, [k]: e.target.value });
  return (
    <>
      <PageHead title="Sell or let with Lintel">Get an instant estimate now, then book a free valuation visit. One fee of 1.2% plus 20% SVT, charged only when the sale completes.</PageHead>
      <div className="wrap section split">
        <form className="panel form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <h2 className="h">Instant estimate</h2>
          <label className="f">Street address<input className="input" placeholder="e.g. 9 Bell Steps" autoComplete="street-address" value={v.addr} onChange={up("addr")} /></label>
          <div className="row2">
            <label className="f">Region<select className="input" value={v.region} onChange={up("region")}>{Object.entries(REGIONS).map(([k, x]) => <option key={k} value={k}>{x.name}</option>)}</select></label>
            <label className="f">Type<select className="input" value={v.type} onChange={up("type")}><option value="1">Apartment</option><option value="1.08">Townhouse</option><option value="1.04">House</option><option value="1.25">Villa</option><option value="0.95">Cottage</option></select></label>
          </div>
          <div className="row2">
            <label className="f">Floor area (m²)<input className="input num" type="number" min="20" max="2000" value={v.area} onChange={up("area")} /></label>
            <label className="f">Condition<select className="input" value={v.cond} onChange={up("cond")}><option value="0.85">Needs work</option><option value="1">Good</option><option value="1.12">Recently renovated</option></select></label>
          </div>
          <div className="estimate" aria-live="polite">
            <span>Estimated sale price</span><b>{money(est * 0.94)} – {money(est * 1.06)}</b>
            <span>Estimated rent {money(rent * 0.95)} – {money(rent * 1.05)} per month · Our fee on a sale at the midpoint: {money(est * 0.012 * 1.2)} incl. SVT</span>
          </div>
          <button className="btn" type="submit">Book a free valuation visit</button>
          {sent && <p className="ok"><b>Valuation request noted.</b> In this demo nothing is sent; on the live site a local agent would call within one working day.</p>}
        </form>
        <div style={{ display: "grid", gap: "2rem" }}>
          <div><div className="lintel" style={{ marginBottom: "1rem" }}><h2 className="h">Our fees, in full</h2></div>
            <div className="tbl-wrap"><table><thead><tr><th>Service</th><th className="r">Fee</th></tr></thead><tbody>
              <tr><td>Sale, full service<br /><span className="muted" style={{ fontSize: "var(--s-xs)" }}>Valuation, drawings, listing, viewings, negotiation</span></td><td className="r">1.2% + SVT</td></tr>
              <tr><td>Letting, find a tenant</td><td className="r">1 month's rent + SVT</td></tr>
              <tr><td>Letting, fully managed</td><td className="r">9% of rent + SVT</td></tr>
              <tr><td>Energy certificate</td><td className="r">SC 140</td></tr>
              <tr><td>Withdrawal fee</td><td className="r">None</td></tr>
            </tbody></table></div></div>
          <div><div className="lintel" style={{ marginBottom: "1rem" }}><h2 className="h">What happens next</h2></div>
            <ol className="steps">
              <li><b>We call you within one working day</b><span>to agree a time for the visit.</span></li>
              <li><b>Valuation visit, about 45 minutes</b><span>Your agent measures every room and checks the title.</span></li>
              <li><b>Written valuation within 48 hours</b><span>with three comparable sales from the registry.</span></li>
            </ol></div>
        </div>
      </div>
    </>
  );
}
