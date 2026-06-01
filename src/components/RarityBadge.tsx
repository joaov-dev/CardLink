import { Circle, Sparkle, Sparkles, Gem, Crown } from "lucide-react";
import type { Rarity } from "@/data/types";
import { rarityConfig } from "@/lib/taxonomy";

const icons: Record<Rarity, typeof Circle> = {
  comum: Circle,
  incomum: Sparkle,
  rara: Sparkles,
  epica: Gem,
  lendaria: Crown,
};

interface Props {
  rarity: Rarity;
  size?: "sm" | "md";
}

export function RarityBadge({ rarity, size = "md" }: Props) {
  const cfg = rarityConfig[rarity];
  const Icon = icons[rarity];
  return (
    <span
      className={`raritybadge raritybadge--${size}`}
      style={{ "--rarity": cfg.color } as React.CSSProperties}
    >
      <Icon size={size === "sm" ? 12 : 14} strokeWidth={2.25} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
