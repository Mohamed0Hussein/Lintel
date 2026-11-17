import { Link } from "react-router-dom";
import { LISTINGS } from "../data/listings";
import { useApp } from "../context/AppContext";
import { Card, Epc, Logo, PageHead } from "../components/bits";
import { Photo } from "../components/Photo";
import Elevation from "../components/Elevation";

export function Saved() {
  const { saved } = useApp();
  const a = LISTINGS.filter((l) => saved.includes(l.id));
  return (
    <>
      <PageHead title="Saved homes">Homes you've saved on this device.</PageHead>
      <div className="wrap section">{a.length ? <div className="grid">{a.map((l) => <Card key={l.id} l={l} />)}</div> : (
        <div className="empty"><h3>No saved homes yet</h3><p className="muted">Tap the heart on any listing to keep it here.</p><Link className="btn" to="/buy">Browse homes for sale</Link></div>
      )}</div>
    </>
  );
}

export function Guides() {
  return (
    <>
      <PageHead title="Guides">The rules and costs of buying, renting and selling in Solvenne, written plainly.</PageHead>
      <div className="wrap section"><div className="guide">
        <details open><summary><h3>What it costs to buy a home</h3><span className="muted">5 min read</span></summary><div className="body">
          <p>On top of the price, buyers in Solvenne pay stamp levy to the Treasury, a notary to handle the transfer, and a fixed registry fee. Budget roughly 3–5% of the price. Our <Link className="link" to="/mortgage">mortgage calculator</Link> works it out for any price.</p>
          <div className="tbl-wrap"><table><thead><tr><th>Part of the price</th><th className="r">Stamp levy</th></tr></thead><tbody>
            <tr><td>Up to SC 250,000</td><td className="r">0%</td></tr><tr><td>SC 250,001 – 600,000</td><td className="r">2%</td></tr><tr><td>SC 600,001 – 1,200,000</td><td className="r">4%</td></tr><tr><td>Above SC 1,200,000</td><td className="r">6%</td></tr>
          </tbody></table></div>
          <ul><li>First-time buyers pay no stamp levy on homes up to SC 400,000.</li><li>Notary fee: 0.8% of the price, set by law.</li><li>Registry fee: SC 420, flat.</li><li>Building survey: SC 650 – 1,200, optional but recommended for homes built before 1950.</li></ul>
        </div></details>
        <details><summary><h3>Renting: your rights under the Tenancy Act 2019</h3><span className="muted">4 min read</span></summary><div className="body">
          <ul><li>Deposits are capped at two months' rent and must be lodged with the Deposit Bank of Solvenne within 10 days.</li><li>A holding fee may be no more than one week's rent, and is refunded or put towards the first month.</li><li>Rent can rise once a year, by no more than the consumer price index plus 1%.</li><li>Landlords must give 60 days' notice; tenants give 30.</li><li>Agents may not charge tenants any fee beyond rent, deposit and holding fee.</li></ul>
        </div></details>
        <details><summary><h3>How to read a Lintel listing</h3><span className="muted">3 min read</span></summary><div className="body">
          <ul><li><b>Title number</b> (e.g. <span className="mono">SLR-PA-01042</span>): the home's record at the National Land Registry. Two letters for the region, then the parcel number.</li><li><b>Floor area</b> is internal, measured to the SPA 2014 standard: wall to wall, excluding balconies and cellars.</li><li><b>Energy rating</b> runs A to G, in kWh per m² per year. From 2028, homes rated F or G cannot be newly let.</li><li><b>Tenure</b>: freehold, or leasehold with the years remaining. Leases under 80 years are harder to mortgage.</li><li><b>Elevation drawing</b>: every Lintel listing carries a drawn front elevation, made by our surveyors from the measured visit.</li></ul>
        </div></details>
        <details><summary><h3>Selling: preparing your home</h3><span className="muted">4 min read</span></summary><div className="body">
          <ul><li>Have your energy certificate ready; we can arrange one for SC 140.</li><li>Find your title deeds or notary's copy. We can request it from the registry if needed.</li><li>Fix small faults before the valuation visit; dripping taps and blown bulbs lower offers more than they cost.</li></ul>
        </div></details>
      </div></div>
    </>
  );
}

