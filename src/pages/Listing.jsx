import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LISTINGS } from "../data/listings";
import { REGIONS } from "../data/regions";
import { AGENTS } from "../data/agents";
import { PH } from "../data/photos";
import { useApp } from "../context/AppContext";
import { Card, LinkButton, PriceText, SectionHead } from "../components/bits";
import { Photo, Portrait } from "../components/Photo";
import Elevation from "../components/Elevation";
import { fmt, levy, money, regNo, typeLabel } from "../lib/format";
import NotFound from "./NotFound";

const SCALE = ["A", "B", "C", "D", "E", "F", "G"];
const BANDS = ["≤ 50", "51–90", "91–150", "151–230", "231–330", "331–450", "> 450"];

export const listingViewerItems = (l) =>
  (PH[l.id] || []).map((n, k) => ({ n, cap: k ? "Interior" : "Exterior" })).concat([{ draw: l, cap: "Front elevation, not to scale" }]);

function Gallery({ l }) {
  const { openViewer } = useApp();
  const items = listingViewerItems(l), shown = items.slice(0, 3);
  return (
    <div className="gallery">
      {shown.map((x, k) => (
        <button key={k} className={shown.length === 2 && k === 1 ? "wide" : undefined} aria-label={`Open photo ${k + 1} of ${items.length}`} onClick={() => openViewer(l.title, items, k)}>
          {x.draw ? <span className="g-draw" style={{ display: "block", height: "100%" }}><Elevation listing={l} vb={[480, 300]} /></span>
            : <Photo id={x.n} alt={(k ? "Interior of " : "") + l.title} sizes={k === 0 ? "(max-width:700px) 100vw, 66vw" : "(max-width:700px) 50vw, 33vw"} eager={k === 0} />}
          {k === shown.length - 1 && <span className="g-label">View all {items.length}</span>}
        </button>
      ))}
    </div>
  );
}

function SaleCosts({ l }) {
  const navigate = useNavigate();
  const [dep, setDep] = useState(20), [rate, setRate] = useState(3.9), [term, setTerm] = useState(25), [first, setFirst] = useState(false);
  const r = rate / 100 / 12, n = term * 12, loan = l.price * (1 - dep / 100);
  const m = (loan * r) / (1 - Math.pow(1 + r, -n)), lv = levy(l.price, first), notary = l.price * 0.008;
  return (
    <div className="calc">
      <div className="lintel"><h2 className="h">What it will cost you</h2></div>
      <div className="row2" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
        <label className="f">Deposit <span className="num" style={{ textTransform: "none", letterSpacing: 0, color: "var(--ink)" }}>{dep}% · {money(l.price * dep / 100)}</span><input type="range" min="10" max="60" step="5" value={dep} onChange={(e) => setDep(+e.target.value)} /></label>
        <label className="f">Interest rate<select className="input" value={rate} onChange={(e) => setRate(+e.target.value)}><option value="3.4">3.4% fixed 5 yrs</option><option value="3.9">3.9% fixed 10 yrs</option><option value="4.6">4.6% variable</option></select></label>
        <label className="f">Term<select className="input" value={term} onChange={(e) => setTerm(+e.target.value)}><option>20</option><option>25</option><option>30</option></select></label>
        <label className="f" style={{ alignSelf: "end", display: "flex", gap: ".5rem", alignItems: "center", minHeight: 44 }}><input type="checkbox" checked={first} onChange={(e) => setFirst(e.target.checked)} /> First-time buyer</label>
      </div>
      <div className="calc-out">
        <div><b>{money(m)}</b><span>Monthly repayment</span></div>
        <div><b>{money(lv)}</b><span>Stamp levy</span></div>
        <div><b>{money(notary + 420)}</b><span>Notary &amp; registry</span></div>
        <div><b>{money(l.price * dep / 100 + lv + notary + 420)}</b><span>Cash needed upfront</span></div>
      </div>
      <p className="muted" style={{ fontSize: "var(--s-xs)" }}>Stamp levy bands: 0% to SC 250,000, 2% to 600,000, 4% to 1.2 million, 6% above. First-time buyers pay none on homes up to SC 400,000. Notary fee 0.8%, registry fee SC 420. Illustrative only, not mortgage advice.</p>
      <LinkButton onClick={() => navigate("/mortgage", { state: { price: l.price, dep, ftb: first } })} style={{ justifySelf: "start", background: "none", borderTop: 0, borderLeft: 0, borderRight: 0, padding: 0, cursor: "pointer", font: "inherit", fontWeight: 600 }}>Open the full mortgage calculator with this price</LinkButton>
    </div>
  );
}

