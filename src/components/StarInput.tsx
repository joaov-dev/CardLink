import { useState } from "react";
import { Star } from "lucide-react";
import "./StarInput.css";

interface Props {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
}

const wordFor = ["", "Ruim", "Regular", "Boa", "Ótima", "Excelente"];

export function StarInput({ label, hint, value, onChange }: Props) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="starinput">
      <div className="starinput__label">
        <span>{label}</span>
        {hint && <span className="starinput__hint">{hint}</span>}
      </div>
      <div
        className="starinput__row"
        role="radiogroup"
        aria-label={label}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
            className={`starinput__star ${n <= shown ? "is-on" : ""}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
          >
            <Star size={28} strokeWidth={1.75} fill={n <= shown ? "currentColor" : "none"} />
          </button>
        ))}
        <span className="starinput__word">{wordFor[shown]}</span>
      </div>
    </div>
  );
}