const SWATCHES = [["bg", "Limestone", "Page ground", "#E4EDE9", "#09110F"], ["surface", "Paper", "Solid text on dark", "#FFFFFF", "#15201E"], ["ink", "Harbour ink", "Text, line work", "#13201E", "#E5ECE8"], ["accent", "Quay green", "Actions, lintel bar", "#1D5A51", "#72B9AB"], ["ochre", "Survey ochre", "Status, price changes", "#9C6410", "#E2AA55"], ["glass", "Window glass", "Drawings only", "#A9C3BE", "#3F6964"]];
const PATTERNS = [
  ["Search above the fold: location, type, price, beds", "Home page, floating over the hero photo"],
  ["Persistent filter sidebar on desktop, collapsed with a count badge on phones", "Buy, Rent, New homes"],
  ["List and map views of results", "Toggle on every results page, with price pins and clusters"],
  ["Card shows price, place and key facts without opening it", "Every listing card"],
  ["Save to shortlist from the card", "Heart button, Saved page"],
  ["Sticky agent contact beside the listing", "Listing page sidebar"],
  ["Cost calculators next to the price", "Listing costs and the mortgage calculator"],
  ["Full-bleed, photo-led presentation with minimal chrome", "Home hero, featured-home band, listing gallery with full-screen viewer"],
];

