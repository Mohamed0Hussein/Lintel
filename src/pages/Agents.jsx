import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AGENTS, OFFICES } from "../data/agents";
import { LISTINGS } from "../data/listings";
import { Card, Faces, PageHead, PersonCard, SectionHead } from "../components/bits";
import { Portrait } from "../components/Photo";
import NotFound from "./NotFound";

export function agentListings(i) {
  const a = AGENTS[i];
  if (a.list === "rent-pa") return LISTINGS.filter((l) => l.mode === "rent" && l.region === "port-aubel");
  if (a.list === "rent-lc") return LISTINGS.filter((l) => l.mode === "rent" && l.region === "lisle-coast");
  if (a.list === "new") return LISTINGS.filter((l) => l.isNew);
  if (a.list === "none") return [];
  return LISTINGS.filter((l) => l.agent === i);
}

export function Agents() {
  const [office, setOffice] = useState("");
  return (
    <>
      <PageHead title="Our agents">Eight people across four offices. Every agent is licensed by the Solvenne Property Authority, and every one lives in the region they sell.</PageHead>
      <div className="wrap section" style={{ display: "grid", gap: "1.5rem" }}>
        <div className="chips" role="group" aria-label="Filter by office">
          <button className="chip" aria-pressed={!office} onClick={() => setOffice("")}>All offices</button>
          {Object.entries(OFFICES).map(([k, o]) => <button key={k} className="chip" aria-pressed={office === k} onClick={() => setOffice(k)}>{o.name} · {AGENTS.filter((a) => a.ok === k).length}</button>)}
        </div>
        <div className="team">{AGENTS.map((a, i) => (!office || a.ok === office ? <PersonCard key={a.slug} a={a} i={i} /> : null))}</div>
      </div>
      <section className="section" style={{ paddingTop: 0 }}><div className="wrap">
        <SectionHead title="Offices"><Link className="link" to="/contact">Map and directions</Link></SectionHead>
        <div className="offices">{Object.entries(OFFICES).map(([k, o]) => (
          <div key={k} className="office"><span className="eyebrow">{k === "pa" ? "Head office" : "Branch"}</span><h3>{o.name}</h3><p>{o.addr}</p>
            <p className="mono" style={{ userSelect: "all" }}>{o.phone}</p><p className="muted" style={{ fontSize: "var(--s-xs)" }}>{o.hours}</p>
            <Faces filter={(a) => a.ok === k} style={{ marginTop: ".35rem" }} /></div>
        ))}</div>
      </div></section>
    </>
  );
}

function MessageForm({ a }) {
  const first = a.name.split(" ")[0];
  const [sent, setSent] = useState(null);
  const [f, setF] = useState({ name: "", contact: "", msg: "" });
  if (sent) return <div className="panel"><p className="ok"><b>Message noted, {sent}.</b> In this demo nothing is sent; on the live site the agent would reply within one working day.</p></div>;
  const ph = a.list === "none" ? "I'd like to book a valuation for…" : a.list?.startsWith("rent") ? "I'm looking to rent…" : "I'm interested in…";
  return (
    <form className="panel form" onSubmit={(e) => { e.preventDefault(); setSent(f.name.split(" ")[0]); }}>
      <h2 className="h" style={{ fontSize: "var(--s-lg)" }}>Send {first} a message</h2>
      <div className="row2">
        <label className="f">Your name<input className="input" required autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="f">Email or phone<input className="input" required value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></label>
      </div>
      <label className="f">Message<textarea className="input" placeholder={ph} value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} /></label>
      <button className="btn" type="submit" style={{ justifySelf: "start" }}>Send message</button>
    </form>
  );
}

export function Agent() {
  const { slug } = useParams();
  const i = AGENTS.findIndex((a) => a.slug === slug);
  if (i < 0) return <NotFound what="We couldn't find that agent" />;
  const a = AGENTS[i], o = OFFICES[a.ok], homes = agentListings(i), first = a.name.split(" ")[0];
  const idx = AGENTS.map((x, j) => [x, j]);
  const others = idx.filter(([x, j]) => j !== i && x.ok === a.ok).concat(idx.filter(([x, j]) => j !== i && x.ok !== a.ok)).slice(0, 4);
  return (
    <div className="wrap" style={{ paddingTop: "1.5rem" }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>/<Link to="/agents">Agents</Link>/<span>{a.name}</span></nav>
      <div className="profile">
        <div className="ph"><Portrait i={i} sizes="(max-width:820px) 100vw, 480px" eager /></div>
        <div style={{ display: "grid", gap: "1.75rem", minWidth: 0 }}>
          <div className="lintel"><span className="eyebrow">{a.role} · {o.name}</span><h1 style={{ fontSize: "var(--s-2xl)" }}>{a.name}</h1></div>
          <p className="prose" style={{ display: "block" }}>{a.bio}</p>
          <div className="calc-out">
            {a.stats.map(([v, t]) => <div key={t}><b>{v}</b><span>{t[0].toUpperCase() + t.slice(1)}</span></div>)}
            <div><b>{2026 - a.since} yrs</b><span>With Lintel since {a.since}</span></div>
          </div>
          <dl className="registry"><dt>Office</dt><dd>{o.addr}</dd><dt>Direct line</dt><dd className="mono" style={{ userSelect: "all" }}>{a.phone}</dd><dt>Languages</dt><dd>{a.langs}</dd><dt>Areas</dt><dd>{a.areas}</dd><dt>Licence</dt><dd className="mono">{a.lic}</dd></dl>
          <MessageForm a={a} />
        </div>
      </div>
      {homes.length ? (
        <section style={{ paddingBottom: "3rem" }}>
          <SectionHead small title={a.list === "new" ? `New homes ${first} is selling` : a.list ? `Homes ${first} is letting` : `${first}'s listings`} />
          <div className="grid g3">{homes.slice(0, 6).map((l) => <Card key={l.id} l={l} />)}</div>
        </section>
      ) : (
        <section style={{ paddingBottom: "3rem" }}><div className="empty"><h3>{first} values homes rather than listing them</h3>
          <p className="muted">Book a free valuation and {first} or a colleague will measure your home and send a written price range within 48 hours.</p><Link className="btn" to="/sell">Book a valuation</Link></div></section>
      )}
      <section style={{ paddingBottom: "3.5rem" }}>
        <SectionHead small title="More of the team"><Link className="link" to="/agents">All agents</Link></SectionHead>
        <div className="team">{others.map(([x, j]) => <PersonCard key={x.slug} a={x} i={j} />)}</div>
      </section>
    </div>
  );
}
