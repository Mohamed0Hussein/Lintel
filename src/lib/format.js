export const fmt = (n) => Math.round(n).toLocaleString("en-GB");
export const money = (n) => "SC " + fmt(n);
export const regNo = (l) => "SLR-" + l.id.slice(0, 2).toUpperCase() + "-" + l.id.slice(2).padStart(5, "0");
export const typeLabel = (t) => (t === "plot" ? "Building plot" : t[0].toUpperCase() + t.slice(1));
export const shortPrice = (l) =>
  l.mode === "rent" ? "SC " + fmt(l.price)
  : l.price >= 1e6 ? "SC " + (l.price / 1e6).toFixed(2).replace(/0$/, "") + "M"
  : "SC " + Math.round(l.price / 1000) + "k";

/** Solvenne stamp levy: 0% to 250k, 2% to 600k, 4% to 1.2M, 6% above. First-time buyers pay none up to 400k. */
export function levy(price, firstTime) {
  const bands = [[250000, 0], [600000, 0.02], [1200000, 0.04], [Infinity, 0.06]];
  let prev = 0, total = 0;
  for (const [limit, rate] of bands) {
    if (price > prev) total += (Math.min(price, limit) - prev) * rate;
    prev = limit;
  }
  return firstTime && price <= 400000 ? 0 : total;
}

export const PRICE_OPTIONS = {
  buy: [200000, 400000, 600000, 800000, 1000000, 1500000, 2000000, 3000000],
  rent: [1000, 1500, 2000, 2500, 3000, 4000],
};

export const store = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } },
};

export const reducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
