import { Star } from "lucide-react";

interface Props {
  value: number; // 0–5, may be fractional
  size?: number;
  showValue?: boolean;
  count?: number;
}

export function RatingStars({ value, size = 16, showValue = false, count }: Props) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="ratingstars" title={`${value.toFixed(1)} de 5`}>
      <span className="ratingstars__track" style={{ "--star-size": `${size}px` } as React.CSSProperties}>
        <span className="ratingstars__row ratingstars__row--bg" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} strokeWidth={1.75} />
          ))}
        </span>
        <span className="ratingstars__row ratingstars__row--fill" style={{ width: `${pct}%` }} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} strokeWidth={1.75} fill="currentColor" />
          ))}
        </span>
      </span>
      {showValue && (
        <span className="ratingstars__value">
          <strong>{value.toFixed(1)}</strong>
          {typeof count === "number" && (
            <span className="ratingstars__count">
              ({count} {count === 1 ? "avaliação" : "avaliações"})
            </span>
          )}
        </span>
      )}
      <span className="sr-only">
        {value.toFixed(1)} de 5 estrelas
        {typeof count === "number" ? `, ${count} avaliações` : ""}
      </span>
    </span>
  );
}