const RentCosts = ({ l }) => (
  <div className="calc">
    <div className="lintel"><h2 className="h">Moving-in costs</h2></div>
    <div className="calc-out">
      <div><b>{money(l.price)}</b><span>First month's rent</span></div>
      <div><b>{money(l.price * 2)}</b><span>Deposit (2 months, legal maximum)</span></div>
      <div><b>{money((l.price * 12) / 52)}</b><span>Holding fee, 1 week, refundable</span></div>
      <div><b>{money(l.price * 3 + (l.price * 12) / 52)}</b><span>Total before you move in</span></div>
    </div>
    <p className="muted" style={{ fontSize: "var(--s-xs)" }}>Under the Tenancy Act 2019 agents may not charge tenants any other fee. Your deposit is held by the Deposit Bank of Solvenne, not by the landlord.</p>
  </div>
);

function ViewingForm({ agent }) {
  const [sent, setSent] = useState(null);
  const [name, setName] = useState(""), [contact, setContact] = useState(""), [day, setDay] = useState("Weekday morning");
  if (sent) return <p className="ok"><b>Request noted, {sent}.</b> In this demo nothing is sent; on the live site your agent would call or email to confirm a time.</p>;
  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(name.split(" ")[0]); }}>
      <label className="f">Your name<input className="input" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="f">Email or phone<input className="input" required value={contact} onChange={(e) => setContact(e.target.value)} /></label>
      <label className="f">Preferred day<select className="input" value={day} onChange={(e) => setDay(e.target.value)}><option>Weekday morning</option><option>Weekday evening</option><option>Saturday</option></select></label>
      <button className="btn block" type="submit">Request a viewing</button>
      <p className="muted" style={{ fontSize: "var(--s-xs)" }}>{agent.name.split(" ")[0]} usually replies within one working day. Agent licence {agent.lic}.</p>
    </form>
  );
}

