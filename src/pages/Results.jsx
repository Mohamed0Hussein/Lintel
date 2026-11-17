import { useCallback, useEffect, useMemo, useState } from "react";
import { LISTINGS } from "../data/listings";
import { REGIONS } from "../data/regions";
import { useApp } from "../context/AppContext";
import { Card, PageHead } from "../components/bits";
import { ResultsMap, inBounds } from "../components/Maps";
import { money, PRICE_OPTIONS, store, typeLabel } from "../lib/format";

const HEADS = {
  buy: ["Homes for sale in Solvenne", "Freehold and leasehold homes across all five regions. Prices include SVT where it applies; stamp levy is shown on each listing."],
  rent: ["Homes to rent in Solvenne", "Long lets under the Tenancy Act 2019. Deposits are capped at two months' rent and held by the Deposit Bank of Solvenne."],
  "new-homes": ["New homes", "Off-plan and recently completed homes from registered developers, each with a 10-year structural warranty."],
};
const SORTS = {
  newest: (a, b) => a.added - b.added,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  ppm: (a, b) => a.price / (a.area || a.plot) - b.price / (b.area || b.plot),
};

export function filterListings(kind, f) {
  let a = LISTINGS.filter((l) => (kind === "rent" ? l.mode === "rent" : kind === "new-homes" ? l.isNew : l.mode === "sale"));
  if (f.region) a = a.filter((l) => l.region === f.region);
  if (f.type) a = a.filter((l) => l.type === f.type);
  if (f.min) a = a.filter((l) => l.price >= +f.min);
  if (f.max) a = a.filter((l) => l.price <= +f.max);
  if (f.beds) a = a.filter((l) => l.beds >= f.beds);
  if (f.epc) a = a.filter((l) => l.epc && l.epc <= f.epc);
  return [...a].sort(SORTS[f.sort]);
}

const useMedia = (q) => {
  const [m, setM] = useState(() => matchMedia(q).matches);
  useEffect(() => { const mq = matchMedia(q), on = () => setM(mq.matches); mq.addEventListener("change", on); return () => mq.removeEventListener("change", on); }, [q]);
  return m;
};

export default function Results({ kind }) {
  const { filters, setFilter, clearFilters } = useApp();
  const f = filters[kind], set = (patch) => setFilter(kind, patch);
  const priceKind = kind === "rent" ? "rent" : "buy";
  const [view, setViewRaw] = useState(() => (store.get("lintel-view", "list") === "map" ? "map" : "list"));
  const setView = (v) => { setViewRaw(v); store.set("lintel-view", v); };
  const [limit, setLimit] = useState(true);
  const [bounds, setBounds] = useState(null);
  const [hover, setHover] = useState(null);
  const wide = useMedia("(min-width:1101px)");
  const desktop = useMedia("(min-width:861px)");
  const onBounds = useCallback((vb) => setBounds(vb), []);

  const all = useMemo(() => filterListings(kind, f), [kind, f]);
  const limited = view === "map" && limit && wide && bounds;
  const shown = limited ? all.filter((l) => inBounds(l, bounds)) : all;
  const active = ["region", "type", "min", "max", "epc"].filter((k) => f[k]).length + (f.beds ? 1 : 0);

  return (
    <>
      <PageHead title={HEADS[kind][0]}>{HEADS[kind][1]}</PageHead>
      <div className="wrap results">
        <details className="filters" open={desktop || undefined}>
          <summary>Filters <span className="filter-badge">{active}</span></summary>
          <div className="filters-inner">
            <label className="f">Region<select className="input" value={f.region} onChange={(e) => set({ region: e.target.value })}><option value="">All regions</option>{Object.entries(REGIONS).map(([k, r]) => <option key={k} value={k}>{r.name}</option>)}</select></label>
            <label className="f">Property type<select className="input" value={f.type} onChange={(e) => set({ type: e.target.value })}><option value="">Any type</option>{["apartment", "townhouse", "house", "villa", "cottage", "plot"].map((t) => <option key={t} value={t}>{typeLabel(t)}</option>)}</select></label>
            <div className="row2">
              <label className="f">Min price<select className="input" value={f.min} onChange={(e) => set({ min: e.target.value })}><option value="">No min</option>{PRICE_OPTIONS[priceKind].map((n) => <option key={n} value={n}>{money(n)}{priceKind === "rent" ? " /mo" : ""}</option>)}</select></label>
              <label className="f">Max price<select className="input" value={f.max} onChange={(e) => set({ max: e.target.value })}><option value="">No max</option>{PRICE_OPTIONS[priceKind].map((n) => <option key={n} value={n}>{money(n)}{priceKind === "rent" ? " /mo" : ""}</option>)}</select></label>
            </div>
            <div className="f" style={{ display: "grid", gap: ".35rem" }}><span className="eyebrow">Bedrooms</span>
              <div className="chips">{[0, 1, 2, 3, 4].map((n) => <button key={n} type="button" className="chip" aria-pressed={f.beds === n} onClick={() => set({ beds: n })}>{n ? n + "+" : "Any"}</button>)}</div></div>
            <label className="f">Energy rating<select className="input" value={f.epc} onChange={(e) => set({ epc: e.target.value })}><option value="">Any rating</option>{["A", "B", "C", "D"].map((e) => <option key={e} value={e}>{e === "A" ? "A only" : e + " or better"}</option>)}</select></label>
            <button type="button" className="btn ghost" onClick={() => clearFilters(kind)}>Clear filters</button>
          </div>
        </details>
        <div style={{ minWidth: 0 }}>
          <div className="toolbar">
            <p className="muted"><b style={{ color: "var(--ink)" }}>{shown.length}</b> {shown.length === 1 ? "home" : "homes"}{limited ? " in map area" : f.region ? " in " + REGIONS[f.region].name : ""}{limited && shown.length < all.length && <span className="muted"> of {all.length}</span>}</p>
            <div className="tools">
              <div className="seg" role="group" aria-label="Show results as">
                <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 2h12M1 7h12M1 12h12" style={{ stroke: "currentColor", strokeWidth: 1.6, fill: "none" }} /></svg>List</button>
                <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 3l4-2 4 2 4-2v10l-4 2-4-2-4 2z M5 1v10 M9 3v10" style={{ stroke: "currentColor", strokeWidth: 1.4, fill: "none", strokeLinejoin: "round" }} /></svg>Map</button>
              </div>
              <label className="muted" style={{ display: "flex", gap: ".5rem", alignItems: "center", fontSize: "var(--s-xs)" }}>Sort
                <select className="input" value={f.sort} onChange={(e) => set({ sort: e.target.value })}>
                  <option value="newest">Newest first</option><option value="price-asc">Lowest price</option><option value="price-desc">Highest price</option><option value="ppm">Lowest price per m²</option>
                </select></label>
            </div>
          </div>
          <div className={`res-body${view === "map" ? " is-map" : ""}`}>
            <div id="rgrid" style={{ minWidth: 0 }}>
              {shown.length ? <div className="grid">{shown.map((l) => <Card key={l.id} l={l} onHover={view === "map" ? setHover : undefined} />)}</div> : (
                <div className="empty"><h3>No homes match these filters</h3><p className="muted">Try a wider price range or another region.</p><button className="btn ghost" onClick={() => clearFilters(kind)}>Clear filters</button></div>
              )}
            </div>
            {view === "map" && <ResultsMap list={all} hover={hover} limit={limit} setLimit={setLimit} onBounds={onBounds} showLimit={wide} />}
          </div>
        </div>
      </div>
    </>
  );
}
