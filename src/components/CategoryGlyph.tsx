import type { Category } from "@/data/types";

interface Props {
  category: Category;
  size?: number;
}

/**
 * Centered emblem drawn for the card art window. Stroke uses currentColor.
 * Each glyph is centered on (0,0) so it can be translated into place.
 */
export function CategoryGlyph({ category, size = 80 }: Props) {
  const s = size / 2;
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: size * 0.045,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  switch (category) {
    case "pokemon":
      // pokéball-ish orb
      return (
        <g>
          <circle cx="0" cy="0" r={s} {...common} />
          <line x1={-s} y1="0" x2={s} y2="0" {...common} />
          <circle cx="0" cy="0" r={s * 0.28} fill="currentColor" />
          <circle cx="0" cy="0" r={s * 0.14} fill="oklch(0.16 0.02 156)" />
        </g>
      );
    case "esportivas":
      // shield
      return (
        <g>
          <path
            d={`M0 ${-s} L${s * 0.85} ${-s * 0.55} L${s * 0.85} ${s * 0.2} Q${s * 0.85} ${s * 0.8} 0 ${s} Q${-s * 0.85} ${s * 0.8} ${-s * 0.85} ${s * 0.2} L${-s * 0.85} ${-s * 0.55} Z`}
            {...common}
          />
          <path d={`M0 ${-s * 0.45} L${s * 0.28} ${s * 0.2} L${-s * 0.28} ${s * 0.2} Z`} {...common} />
        </g>
      );
    case "tcg":
      // mana-ish diamond + spark
      return (
        <g>
          <path d={`M0 ${-s} L${s} 0 L0 ${s} L${-s} 0 Z`} {...common} />
          <path d={`M0 ${-s * 0.45} L${s * 0.45} 0 L0 ${s * 0.45} L${-s * 0.45} 0 Z`} fill="currentColor" />
        </g>
      );
    case "figurinhas":
      // star
      return (
        <g>
          <path
            d={starPath(s)}
            {...common}
          />
        </g>
      );
    default:
      // hexagon (outros)
      return (
        <g>
          <path d={hexPath(s)} {...common} />
          <circle cx="0" cy="0" r={s * 0.22} fill="currentColor" />
        </g>
      );
  }
}

function starPath(s: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? s : s * 0.42;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

function hexPath(s: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${(Math.cos(a) * s).toFixed(2)} ${(Math.sin(a) * s).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}
