import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LISTINGS } from "../data/listings";
import { REGIONS } from "../data/regions";
import { RIMG } from "../data/photos";
import { useApp } from "../context/AppContext";
import { Card, SectionHead, Stats } from "../components/bits";
import { Photo } from "../components/Photo";
import MarketChart from "../components/MarketChart";
import { fmt, money, PRICE_OPTIONS } from "../lib/format";

const FEATURED = ["lc2090", "pa1107", "ki5008", "pa1188", "mv4019", "lc2077"];
const TYPES = [["apartment", "Apartment"], ["townhouse", "Townhouse"], ["house", "House"], ["villa", "Villa"], ["cottage", "Cottage"], ["plot", "Building plot"]];

export default function Home() {
  const { setFilter } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState("buy");
  const [q, setQ] = useState({ region: "", type: "", max: "", beds: 0 });
  const submit = (e) => {
    e.preventDefault();
    setFilter(mode, { region: q.region, type: q.type, max: q.max, beds: +q.beds });
    navigate("/" + mode);
  };
  const tab = (m, label) => (
    <button type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setQ((s) => ({ ...s, max: "" })); }}>{label}</button>
  );
  return (
    <>
      <section className="photo-hero">
        <Photo id={24} alt="Timber-clad house with lit glass walls under a large elm at dusk" sizes="100vw" className="hero-img" eager />
        <div className="shade" />
        <div className="wrap hero-inner">
          <div className="lintel"><Link className="eyebrow" to="/about" style={{ textDecoration: "none" }}>Solvenne's home agency since 1987</Link><h1>Every door in Solvenne, <em>checked before you knock.</em></h1></div>
          <div>
            <p className="hero-lede">Homes to buy and rent from Port Aubel's harbour to the Kestrel Isles. Every listing is verified against the National Land Registry, measured to the SPA standard and priced in crowns.</p>
            <Link className="pictured" to="/listing/lc2090">Pictured: Timber-clad house, Merren Bay · SC 1,940,000 →</Link>
          </div>
        </div>
      </section>
      <section>
        <div className="search"><div className="wrap"><div className="search-card">
          <div className="search-tabs" role="tablist" aria-label="Search type">{tab("buy", "Buy")}{tab("rent", "Rent")}{tab("new-homes", "New homes")}</div>
          <form className="search-row" onSubmit={submit}>
            <label className="f wide">Region<select className="input" value={q.region} onChange={(e) => setQ({ ...q, region: e.target.value })}><option value="">All of Solvenne</option>{Object.entries(REGIONS).map(([k, r]) => <option key={k} value={k}>{r.name}</option>)}</select></label>
            <label className="f">Property type<select className="input" value={q.type} onChange={(e) => setQ({ ...q, type: e.target.value })}><option value="">Any type</option>{TYPES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
            <label className="f">Max price<select className="input" value={q.max} onChange={(e) => setQ({ ...q, max: e.target.value })}><option value="">No max</option>{PRICE_OPTIONS[mode === "rent" ? "rent" : "buy"].map((n) => <option key={n} value={n}>{money(n)}{mode === "rent" ? " /mo" : ""}</option>)}</select></label>
            <label className="f">Bedrooms<select className="input" value={q.beds} onChange={(e) => setQ({ ...q, beds: e.target.value })}><option value="0">Any</option>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}</select></label>
            <button className="btn" type="submit">Search homes</button>
          </form>
          <p style={{ marginTop: ".75rem", fontSize: "var(--s-sm)" }}><Link className="link" to="/mortgage">Work out what you can borrow</Link> <span className="muted">· monthly payments, stamp levy and cash needed on the day</span></p>
        </div></div></div>
      </section>
      <Stats items={[["4,812", "homes listed today"], ["23 days", "median time to sale offer"], ["98.6%", "of asking price achieved, 2025"], ["5", "regions, 4 offices"]]} />

      <section className="section"><div className="wrap">
        <SectionHead title="New this week"><Link className="link" to="/buy">See all homes for sale</Link></SectionHead>
        <div className="grid g3">{FEATURED.map((id) => <Card key={id} l={LISTINGS.find((l) => l.id === id)} />)}</div>
      </div></section>

      <section className="band">
        <Photo id={18} alt="White clifftop villa with an infinity pool above Merren Bay" sizes="100vw" />
        <div className="shade" />
        <div className="wrap" style={{ position: "relative", width: "100%" }}><div className="band-card">
          <div className="lintel"><span className="eyebrow">Featured home · Lisle Coast</span><h2>Clifftop villa above Merren Bay</h2></div>
          <p style={{ opacity: 0.9 }}>Five bedrooms on one level, a 12 m pool and a private path down to the beach. Reduced by SC 160,000 this month.</p>
          <div className="price">SC 2,240,000</div>
          <div><Link className="btn light" to="/listing/lc2011">View this home</Link></div>
        </div></div>
      </section>

      <section className="section"><div className="wrap">
        <SectionHead title="Five regions, five markets"><Link className="link" to="/regions">Compare regions</Link></SectionHead>
        <div className="regions">{Object.entries(REGIONS).map(([k, r]) => (
          <Link key={k} className="region" to={`/region/${k}`}>
            <Photo id={RIMG[k]} alt={`${r.name}, ${r.kind}`} sizes="(max-width:520px) 100vw, (max-width:980px) 50vw, 240px" className="region-img" />
            <span className="eyebrow">{r.kind}</span><h3>{r.name}</h3>
            <dl><dt>Price per m²</dt><dd>SC {fmt(r.ppm)}</dd><dt>Gross yield</dt><dd>{r.yield}%</dd><dt>Listings</dt><dd>{fmt(r.count)}</dd></dl>
          </Link>
        ))}</div>
      </div></section>

      <section className="section" data-band=""><div className="wrap split">
        <div className="lintel"><span className="eyebrow">Selling with Lintel</span><h2 style={{ fontSize: "var(--s-2xl)" }}>From valuation to keys in five steps</h2>
          <p className="muted" style={{ maxWidth: "46ch", marginTop: ".5rem" }}>One fixed fee of 1.2% plus SVT, paid only on completion. Your agent stays with you from the first visit to the notary's office.</p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: "1rem" }}><Link className="btn" to="/sell">Get a free valuation</Link><Link className="btn ghost" to="/guides">Read the seller's guide</Link></div></div>
        <ol className="steps">
          <li><b>Valuation visit</b><span>An agent measures the home to the SPA standard and gives a written price range within 48 hours.</span></li>
          <li><b>Registry check</b><span>We pull the title from the National Land Registry and resolve any boundary or lease questions before listing.</span></li>
          <li><b>Drawings and listing</b><span>Floor plans, an elevation drawing and the energy certificate go live on Lintel and the national portals.</span></li>
          <li><b>Viewings and offers</b><span>We host every viewing and send offers to you in writing, with proof of funds attached.</span></li>
          <li><b>Notary and completion</b><span>The notary registers the sale. Typical time from accepted offer to keys: 9 weeks.</span></li>
        </ol>
      </div></section>

      <section className="section"><div className="wrap split">
        <div className="lintel"><span className="eyebrow">Lintel Market Index</span><h2 style={{ fontSize: "var(--s-2xl)" }}>Asking prices are up 9.3% nationally in two years</h2>
          <p className="muted" style={{ maxWidth: "46ch", marginTop: ".5rem" }}>Median asking price per square metre of internal floor area, all property types, by quarter. Port Aubel is still 60% above the national median, but the gap has narrowed since 2024.</p></div>
        <div className="panel"><MarketChart /><p className="muted" style={{ fontSize: "var(--s-xs)", marginTop: ".5rem" }}>SC per m². Source: Lintel listings, Q4 2024 to Q3 2026 (illustrative). <Link className="link" to="/blog/q3-2026-market-report">Read the Q3 report</Link></p></div>
      </div></section>
    </>
  );
}
