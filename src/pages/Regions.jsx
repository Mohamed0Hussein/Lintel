import { Link, useNavigate, useParams } from "react-router-dom";
import { REGIONS } from "../data/regions";
import { RG } from "../data/photos";
import { LISTINGS } from "../data/listings";
import { useApp } from "../context/AppContext";
import { Card, LinkButton, PageHead, SectionHead, Stats } from "../components/bits";
import { Photo } from "../components/Photo";
import { fmt } from "../lib/format";
import NotFound from "./NotFound";

const S = (fill, stroke, w) => ({ fill: `var(--${fill})`, ...(stroke ? { stroke: `var(--${stroke})`, strokeWidth: w || 1.3 } : {}) });

function useRegionSearch() {
  const { setFilter } = useApp();
  const navigate = useNavigate();
  return (key, to) => { setFilter(to, { region: key }); navigate("/" + to); };
}

export function Regions() {
  const go = useRegionSearch();
  return (
    <>
      <PageHead title="The regions of Solvenne">Prices, rents and yields by region. Figures are medians from Lintel listings in Q3 2026.</PageHead>
      <div className="wrap section split">
        <div className="panel mapbox">
          <svg viewBox="0 0 400 300" role="img" aria-label="Map of Solvenne showing the five regions">
            <polygon points="40,250 58,182 36,124 88,62 168,38 252,54 318,30 356,92 338,160 312,206 262,258 160,282 86,276" style={S("sunk", "ink", 1.4)} />
            <path d="M168 120 C190 150,182 180,210 200 S250 230,262 258" style={{ fill: "none", stroke: "var(--glass)", strokeWidth: 3 }} />
            <polygon points="188,70 200,52 212,70" style={S("roof", "ink", 1)} /><polygon points="206,74 220,56 232,74" style={S("roof", "ink", 1)} />
            <circle cx="372" cy="246" r="9" style={S("sunk", "ink", 1.2)} /><circle cx="356" cy="268" r="6" style={S("sunk", "ink", 1.2)} /><circle cx="384" cy="270" r="5" style={S("sunk", "ink", 1.2)} />
            {Object.entries(REGIONS).map(([k, r]) => (
              <Link key={k} to={`/region/${k}`}>
                <circle cx={r.map[0]} cy={r.map[1]} r="5" style={{ fill: "var(--accent)" }} />
                <text x={r.map[0] + (r.map[0] > 330 ? -8 : 8)} y={r.map[1] - 8} textAnchor={r.map[0] > 330 ? "end" : "start"} style={{ fill: "var(--ink)" }}>{r.name}</text>
              </Link>
            ))}
            <text x="20" y="290" style={{ fill: "var(--muted)", font: "500 9px var(--mono)" }}>WESTERN SEA</text><text x="300" y="20" style={{ fill: "var(--muted)", font: "500 9px var(--mono)" }}>NORTH STRAIT</text>
          </svg>
        </div>
        <div className="tbl-wrap"><table><thead><tr><th>Region</th><th className="r">Sale, SC/m²</th><th className="r">Rent, SC/m²/mo</th><th className="r">Gross yield</th><th className="r">Listings</th></tr></thead><tbody>
          {Object.entries(REGIONS).map(([k, r]) => (
            <tr key={k}><td><Link to={`/region/${k}`} style={{ textDecoration: "none" }}><b>{r.name}</b></Link><br /><span className="muted" style={{ fontSize: "var(--s-xs)" }}>{r.kind}</span></td>
              <td className="r">{fmt(r.ppm)}</td><td className="r">{r.rent}</td><td className="r">{r.yield}%</td><td className="r">{fmt(r.count)}</td></tr>
          ))}
        </tbody></table></div>
      </div>
      <div className="wrap" style={{ display: "grid", paddingBottom: "3rem", borderTop: "1px solid var(--line)" }}>
        {Object.entries(REGIONS).map(([k, r]) => (
          <div key={k} className="split" style={{ paddingBlock: "2rem", borderBottom: "1px solid var(--line)" }}>
            <div className="lintel"><span className="eyebrow">{r.kind}</span><h2 style={{ fontSize: "var(--s-xl)" }}>{r.name}</h2><p className="muted">{r.districts.join(" · ")}</p></div>
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ fontSize: "var(--s-md)", maxWidth: "60ch" }}>{r.blurb}</p>
              <div className="thumbs">{RG[k].g.slice(0, 4).map(([n, cap]) => <Link key={cap} to={`/region/${k}`} aria-label={cap}><Photo id={n} alt={cap} sizes="(max-width:860px) 25vw, 180px" /></Link>)}</div>
              <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                <Link className="btn" to={`/region/${k}`}>Explore {r.name}</Link>
                <button className="btn ghost" onClick={() => go(k, "buy")}>Homes for sale</button>
                <button className="btn ghost" onClick={() => go(k, "rent")}>Homes to rent</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function Region() {
  const { key } = useParams();
  const { openViewer } = useApp();
  const go = useRegionSearch();
  const r = REGIONS[key], G = RG[key];
  if (!r) return <NotFound what="We couldn't find that region" />;
  const homes = LISTINGS.filter((l) => l.region === key).sort((a, b) => a.added - b.added);
  const sale = homes.filter((l) => l.mode === "sale").length, rent = homes.length - sale;
  const items = G.g.map(([n, cap]) => ({ n, cap }));
  const cls = (i) => (i === 0 ? "big" : i === 4 || i === 8 ? "wide" : undefined);
  return (
    <>
      <section className="photo-hero">
        <Photo id={G.hero} alt={G.g[0][1]} sizes="100vw" className="hero-img" eager />
        <div className="shade" />
        <div className="wrap hero-inner">
          <div className="lintel"><span className="eyebrow"><Link to="/regions" style={{ color: "inherit" }}>Regions</Link> · {r.kind}</span><h1>{r.name}</h1></div>
          <p className="hero-lede">{r.blurb}</p>
        </div>
      </section>
      <Stats items={[["SC " + fmt(r.ppm), "median asking price per m²"], ["SC " + r.rent, "median rent per m² per month"], [r.yield + "%", "gross rental yield"], [fmt(r.count), "homes listed in the region"]]} />
      <section className="section"><div className="wrap">
        <SectionHead title={`${r.name} in pictures`}><LinkButton onClick={() => openViewer(r.name, items, 0)}>View all {items.length} photos</LinkButton></SectionHead>
        <div className="mosaic">{G.g.map(([n, cap], i) => (
          <button key={cap} className={cls(i)} aria-label={`Open photo: ${cap}`} onClick={() => openViewer(r.name, items, i)}>
            <Photo id={n} alt={cap} sizes={i === 0 ? "(max-width:760px) 100vw, 50vw" : "(max-width:760px) 50vw, 25vw"} /><span className="cap">{cap}</span>
          </button>
        ))}</div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="wrap" style={{ display: "grid", gap: "1.5rem" }}>
        <div className="lintel"><h2 className="h">Living in {r.name}</h2></div>
        <div className="facts3">
          <div><h3>Getting there</h3><p>{G.there}</p></div>
          <div><h3>Typical homes</h3><p>{G.homes}</p></div>
          <div><h3>Day to day</h3><p>{G.life}</p></div>
        </div>
        <p className="muted" style={{ fontSize: "var(--s-sm)" }}>Districts: {r.districts.join(" · ")}</p>
      </div></section>
      <section className="section" data-band=""><div className="wrap">
        <SectionHead title={`Homes in ${r.name}`}>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            {sale > 0 && <button className="btn" onClick={() => go(key, "buy")}>All {sale} for sale</button>}
            {rent > 0 && <button className="btn ghost" onClick={() => go(key, "rent")}>All {rent} to rent</button>}
          </div>
        </SectionHead>
        <div className="grid g3">{homes.slice(0, 6).map((l) => <Card key={l.id} l={l} />)}</div>
      </div></section>
      <section className="section"><div className="wrap">
        <SectionHead title={<span className="h">Other regions</span>} />
        <div className="grid">{Object.keys(REGIONS).filter((o) => o !== key).map((o) => (
          <Link key={o} className="card" to={`/region/${o}`} style={{ textDecoration: "none" }}>
            <span className="card-media"><Photo id={RG[o].hero} alt={REGIONS[o].name} /></span>
            <span className="card-body"><span className="eyebrow">{REGIONS[o].kind}</span><span className="price">{REGIONS[o].name}</span><span className="loc">SC {fmt(REGIONS[o].ppm)} per m² · {RG[o].g.length} photos</span></span>
          </Link>
        ))}</div>
      </div></section>
    </>
  );
}
