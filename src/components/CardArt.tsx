import { useId } from "react";
import type { Item } from "@/data/types";
import { rarityConfig, conditionConfig } from "@/lib/taxonomy";
import { CategoryGlyph } from "./CategoryGlyph";
import "./CardArt.css";

interface Props {
  item: Item;
  /** show name/set/rarity chrome over the art (full card face) */
  chrome?: boolean;
  className?: string;
}

/** Deterministic pseudo-random from a seed, 0..1 */
function rng(seed: number) {
  let s = seed * 9973 + 1;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * Procedural collectible card face rendered as SVG.
 * The "art window" is generated from artHue + artSeed so every item looks
 * distinct and on-theme without shipping (and breaking) real photography.
 */
export function CardArt({ item, chrome = true, className }: Props) {
  const uid = useId().replace(/:/g, "");
  const r = rarityConfig[item.rarity];
  const next = rng(item.artSeed + item.name.length);
  const h = item.artHue;

  // a few seeded blobs for the abstract art window
  const blobs = Array.from({ length: 4 }, () => ({
    cx: 30 + next() * 190,
    cy: 30 + next() * 150,
    rad: 28 + next() * 70,
    hue: (h + (next() * 60 - 30) + 360) % 360,
    op: 0.5 + next() * 0.35,
  }));

  const facets = Array.from({ length: r.holo ? 7 : 0 }, () => ({
    x: next() * 250,
    y: next() * 210,
    w: 18 + next() * 40,
    rot: next() * 90,
  }));

  return (
    <div
      className={`cardart cardart--${item.rarity} ${chrome ? "" : "cardart--bare"} ${className ?? ""}`}
      data-holo={r.holo}
    >
      <svg viewBox="0 0 250 350" role="img" aria-label={`${item.name}, ${r.label}`}>
        <defs>
          <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`oklch(0.34 0.09 ${h})`} />
            <stop offset="1" stopColor={`oklch(0.18 0.05 ${(h + 40) % 360})`} />
          </linearGradient>
          <radialGradient id={`glow${uid}`} cx="0.5" cy="0.4" r="0.8">
            <stop offset="0" stopColor={`oklch(0.7 0.16 ${h})`} stopOpacity="0.9" />
            <stop offset="1" stopColor={`oklch(0.3 0.08 ${h})`} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`holo${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`oklch(0.85 0.18 ${h})`} />
            <stop offset="0.33" stopColor={`oklch(0.88 0.16 ${(h + 90) % 360})`} />
            <stop offset="0.66" stopColor={`oklch(0.85 0.17 ${(h + 200) % 360})`} />
            <stop offset="1" stopColor={`oklch(0.88 0.16 ${(h + 300) % 360})`} />
          </linearGradient>
          <clipPath id={`win${uid}`}>
            <rect
              x="14"
              y={chrome ? 44 : 14}
              width="222"
              height={chrome ? 232 : 322}
              rx="10"
            />
          </clipPath>
        </defs>

        {/* card base */}
        <rect x="0" y="0" width="250" height="350" rx="16" fill="var(--surface)" />
        <rect
          x="3"
          y="3"
          width="244"
          height="344"
          rx="14"
          fill="none"
          stroke={r.color}
          strokeOpacity="0.55"
          strokeWidth="2"
        />

        {/* art window */}
        <g clipPath={`url(#win${uid})`}>
          <rect x="0" y="0" width="250" height="350" fill={`url(#bg${uid})`} />
          <rect x="0" y="0" width="250" height="350" fill={`url(#glow${uid})`} />
          {blobs.map((b, i) => (
            <circle
              key={i}
              cx={b.cx}
              cy={b.cy}
              r={b.rad}
              fill={`oklch(0.62 0.15 ${b.hue})`}
              opacity={b.op}
              style={{ mixBlendMode: "screen" }}
            />
          ))}
          {/* holo facets */}
          {facets.map((f, i) => (
            <rect
              key={i}
              x={f.x}
              y={f.y}
              width={f.w}
              height={f.w * 2.2}
              rx="3"
              fill={`url(#holo${uid})`}
              opacity="0.22"
              transform={`rotate(${f.rot} ${f.x} ${f.y})`}
              style={{ mixBlendMode: "color-dodge" }}
            />
          ))}
          {/* centered category emblem */}
          <g
            opacity="0.92"
            transform={`translate(125 ${chrome ? 160 : 175})`}
            style={{ color: "oklch(0.97 0.02 " + h + ")" }}
          >
            <CategoryGlyph category={item.category} size={chrome ? 84 : 110} />
          </g>
          {/* moving sheen for holo cards */}
          {r.holo && (
            <rect
              className="cardart__sheen"
              x="-120"
              y="0"
              width="90"
              height="350"
              fill={`url(#holo${uid})`}
              opacity="0.0"
              transform="skewX(-18)"
            />
          )}
        </g>

        {chrome && (
          <>
            {/* top banner */}
            <text
              x="18"
              y="30"
              fontSize="16"
              fontWeight="600"
              fill="var(--ink)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.name.length > 20 ? item.name.slice(0, 19) + "…" : item.name}
            </text>
            {/* bottom plate */}
            <rect x="14" y="286" width="222" height="50" rx="10" fill="oklch(0.16 0.02 156 / 0.85)" />
            <circle cx="30" cy="311" r="5" fill={r.color} />
            <text x="42" y="308" fontSize="12" fontWeight="600" fill="var(--ink)">
              {r.label}
            </text>
            <text x="42" y="323" fontSize="9.5" fill="var(--muted)">
              {conditionConfig[item.condition].label}
            </text>
            <text
              x="227"
              y="316"
              fontSize="10"
              textAnchor="end"
              fill="var(--muted)"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {item.setCode}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
