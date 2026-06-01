import { initials } from "@/lib/format";

interface Props {
  name: string;
  hue: number;
  size?: number;
  className?: string;
}

export function Avatar({ name, hue, size = 40, className }: Props) {
  return (
    <span
      className={`avatar ${className ?? ""}`}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(140deg, oklch(0.6 0.16 ${hue}), oklch(0.42 0.13 ${(hue + 55) % 360}))`,
      }}
    >
      {initials(name)}
    </span>
  );
}
