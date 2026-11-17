import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { POSTS } from "../data/posts";
import { AGENTS, OFFICES } from "../data/agents";
import { AuthorLine, PageHead, PostCard, SectionHead } from "../components/bits";
import { Photo, Portrait } from "../components/Photo";
import MarketChart from "../components/MarketChart";
import NotFound from "./NotFound";

export function Blog() {
  const [cat, setCat] = useState("");
  const [sub, setSub] = useState(false);
  const cats = [...new Set(POSTS.map((p) => p.cat))], f = POSTS[0];
  const rest = POSTS.slice(1).filter((p) => !cat || p.cat === cat);
  return (
    <>
      <PageHead title="Market blog">Prices, rules and local knowledge from the people who measure and sell Solvenne's homes. New articles most weeks.</PageHead>
      <div className="wrap section" style={{ display: "grid", gap: "2.5rem" }}>
        <Link className="feature" to={`/blog/${f.slug}`}>
          <span className="im"><Photo id={f.img} alt={f.title} sizes="(max-width:820px) 100vw, 60vw" eager /></span>
          <span className="b"><span className="cat">Latest · {f.cat}</span><h2>{f.title}</h2><p className="muted">{f.ex}</p><AuthorLine i={f.au} extra={`${f.date} · ${f.min} min read`} /></span>
        </Link>
        <div className="chips" role="group" aria-label="Filter articles by topic">
          <button className="chip" aria-pressed={!cat} onClick={() => setCat("")}>All topics</button>
          {cats.map((c) => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c} · {POSTS.filter((p) => p.cat === c).length}</button>)}
        </div>
        <div className="posts">{rest.length ? rest.map((p) => <PostCard key={p.slug} p={p} />) : <p className="muted">The only {cat.toLowerCase()} article so far is the one featured above.</p>}</div>
        <div className="news">
          <div style={{ display: "grid", gap: ".5rem" }}><h2>The quarterly market report, by email</h2><p>Four emails a year with prices and rents for every region. No other mail.</p></div>
          {sub ? <p style={{ opacity: 0.9 }}><b>Subscribed.</b> In this demo nothing is stored; on the live site the next report would arrive in January.</p> : (
            <form onSubmit={(e) => { e.preventDefault(); setSub(true); }}><input className="input" type="email" required placeholder="Your email address" aria-label="Email address" autoComplete="email" /><button className="btn" type="submit">Subscribe</button></form>
          )}
        </div>
      </div>
    </>
  );
}

function Block({ b }) {
  const [t, a, c] = b;
  if (t === "lead") return <p className="lead">{a}</p>;
  if (t === "p") return <p>{a}</p>;
  if (t === "h") return <h2>{a}</h2>;
  if (t === "ul") return <ul>{a.map((x) => <li key={x}>{x}</li>)}</ul>;
  if (t === "quote") return <blockquote>“{a}”<span>{c}</span></blockquote>;
  if (t === "chart") return <figure className="panel" style={{ margin: ".5rem 0" }}><MarketChart /><figcaption className="muted" style={{ fontSize: "var(--s-xs)", marginTop: ".5rem" }}>Median asking price per m², SC. Lintel listings, Q4 2024 to Q3 2026.</figcaption></figure>;
  if (t === "stats") return <div className="calc-out" style={{ fontSize: "var(--s-sm)", lineHeight: 1.4 }}>{a.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}</div>;
  if (t === "table") return (
    <div className="tbl-wrap"><table><thead><tr>{a.map((h, i) => <th key={h} className={i ? "r" : undefined}>{h}</th>)}</tr></thead>
      <tbody>{c.map((r) => <tr key={r[0]}>{r.map((x, i) => <td key={i} className={i ? "r" : undefined}>{x}</td>)}</tr>)}</tbody></table></div>
  );
  return null;
}

export function Post() {
  const { slug } = useParams();
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) return <NotFound what="We couldn't find that article" />;
  const A = AGENTS[p.au], more = POSTS.filter((x) => x !== p);
  const related = more.filter((x) => x.cat === p.cat).concat(more.filter((x) => x.cat !== p.cat)).slice(0, 3);
  return (
    <div className="wrap" style={{ paddingTop: "1.5rem" }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>/<Link to="/blog">Blog</Link>/<span>{p.cat}</span></nav>
      <div style={{ display: "grid", gap: "1rem", marginTop: "1.25rem", maxWidth: 860 }}><span className="cat">{p.cat}</span><h1 style={{ fontSize: "var(--s-2xl)" }}>{p.title}</h1><AuthorLine i={p.au} extra={`${A.role} · ${p.date} · ${p.min} min read`} /></div>
      <div className="post-hero"><Photo id={p.img} alt={p.title} sizes="100vw" eager /></div>
      <div className="article">
        <article className="article-body">{p.body.map((b, i) => <Block key={i} b={b} />)}</article>
        <aside className="post-aside">
          <div className="panel" style={{ display: "grid", gap: ".75rem" }}>
            <span className="eyebrow">About the author</span>
            <div className="agent"><Link className="avatar" to={`/agent/${A.slug}`} tabIndex={-1} aria-hidden="true"><Portrait i={p.au} sizes="52px" /></Link>
              <div><Link to={`/agent/${A.slug}`} style={{ textDecoration: "none" }}><b>{A.name}</b></Link><div className="muted" style={{ fontSize: "var(--s-xs)" }}>{A.role} · {OFFICES[A.ok].name}</div></div></div>
            <p className="muted" style={{ fontSize: "var(--s-sm)" }}>{A.bio.split(". ")[0]}.</p>
            <Link className="link" to={`/agent/${A.slug}`} style={{ justifySelf: "start" }}>Contact {A.name.split(" ")[0]}</Link>
          </div>
          <div><span className="eyebrow">More from the blog</span>
            <ul className="more-list" style={{ marginTop: ".6rem" }}>{more.slice(0, 4).map((x) => <li key={x.slug}><Link to={`/blog/${x.slug}`}><b>{x.title}</b><span>{x.cat} · {x.date}</span></Link></li>)}</ul></div>
        </aside>
      </div>
      <section style={{ paddingBottom: "3.5rem", borderTop: "1px solid var(--line)", paddingTop: "2.5rem" }}>
        <SectionHead small title="Read next"><Link className="link" to="/blog">All articles</Link></SectionHead>
        <div className="posts">{related.map((x) => <PostCard key={x.slug} p={x} />)}</div>
      </section>
    </div>
  );
}
