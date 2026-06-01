interface Props {
  size?: number;
  withText?: boolean;
}

export function Logo({ size = 28, withText = true }: Props) {
  return (
    <span className="logo" aria-label="CardLink">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="logo-foil" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.88 0.16 132)" />
            <stop offset="0.5" stopColor="oklch(0.86 0.15 170)" />
            <stop offset="1" stopColor="oklch(0.82 0.15 78)" />
          </linearGradient>
        </defs>
        {/* back card */}
        <rect
          x="4"
          y="7"
          width="15"
          height="21"
          rx="3"
          transform="rotate(-9 11.5 17.5)"
          fill="var(--surface-2)"
          stroke="var(--line)"
          strokeWidth="1.4"
        />
        {/* front card with foil */}
        <rect
          x="13"
          y="5"
          width="15"
          height="21"
          rx="3"
          transform="rotate(8 20.5 15.5)"
          fill="url(#logo-foil)"
        />
        <circle cx="20.5" cy="15.5" r="3.4" fill="oklch(0.18 0.04 150)" transform="rotate(8 20.5 15.5)" />
      </svg>
      {withText && <span className="logo__word">CardLink</span>}
    </span>
  );
}
