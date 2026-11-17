import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Heart, Logo } from "./bits";
import { reducedMotion } from "../lib/format";

const NAV = [
  ["/buy", "Buy"], ["/rent", "Rent"], ["/new-homes", "New homes"], ["/sell", "Sell"], ["/regions", "Regions", "/region/"],
  ["/agents", "Agents", "/agent/"], ["/guides", "Guides"], ["/blog", "Blog"], ["/about", "About"], ["/contact", "Contact"],
];

const darkMQ = typeof matchMedia !== "undefined" ? matchMedia("(prefers-color-scheme: dark)") : null;
const effectiveTheme = () => {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "dark" || t === "light" ? t : darkMQ?.matches ? "dark" : "light";
};

function ThemeToggle() {
  const { toast } = useApp();
  const [mode, setMode] = useState(effectiveTheme);
  useEffect(() => {
    const sync = () => setMode(effectiveTheme());
    darkMQ?.addEventListener("change", sync);
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { darkMQ?.removeEventListener("change", sync); mo.disconnect(); };
  }, []);
  const next = mode === "dark" ? "light" : "dark";
  const toggle = () => {
    const root = document.documentElement;
    if (!reducedMotion()) { root.classList.add("theme-anim"); setTimeout(() => root.classList.remove("theme-anim"), 400); }
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("lintel-theme", next); } catch { /* ignore */ }
    toast(next === "dark" ? "Dark theme on" : "Light theme on");
  };
  return (
    <button className="theme-btn" type="button" data-mode={mode} onClick={toggle} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
      <svg className="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" style={{ fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinejoin: "round" }} /></svg>
      <svg className="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" style={{ fill: "none", stroke: "currentColor", strokeWidth: 1.9 }} /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" style={{ fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" }} /></svg>
    </button>
  );
}

export function Header() {
  const { saved } = useApp();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="top">
      <div className="wrap">
        <Link className="brand" to="/" aria-label="Lintel Homes, home"><Logo /><span><b>Lintel</b><small>Homes of Solvenne</small></span></Link>
        <nav className={`nav${open ? " open" : ""}`} id="nav" aria-label="Main">
          {NAV.map(([to, label, prefix]) => (
            <NavLink key={to} to={to} className={() => ""} aria-current={pathname === to || (prefix && pathname.startsWith(prefix)) || (to === "/blog" && pathname.startsWith("/blog/")) || (to === "/agents" && pathname.startsWith("/agent/")) ? "page" : undefined}>{label}</NavLink>
          ))}
        </nav>
        <div className="top-actions">
          <ThemeToggle />
          <Link className="saved-link" to="/saved"><Heart /><span className="sv-t">Saved</span> <span className="count num">{saved.length}</span></Link>
          <Link className="btn" to="/sell">Book a valuation</Link>
        </div>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen((o) => !o)}>Menu</button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <Link className="brand" to="/"><Logo /><span><b>Lintel</b><small>Homes of Solvenne</small></span></Link>
            <p className="muted" style={{ marginTop: "1rem", maxWidth: "36ch" }}>Homes to buy, rent and sell across Solvenne's five regions. Every listing is checked against the National Land Registry before it goes live.</p>
          </div>
          <div><h4>Find</h4><ul>
            <li><Link to="/buy">Homes for sale</Link></li><li><Link to="/rent">Homes to rent</Link></li><li><Link to="/new-homes">New homes</Link></li>
            <li><Link to="/saved">Saved homes</Link></li><li><Link to="/mortgage">Mortgage calculator</Link></li><li><Link to="/agents">Our agents</Link></li>
            <li><Link to="/about">About Lintel</Link></li><li><Link to="/blog">Market blog</Link></li></ul></div>
          <div><h4>Sell &amp; let</h4><ul><li><Link to="/sell">Free valuation</Link></li><li><Link to="/sell">Our fees</Link></li><li><Link to="/guides">Landlord guide</Link></li><li><Link to="/brand">Brand book</Link></li></ul></div>
          <div><h4>Offices</h4><ul>
            <li><Link to="/contact">Port Aubel · 14 Quay Row</Link></li><li><Link to="/contact">Lisle Coast · Merren Bay</Link></li><li><Link to="/contact">Bresse · Market Square</Link></li>
            <li><Link to="/contact">Fennick · Harbour Road</Link></li><li><Link to="/contact" style={{ color: "var(--accent)", fontWeight: 600 }}>Contact us</Link></li></ul></div>
        </div>
        <div className="legal">
          <span>Lintel Homes S.A. · Licensed by the Solvenne Property Authority, licence SPA-0193 · Client money protected by the Deposit Bank of Solvenne</span>
          <span>Solvenne is a fictional country. All listings are illustrative. Photography from Unsplash, used under the Unsplash License.</span>
        </div>
      </div>
    </footer>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
