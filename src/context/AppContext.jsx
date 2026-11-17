import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { store } from "../lib/format";
import { pf, BIG_SET } from "../components/Photo";
import Elevation from "../components/Elevation";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const emptyFilters = () => ({ region: "", type: "", min: "", max: "", beds: 0, epc: "", sort: "newest" });

export function AppProvider({ children }) {
  /* Toast */
  const [toastMsg, setToastMsg] = useState("");
  const timer = useRef();
  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(""), 2600);
  }, []);

  /* Saved homes */
  const [saved, setSaved] = useState(() => store.get("lintel-saved", []));
  useEffect(() => store.set("lintel-saved", saved), [saved]);
  const toggleSaved = useCallback((id) => {
    setSaved((s) => {
      if (s.includes(id)) { toast("Removed from saved homes"); return s.filter((x) => x !== id); }
      toast("Saved. Find it under Saved in the header.");
      return [...s, id];
    });
  }, [toast]);

  /* Search filters, one set per search type */
  const [filters, setFilters] = useState({ buy: emptyFilters(), rent: emptyFilters(), "new-homes": emptyFilters() });
  const setFilter = useCallback((kind, patch) => setFilters((f) => ({ ...f, [kind]: { ...f[kind], ...patch } })), []);
  const clearFilters = useCallback((kind) => setFilters((f) => ({ ...f, [kind]: { ...emptyFilters(), sort: f[kind].sort } })), []);

  /* Full-screen photo viewer */
  const [lb, setLb] = useState(null); // { title, items, i }
  const openViewer = useCallback((title, items, i = 0) => setLb({ title, items, i }), []);

  const value = useMemo(() => ({ toast, saved, toggleSaved, filters, setFilter, clearFilters, openViewer }),
    [toast, saved, toggleSaved, filters, setFilter, clearFilters, openViewer]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {lb && <Lightbox state={lb} setState={setLb} />}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </Ctx.Provider>
  );
}

function Lightbox({ state, setState }) {
  const { title, items, i } = state;
  const x = items[i];
  const closeRef = useRef();
  const go = useCallback((d) => setState((s) => ({ ...s, i: (s.i + d + s.items.length) % s.items.length })), [setState]);
  const close = useCallback(() => setState(null), [setState]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [close, go]);
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <div className="lb-top"><span>{title} · {x.cap}</span><button ref={closeRef} onClick={close} aria-label="Close photo viewer">Close ✕</button></div>
      <div className="lb-stage" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        {x.draw ? <Elevation listing={x.draw} vb={[960, 400]} /> : (
          <img src={pf(x.n, 1600)} srcSet={`${pf(x.n, 1600)} 1600w${BIG_SET.has(x.n) ? `, ${pf(x.n, 2400)} 2400w` : ""}`} sizes="100vw" alt={`${x.cap}, ${title}`} />
        )}
      </div>
      <div className="lb-nav">
        <button onClick={() => go(-1)} aria-label="Previous photo">←</button>
        <span className="mono">{i + 1} / {items.length}</span>
        <button onClick={() => go(1)} aria-label="Next photo">→</button>
      </div>
    </div>
  );
}
