export type Category =
  | "pokemon"
  | "esportivas"
  | "tcg"
  | "figurinhas"
  | "outros";

export type Rarity = "comum" | "incomum" | "rara" | "epica" | "lendaria";

export type Condition = "nm" | "sp" | "mp" | "hp" | "dmg";

export interface User {
  id: string;
  username: string;
  name: string;
  avatarHue: number; // deterministic avatar gradient seed
  bio: string;
  location: string;
  joinedAt: string; // ISO
  ratingAvg: number; // 0–5
  ratingCount: number;
  tradesCount: number;
}

export interface Item {
  id: string;
  ownerId: string;
  name: string;
  category: Category;
  rarity: Rarity;
  description: string;
  /** the set/edition shown as mono code, e.g. "151 · 004/165" */
  setCode: string;
  condition: Condition;
  /** procedural art seed + hue for the SVG CardArt */
  artHue: number;
  artSeed: number;
  /** in the owner's collection but flagged available for trade */
  forTrade: boolean;
  /** owner's wishlist marker (shown on their profile "procura") */
  wishlist?: boolean;
  createdAt: string; // ISO
}

export type RatingCriterion = "confiabilidade" | "comunicacao" | "experiencia";

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  confiabilidade: number; // 1–5
  comunicacao: number;
  experiencia: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  /** optional attached item reference (a trade proposal context) */
  itemRefId?: string;
  createdAt: string;
}

export type ConversationStatus = "ativa" | "negociando" | "concluida";

export interface Conversation {
  id: string;
  /** the two participant user ids */
  participants: [string, string];
  status: ConversationStatus;
  /** item that started the conversation (the one being negotiated) */
  aboutItemId?: string;
  createdAt: string;
}
