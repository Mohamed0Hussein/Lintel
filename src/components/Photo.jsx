import { BIG } from "../data/photos";
import { AGENTS } from "../data/agents";

const base = import.meta.env.BASE_URL;
export const BIG_SET = BIG;
export const pf = (i, w) => `${base}img/${typeof i === "number" ? "p" + String(i).padStart(2, "0") : i}-${w}.webp`;

export function Photo({ id, alt, sizes = "(max-width:640px) 100vw, 420px", className, eager, style }) {
  const set = [800, 1600].concat(BIG.has(id) ? [2400] : []).map((w) => `${pf(id, w)} ${w}w`).join(", ");
  return (
    <img className={className} src={pf(id, 800)} srcSet={set} sizes={sizes} width="800" height="533" alt={alt}
      loading={eager ? undefined : "lazy"} fetchpriority={eager ? "high" : undefined} decoding="async" style={style} />
  );
}

export function Portrait({ i, sizes = "300px", className, eager }) {
  return (
    <img className={className} src={`${base}img/a${i}-600.webp`} srcSet={`${base}img/a${i}-600.webp 600w, ${base}img/a${i}-1000.webp 1000w`}
      sizes={sizes} width="600" height="750" alt={`Portrait of ${AGENTS[i].name}`} loading={eager ? undefined : "lazy"}
      fetchpriority={eager ? "high" : undefined} decoding="async" />
  );
}
