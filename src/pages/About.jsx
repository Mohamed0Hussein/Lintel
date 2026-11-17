import { Link } from "react-router-dom";
import { Faces, Stats } from "../components/bits";
import { Photo } from "../components/Photo";
import Elevation from "../components/Elevation";

const T = [
  ["1987", "One room on Quay Row", "Clara Veyne, a chartered surveyor, rents a room above a ship's chandler on Quay Row with two desks and a drawing board. She measures every home herself and draws its front elevation by hand, so buyers can compare houses before visiting.", { draw: true, cap: "One of Clara Veyne's first hand-drawn elevations, Bell Steps, 1987" }],
  ["1991", "The drawings go public", "The Port Aubel Courier starts printing Lintel's elevations in its Saturday property pages. Within a year, other agents copy the idea, and the drawing becomes Lintel's signature."],
  ["1994", "Opening on the coast", "Lintel opens its second office at 3 Harbour Steps in Merren Bay, as families from the capital start moving to the Lisle Coast.", { n: "q02", cap: "Old Sennick, where the coast office sold its first homes" }],
  ["1999", "Licence SPA-0193", "The new Solvenne Property Authority starts licensing agents. Lintel is among the first two hundred firms licensed, and agrees to hold all client money with the Deposit Bank of Solvenne."],
  ["2004", "Into wine country", "The Bresse office opens on the market square to cover the Marrow Valley and, from 2008, the Vey Highlands.", { n: "q15", cap: "Calvet vines above Saint-Lourde" }],
  ["2014", "Our method becomes the standard", "The SPA adopts a national measurement standard for floor area. Its wall-to-wall method is based on the rules Clara Veyne wrote for Lintel's surveyors in 1987."],
  ["2018", "Across the water", "Oskar Lunde opens the Fennick office on the Kestrel Isles, in a former ferry ticket office on Harbour Road.", { n: "q22", cap: "Fennick from the air" }],
  ["2019", "Renting gets fairer", "The Tenancy Act caps deposits at two months' rent and bans tenant fees. Lintel rewrites its lettings service around the new rules, and Ada Morrow's team publishes the plain-language guide still used today."],
  ["2022", "Owned by the people who work here", "Clara Veyne retires and transfers a majority stake to the Lintel Employee Trust. Every member of staff now owns part of the company."],
  ["2026", "Every listing checked against the registry", "Every listing is now matched to its National Land Registry title before it goes live, and every one still carries a measured elevation drawing."],
];

export default function About() {
  return (
    <>
      <section className="photo-hero">
        <Photo id={4} alt="Townhouses in Port Aubel at dusk" sizes="100vw" className="hero-img" eager />
        <div className="shade" />
        <div className="wrap hero-inner">
          <div className="lintel"><span className="eyebrow">About Lintel · Since 1987</span><h1>We measure first, then we sell.</h1></div>
          <p className="hero-lede">Lintel began as one surveyor with a tape measure and a drawing board on Quay Row. Almost forty years later we have four offices, and every home we sell is still measured and drawn by our own surveyors.</p>
        </div>
      </section>
      <Stats items={[["1987", "founded in Port Aubel"], ["180", "homes sold in 2025"], ["159", "homes let in 2025"], ["100%", "owned by our staff since 2022"]]} />
      <section className="section"><div className="wrap split">
        <div className="lintel"><span className="eyebrow">Why the name</span><h2 style={{ fontSize: "var(--s-2xl)" }}>A lintel is the beam over a doorway</h2></div>
        <div className="prose"><p>Every home you walk into, you walk under one. Clara Veyne chose the name because the lintel is the part of a house that holds everything above the door, and she wanted an agency that did the same job: carry the weight of a sale so the buyer and seller don't have to.</p><p>The logo is that doorway seen face-on, two posts and a beam. You will find the beam above every heading on this site.</p></div>
      </div></section>
      <section className="section" data-band=""><div className="wrap">
        <div className="section-head"><div className="lintel"><h2>Our history</h2></div><p className="muted" style={{ fontSize: "var(--s-sm)" }}>1987 to today</p></div>
        <ol className="tl">{T.map(([y, h, t, f], i) => (
          <li key={y} className={i === T.length - 1 ? "now" : undefined}><span className="yr">{y}</span>
            <div className="ev"><h3>{h}</h3><p>{t}</p>
              {f && <figure><div className="fr">{f.draw ? <Elevation listing={{ id: "veyne-1987", type: "townhouse", title: "Hand-drawn elevation, Bell Steps, 1987" }} vb={[480, 320]} /> : <Photo id={f.n} alt={f.cap} sizes="(max-width:640px) 100vw, 460px" />}</div><figcaption>{f.cap}</figcaption></figure>}
            </div></li>
        ))}</ol>
      </div></section>
      <section className="section"><div className="wrap" style={{ display: "grid", gap: "2rem" }}>
        <div className="lintel"><h2 style={{ fontSize: "var(--s-2xl)" }}>How we work</h2></div>
        <div className="values">
          <div><h3>Measure, don't guess</h3><p>Every home is measured wall to wall by a Lintel surveyor before it is listed. If the floor area on a listing is wrong, we refund our fee.</p></div>
          <div><h3>Say what's wrong</h3><p>We write about damp, steep stairs and kitchens that need replacing. Buyers find out anyway, and they trust the rest of the listing more when we tell them first.</p></div>
          <div><h3>Live where you sell</h3><p>Every agent lives in the region they cover. They know which streets flood, which schools have places and when the last ferry leaves.</p></div>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="wrap split" style={{ alignItems: "center" }}>
        <blockquote style={{ margin: 0, display: "grid", gap: "1rem" }}><p className="quote">“If you can't draw the house, you don't know it well enough to sell it.”</p><p className="muted">Clara Veyne, founder, in the Port Aubel Courier, 1991</p></blockquote>
        <div className="hero-draw" style={{ margin: 0, aspectRatio: "16/10" }}><Elevation listing={{ id: "veyne-quote", type: "house", title: "Elevation drawing of a family house" }} vb={[480, 300]} /><span className="note mono">Lintel elevation · not to scale</span></div>
      </div></section>
      <section className="section" data-band=""><div className="wrap" style={{ display: "grid", gap: "1.5rem" }}>
        <div className="lintel"><h2 className="h">Ownership and regulation</h2></div>
        <div className="badges">
          <div><b>Employee-owned</b><span className="muted">The Lintel Employee Trust has held 51% of the company since 2022. The Veyne family holds the rest.</span></div>
          <div><b>Licensed agent</b><span className="muted">Solvenne Property Authority licence <span className="mono">SPA-0193</span>, first issued 1999.</span></div>
          <div><b>Client money protected</b><span className="muted">Deposits and sale funds are held by the Deposit Bank of Solvenne, never in our own accounts.</span></div>
          <div><b>Independent complaints</b><span className="muted">Member of the Property Ombudsman of Solvenne. See how to complain on our <Link className="link" to="/contact">contact page</Link>.</span></div>
        </div>
      </div></section>
      <section className="section"><div className="wrap split" style={{ alignItems: "center" }}>
        <div className="lintel"><h2 style={{ fontSize: "var(--s-2xl)" }}>Meet the people doing the measuring</h2><p className="muted" style={{ maxWidth: "46ch" }}>Eight agents across four offices, from Quay Row to the Fennick ferry slip.</p></div>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}><Faces style={{ margin: "0 .5rem 0 0" }} /><Link className="btn" to="/agents">Meet the team</Link><Link className="btn ghost" to="/contact">Visit an office</Link></div>
      </div></section>
    </>
  );
}