export default function Listing() {
  const { id } = useParams();
  const { saved, toggleSaved } = useApp();
  const l = LISTINGS.find((x) => x.id === id);
  if (!l) return <NotFound what="This listing is no longer available" />;
  const R = REGIONS[l.region], A = AGENTS[l.agent], sale = l.mode === "sale";
  const back = sale ? (l.isNew ? "new-homes" : "buy") : "rent";
  const facts = l.type === "plot"
    ? [["Plot", fmt(l.plot) + " m²"], ["Consent", "House up to 220 m²"], ["Tenure", l.tenure], ["Price per m²", money(l.price / l.plot)]]
    : [["Bedrooms", l.beds || "Studio"], ["Bathrooms", l.baths], ["Floor area", l.area + " m²"], ["Plot", l.plot ? fmt(l.plot) + " m²" : "None"], ["Built", l.year], ["Type", typeLabel(l.type)],
       [sale ? "Tenure" : "Furnishing", sale ? l.tenure : l.feats.find((x) => /furnished/i.test(x)) || "Ask agent"], [sale ? "Price per m²" : "Rent per m²", sale ? money(l.price / l.area) : "SC " + (l.price / l.area).toFixed(1)]];
  const similar = LISTINGS.filter((x) => x.id !== l.id && x.mode === l.mode && (x.region === l.region || x.type === l.type)).slice(0, 3);
  const on = saved.includes(l.id);
  return (
    <div className="wrap" style={{ paddingTop: "1.5rem" }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>/<Link to={"/" + back}>{back === "rent" ? "To rent" : back === "new-homes" ? "New homes" : "For sale"}</Link>/<span>{R.name}</span>/<span>{l.district}</span></nav>
      <div className="detail-head">
        <div><span className="eyebrow">{l.district}, {R.name}{l.status ? " · " + l.status : ""}</span><h1 style={{ marginTop: ".4rem" }}>{l.title}</h1></div>
        <div style={{ display: "grid", gap: ".5rem", justifyItems: "end" }}><div className="price"><PriceText l={l} /></div>{sale && <span className="muted" style={{ fontSize: "var(--s-xs)" }}>Stamp levy from {money(levy(l.price))}</span>}</div>
      </div>
      <Gallery l={l} />
      <div className="detail">
        <div>
          <dl className="keyfacts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <div className="prose"><p>{l.desc}</p><p className="muted">{R.blurb}</p></div>
          <div><div className="lintel" style={{ marginBottom: "1rem" }}><h2 className="h">Features</h2></div><ul className="feat-list">{l.feats.map((x) => <li key={x}>{x}</li>)}</ul></div>
          {l.epc && (
            <div><div className="lintel" style={{ marginBottom: "1rem" }}><h2 className="h">Energy rating</h2></div>
              <div className="energy">{SCALE.map((e, i) => (
                <div key={e}><span className="bar" style={{ width: `${38 + i * 9}%`, background: `var(--e-${e.toLowerCase()})` }}>{BANDS[i]} <b>{e}</b></span>{e === l.epc && <span className="here">◀ This home</span>}</div>
              ))}</div>
              <p className="muted" style={{ fontSize: "var(--s-xs)", marginTop: ".5rem" }}>kWh per m² per year. Certificate issued by the Solvenne Energy Office.</p></div>
          )}
          {sale ? <SaleCosts l={l} /> : <RentCosts l={l} />}
          <div><div className="lintel" style={{ marginBottom: "1rem" }}><h2 className="h">Registry record</h2></div>
            <dl className="registry"><dt>Title number</dt><dd className="mono">{regNo(l)}</dd><dt>Checked</dt><dd>{l.added <= 1 ? "Today" : l.added + " days ago"} against the National Land Registry</dd>
              <dt>Measured</dt><dd>{l.area ? l.area + " m² internal, SPA standard 2014" : "Plot surveyed, boundary pegged"}</dd><dt>Charges</dt><dd>None registered</dd></dl></div>
        </div>
        <aside className="aside">
          <div className="panel" style={{ display: "grid", gap: "1rem" }}>
            <div className="agent">
              <Link className="avatar" to={`/agent/${A.slug}`} aria-hidden="true" tabIndex={-1}><Portrait i={l.agent} sizes="52px" /></Link>
              <div><Link to={`/agent/${A.slug}`} style={{ textDecoration: "none" }}><b>{A.name}</b></Link>
                <div className="muted" style={{ fontSize: "var(--s-xs)" }}>{A.role}</div><div className="muted" style={{ fontSize: "var(--s-xs)" }}>{A.office}</div>
                <div className="mono" style={{ marginTop: ".2rem", userSelect: "all" }}>{A.phone}</div></div>
            </div>
            <ViewingForm agent={A} />
          </div>
          <button className="btn ghost block" aria-pressed={on} onClick={() => toggleSaved(l.id)}>{on ? "Saved" : "Save this home"}</button>
        </aside>
      </div>
      {similar.length > 0 && (
        <section style={{ paddingBottom: "3rem" }}><SectionHead title="Similar homes" small /><div className="grid">{similar.map((x) => <Card key={x.id} l={x} />)}</div></section>
      )}
    </div>
  );
}