export function Brand() {
  return (
    <>
      <PageHead title="Lintel brand book">A lintel is the beam over a doorway. Every home you walk into passes under one. The brand uses that beam as its mark and its one recurring device.</PageHead>
      <div className="wrap section" style={{ display: "grid", gap: "3.5rem" }}>
        <section className="split"><div className="lintel"><h2 className="h">Mark</h2><p className="muted">Two posts and a beam: a doorway seen face-on. The beam is always Quay green, the posts always ink. Minimum size 24 px wide. Clear space equals the beam's height on every side.</p></div>
          <div className="panel" style={{ display: "flex", gap: "2.5rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center", paddingBlock: "2.5rem" }}>
            <span style={{ width: 120, display: "block" }}><Logo /></span>
            <span className="brand" style={{ transform: "scale(1.4)" }}><Logo /><span><b>Lintel</b><small>Homes of Solvenne</small></span></span>
          </div></section>
        <section><div className="lintel" style={{ marginBottom: "1.25rem" }}><h2 className="h">Colour</h2><p className="muted">Cool limestone neutrals tinted toward the green, one action colour, one status colour. Every colour has a dark-theme pair.</p></div>
          <div className="swatches">{SWATCHES.map(([t, n, u, lh, dh]) => <div key={t} className="swatch"><i style={{ background: `var(--${t})` }} /><div><b>{n}</b><span className="muted">{u}</span><span className="mono">{lh} / {dh}</span></div></div>)}</div>
          <div style={{ display: "flex", gap: ".35rem", marginTop: "1rem", flexWrap: "wrap", alignItems: "center" }}><span className="muted" style={{ fontSize: "var(--s-xs)", marginRight: ".5rem" }}>Energy scale (fixed in both themes)</span>{["A", "B", "C", "D", "E", "F", "G"].map((e) => <Epc key={e} e={e} />)}</div></section>
        <section className="split"><div className="lintel"><h2 className="h">Glass</h2><p className="muted">Every surface is frosted glass over a slow field of colour: Quay green, survey ochre and sea blue, blurred until they read as light rather than shapes. Glass panels are 56% paper with an 18px blur and a bright one-pixel edge; form fields are slightly more solid so text stays crisp. Over photographs, glass is clear and lightly tinted. Results that matter most, such as a monthly repayment, sit on tinted green glass. Corners are 20px on panels and 12px on controls.</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: ".75rem" }}>
            <div className="glass" style={{ padding: "1rem", display: "grid", gap: ".3rem", minHeight: 120 }}><b>Panel</b><span className="muted" style={{ fontSize: "var(--s-xs)" }}>56% · blur 18px</span></div>
            <div className="glass" style={{ padding: "1rem", display: "grid", gap: ".3rem", background: "var(--glass-input)" }}><b>Field</b><span className="muted" style={{ fontSize: "var(--s-xs)" }}>68% · blur 8px</span></div>
            <div className="glass" style={{ padding: "1rem", display: "grid", gap: ".3rem", background: "var(--tint)", color: "var(--on-photo)" }}><b>Tinted</b><span style={{ fontSize: "var(--s-xs)", opacity: 0.8 }}>Quay green 90%</span></div>
          </div></section>
        <section><div className="lintel" style={{ marginBottom: "1.25rem" }}><h2 className="h">Type</h2><p className="muted">Bricolage Grotesque for headlines and prices: narrow, slightly architectural, confident at large sizes. Public Sans for reading: it was designed for public-service sites and stays clear at small sizes. IBM Plex Mono for registry numbers, data and codes.</p></div>
          <div className="type-spec">
            <div><span className="meta">Display · 76/72 · 700</span><span style={{ fontFamily: "var(--display)", fontSize: "var(--s-3xl)", fontWeight: 700, letterSpacing: "-.035em", lineHeight: 1 }}>Quay Row</span></div>
            <div><span className="meta">H2 · 44 · 650</span><span style={{ fontFamily: "var(--display)", fontSize: "var(--s-2xl)", fontWeight: 650 }}>Five regions, five markets</span></div>
            <div><span className="meta">Price · 22 · 650</span><span className="price">SC 1,385,000</span></div>
            <div><span className="meta">Body · 17/27 · 400</span><span style={{ fontSize: "var(--s-md)" }}>A third-floor flat in a 1931 shipping-office conversion, looking straight down the harbour.</span></div>
            <div><span className="meta">Label · 13 · 600 · +12%</span><span className="eyebrow">Capital &amp; harbour</span></div>
            <div><span className="meta">Data · Plex Mono 14</span><span className="mono" style={{ fontSize: ".9rem" }}>SLR-PA-01042 · 84 m² · 1931</span></div>
          </div></section>
        <section className="split"><div className="lintel"><h2 className="h">Photography, then drawing</h2><p className="muted">Every listing leads with a full-width photograph shot in daylight or at dusk, level verticals, no wide-angle distortion, no people. Exteriors first, then living spaces. Crops are always 3:2. After the photos comes the surveyor's front elevation: flat line work, ink outlines, four wall tints. It makes homes comparable at a glance and stays the brand's own.</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "3/2" }}><Photo id={28} alt="Example listing photograph: white modern house with pool" sizes="300px" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
            <div className="hero-draw" style={{ margin: 0, aspectRatio: "3/2" }}><Elevation listing={{ id: "brand", type: "townhouse", title: "Sample townhouse" }} vb={[360, 240]} /></div>
          </div></section>
        <section><div className="lintel" style={{ marginBottom: "1.25rem" }}><h2 className="h">Components</h2></div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link className="btn" to="/sell">Primary action</Link><Link className="btn ghost" to="/guides">Secondary</Link>
            <span className="tag" style={{ position: "static" }}>New listing</span><span className="tag ochre" style={{ position: "static" }}>Reduced</span><span className="tag green" style={{ position: "static" }}>Off-plan</span>
            <button className="chip" aria-pressed="true">3+</button><button className="chip" aria-pressed="false">Any</button>
          </div>
          <div className="grid" style={{ marginTop: "1.5rem", maxWidth: 340 }}><Card l={LISTINGS[0]} /></div></section>
        <section><div className="lintel" style={{ marginBottom: "1.25rem" }}><h2 className="h">Voice</h2><p className="muted">Write like a good local agent talking to a friend: specific, plain, honest about faults.</p></div>
          <div className="do-dont">
            <div className="panel"><h3>We write</h3><ul><li>"Kitchen and bathroom need updating."</li><li>"Tram stop 1 minute."</li><li>"84 m², measured to SPA standard."</li><li>"Ines usually replies within one working day."</li></ul></div>
            <div className="panel"><h3>We avoid</h3><ul><li>"Charming fixer-upper bursting with potential."</li><li>"Superbly connected."</li><li>"Generous proportions throughout."</li><li>"Act fast! Won't last!"</li></ul></div>
          </div></section>
        <section><div className="lintel" style={{ marginBottom: "1.25rem" }}><h2 className="h">Patterns taken from the market</h2><p className="muted">Conventions the leading property portals share, which buyers already know how to use.</p></div>
          <div className="tbl-wrap"><table><thead><tr><th>Pattern</th><th>Where it lives on Lintel</th></tr></thead><tbody>{PATTERNS.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div></section>
      </div>
    </>
  );
}
