import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AGENTS, OFFICES } from "../data/agents";
import { useApp } from "../context/AppContext";
import { Faces, LinkButton, PageHead } from "../components/bits";
import { Photo } from "../components/Photo";
import { OfficeMap } from "../components/Maps";
import { reducedMotion } from "../lib/format";

const LINES = [
  ["Head office, all enquiries", "(01) 448 2100", "Mon–Fri 08:30–18:00 · Sat 09:00–14:00"],
  ["Valuations", "(01) 448 2133", "Book a free visit anywhere in Solvenne"],
  ["Tenant maintenance", "(01) 448 2199", "24 hours, for homes we manage"],
  ["Complaints", "(01) 448 2101", "We reply within 5 working days. If you're not satisfied, you can refer it to the Property Ombudsman of Solvenne."],
];
const TOPICS = ["Buying a home", "Renting a home", "Selling or a valuation", "Letting my home", "New homes", "Something else"];

export default function Contact() {
  const { toast } = useApp();
  const [sel, setSel] = useState("");
  const [f, setF] = useState({ topic: TOPICS[0], office: "", name: "", contact: "", msg: "", pref: "Either" });
  const [sent, setSent] = useState(null);
  const formRef = useRef(), nameRef = useRef();
  const keys = Object.keys(OFFICES);
  const copy = async (t) => { try { await navigator.clipboard.writeText(t); toast("Copied " + t); } catch { toast("Select the number to copy it"); } };
  const enquire = (k) => {
    setSel(k); setF((s) => ({ ...s, office: k })); setSent(null);
    formRef.current?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 400);
  };
  return (
    <>
      <PageHead title="Contact us">Call, visit or send a message. Every enquiry goes to a named agent in the right office, who replies within one working day.</PageHead>
      <div className="wrap section contact-top">
        {sent ? (
          <div className="panel form" ref={formRef}><h2 className="h" style={{ fontSize: "var(--s-lg)" }}>Thank you, {sent.name}</h2>
            <p className="ok">Your enquiry about <b>{sent.topic.toLowerCase()}</b> is noted for the {sent.office} office. In this demo nothing is sent; on the live site an agent would reply within one working day.</p></div>
        ) : (
          <form className="panel form" ref={formRef} onSubmit={(e) => { e.preventDefault(); setSent({ name: f.name.split(" ")[0], topic: f.topic, office: f.office ? OFFICES[f.office].name : "Port Aubel" }); }}>
            <h2 className="h" style={{ fontSize: "var(--s-lg)" }}>Send an enquiry</h2>
            <div className="row2">
              <label className="f">I'm interested in<select className="input" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="f">Nearest office<select className="input" value={f.office} onChange={(e) => setF({ ...f, office: e.target.value })}><option value="">Let us choose</option>{keys.map((k) => <option key={k} value={k}>{OFFICES[k].name}</option>)}</select></label>
            </div>
            <div className="row2">
              <label className="f">Your name<input ref={nameRef} className="input" required autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
              <label className="f">Email or phone<input className="input" required autoComplete="email" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></label>
            </div>
            <label className="f">Message<textarea className="input" placeholder="Tell us the area, budget and timing if you know them." value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} /></label>
            <div className="f" style={{ display: "grid", gap: ".4rem" }}><span className="eyebrow">Best way to reach you</span>
              <div className="chips">{["Phone", "Email", "Either"].map((t) => <button key={t} type="button" className="chip" aria-pressed={f.pref === t} onClick={() => setF({ ...f, pref: t })}>{t}</button>)}</div></div>
            <button className="btn" type="submit" style={{ justifySelf: "start" }}>Send enquiry</button>
            <p className="muted" style={{ fontSize: "var(--s-xs)" }}>We use your details only to answer this enquiry. See our privacy notice for how long we keep them.</p>
          </form>
        )}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div className="lintel"><h2 className="h">Phone lines</h2></div>
          <div className="lines">{LINES.map(([t, n, note]) => (
            <div key={t}><b>{t}</b><span className="mono">{n}<button type="button" className="copy" aria-label={`Copy ${t} number`} onClick={() => copy(n)}>Copy</button></span><span className="muted">{note}</span></div>
          ))}</div>
          <p className="muted" style={{ fontSize: "var(--s-xs)" }}>Lintel Homes S.A. · Registered office 14 Quay Row, Port Aubel · Company no. 0418 2271 · SPA licence SPA-0193</p>
        </div>
      </div>
      <section className="section" data-band=""><div className="wrap">
        <div className="section-head"><div className="lintel"><h2>Our offices</h2></div><p className="muted" style={{ fontSize: "var(--s-sm)" }}>Select an office to see it on the map.</p></div>
        <div className="locate">
          <OfficeMap sel={sel} setSel={setSel} />
          <div className="olist">{keys.map((k, n) => {
            const o = OFFICES[k];
            return (
              <div key={k} className={`ocard${sel === k ? " on" : ""}`} role="button" tabIndex={0} aria-label={`Show ${o.name} office on the map`}
                onClick={(e) => { if (!e.target.closest("a,button")) setSel(k); }} onKeyDown={(e) => { if (e.key === "Enter" && e.target === e.currentTarget) setSel(k); }}>
                <span className="im"><Photo id={o.img} alt={`${o.name} office area`} sizes="150px" /></span>
                <span className="b">
                  <span className="eyebrow">{k === "pa" ? "Head office" : "Branch"} · covers {o.area}</span>
                  <h3><span className="num-badge">{n + 1}</span>{o.name}</h3>
                  <span>{o.addr}</span><span className="mono" style={{ userSelect: "all" }}>{o.phone}</span>
                  <span className="muted" style={{ fontSize: "var(--s-xs)" }}>{o.hours}</span>
                  <span style={{ fontSize: "var(--s-xs)" }}><b>Getting there:</b> {o.reach}</span>
                  <Faces filter={(a) => a.ok === k} />
                  <span><LinkButton onClick={() => enquire(k)}>Send an enquiry to {o.name}</LinkButton></span>
                </span>
              </div>
            );
          })}</div>
        </div>
      </div></section>
    </>
  );
}
