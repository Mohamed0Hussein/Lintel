import { Link } from "react-router-dom";
import { money, fmt } from "../lib/format";
import { REGIONS } from "../data/regions";
import { PH } from "../data/photos";
import { AGENTS } from "../data/agents";
import { Photo, Portrait } from "./Photo";
import Elevation from "./Elevation";
import { useApp } from "../context/AppContext";

export const PriceText = ({ l }) => (l.mode === "rent" ? <>{money(l.price)} <small>per month</small></> : money(l.price));

export const Epc = ({ e }) => (e ? <span className={`epc epc-${e}`} title={`Energy rating ${e}`}>{e}</span> : <span className="epc epc-na" title="No energy rating">–</span>);

const tagClass = (s) => (/Reduced|Under offer/.test(s) ? "ochre" : /Off-plan|Show home|Completing/.test(s) ? "green" : "");

export const Heart = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3 1.7-1.8 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" style={{ fill: "none", stroke: "currentColor", strokeWidth: 2 }} /></svg>
);

export function Card({ l, onHover }) {
  const { saved, toggleSaved } = useApp();
  const on = saved.includes(l.id);
  return (
    <article className="card" onMouseEnter={onHover && (() => onHover(l.id))} onMouseLeave={onHover && (() => onHover(null))}>
      {l.status && <span className={`tag ${tagClass(l.status)}`}>{l.status}</span>}
      <button className="save" aria-pressed={on} aria-label={`${on ? "Remove from" : "Save to"} saved homes: ${l.title}`} onClick={() => toggleSaved(l.id)}><Heart /></button>
      <Link className="card-media" to={`/listing/${l.id}`} tabIndex={-1} aria-hidden="true">
        {PH[l.id] ? <Photo id={PH[l.id][0]} alt={l.title} /> : <Elevation listing={l} />}
      </Link>
      <div className="card-body">
        <div className="price"><PriceText l={l} /></div>
        <h3><Link to={`/listing/${l.id}`}>{l.title}</Link></h3>
        <p className="loc">{l.district}, {REGIONS[l.region].name}</p>
        <ul className="facts">
          {l.type === "plot"
            ? <><li><b>{fmt(l.plot)}</b> m² plot</li><li>Building plot</li></>
            : <><li><b>{l.beds === 0 ? "Studio" : l.beds}</b>{l.beds ? " bed" : ""}</li><li><b>{l.baths}</b> bath</li><li><b>{l.area}</b> m²</li></>}
          <li style={{ marginLeft: "auto" }}><Epc e={l.epc} /></li>
        </ul>
      </div>
    </article>
  );
}

export const PageHead = ({ title, children }) => (
  <div className="page-head"><div className="wrap"><div className="lintel"><h1>{title}</h1></div>{children && <p>{children}</p>}</div></div>
);

export const SectionHead = ({ title, children, small }) => (
  <div className="section-head"><div className="lintel"><h2 style={small ? { fontSize: "var(--s-xl)" } : undefined}>{title}</h2></div>{children}</div>
);

export const LinkButton = ({ children, ...p }) => (
  <button type="button" className="link" style={{ background: "none", borderTop: 0, borderLeft: 0, borderRight: 0, padding: 0, cursor: "pointer", font: "inherit", fontWeight: 600 }} {...p}>{children}</button>
);

export const Faces = ({ filter = () => true, style }) => (
  <span className="faces" style={style}>
    {AGENTS.map((a, i) => (filter(a) ? <Link key={a.slug} to={`/agent/${a.slug}`} title={a.name}><Portrait i={i} sizes="38px" /></Link> : null))}
  </span>
);

export const AuthorLine = ({ i, extra }) => (
  <span className="byline"><span className="face"><Portrait i={i} sizes="32px" /></span><span><b>{AGENTS[i].name}</b><br />{extra}</span></span>
);

export function PersonCard({ a, i }) {
  return (
    <Link className="person" to={`/agent/${a.slug}`}>
      <span className="ph"><Portrait i={i} sizes="(max-width:520px) 100vw, 280px" /></span>
      <span><h3>{a.name}</h3></span>
      <span className="meta">
        <span style={{ color: "var(--ink)", fontWeight: 600 }}>{a.role}</span>
        <span>{a.ok && a.officeName} office · with Lintel since {a.since}</span>
        <span>Speaks {a.langs}</span>
      </span>
      <span className="pstats">{a.stats.map(([v, t]) => <span key={t}><b>{v}</b>{t}</span>)}</span>
    </Link>
  );
}

export function PostCard({ p }) {
  return (
    <Link className="post-card" to={`/blog/${p.slug}`}>
      <span className="im"><Photo id={p.img} alt={p.title} sizes="(max-width:640px) 100vw, 400px" /></span>
      <span className="cat">{p.cat}</span>
      <h3>{p.title}</h3>
      <p className="ex">{p.ex}</p>
      <AuthorLine i={p.au} extra={`${p.date} · ${p.min} min read`} />
    </Link>
  );
}

export const Stats = ({ items }) => (
  <div className="wrap"><div className="stats">{items.map(([v, t]) => <div key={t}><b className="num">{v}</b><span>{t}</span></div>)}</div></div>
);

export const Logo = () => (
  <svg viewBox="0 0 34 30" aria-hidden="true"><rect x="0" y="2" width="34" height="7" style={{ fill: "var(--accent)" }} /><rect x="5" y="9" width="5" height="21" style={{ fill: "var(--ink)" }} /><rect x="24" y="9" width="5" height="21" style={{ fill: "var(--ink)" }} /></svg>
);
