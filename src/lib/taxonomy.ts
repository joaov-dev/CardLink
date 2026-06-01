import type { Category, Rarity, Condition } from "@/data/types";

export const rarityConfig: Record<
  Rarity,
  { label: string; color: string; order: number; holo: boolean }
> = {
  comum: { label: "Comum", color: "var(--r-comum)", order: 0, holo: false },
  incomum: { label: "Incomum", color: "var(--r-incomum)", order: 1, holo: false },
  rara: { label: "Rara", color: "var(--r-rara)", order: 2, holo: true },
  epica: { label: "Épica", color: "var(--r-epica)", order: 3, holo: true },
  lendaria: { label: "Lendária", color: "var(--r-lendaria)", order: 4, holo: true },
};

export const rarityOrder: Rarity[] = [
  "comum",
  "incomum",
  "rara",
  "epica",
  "lendaria",
];

export const categoryConfig: Record<
  Category,
  { label: string; short: string }
> = {
  pokemon: { label: "Cartas Pokémon", short: "Pokémon" },
  esportivas: { label: "Cartas esportivas", short: "Esportivas" },
  tcg: { label: "Jogos (TCG)", short: "TCG" },
  figurinhas: { label: "Figurinhas", short: "Figurinhas" },
  outros: { label: "Outros colecionáveis", short: "Outros" },
};

export const categoryOrder: Category[] = [
  "pokemon",
  "esportivas",
  "tcg",
  "figurinhas",
  "outros",
];

export const conditionConfig: Record<
  Condition,
  { label: string; full: string }
> = {
  nm: { label: "NM", full: "Near Mint (quase perfeita)" },
  sp: { label: "SP", full: "Slightly Played (leve desgaste)" },
  mp: { label: "MP", full: "Moderately Played (desgaste visível)" },
  hp: { label: "HP", full: "Heavily Played (bastante usada)" },
  dmg: { label: "DMG", full: "Damaged (danificada)" },
};
