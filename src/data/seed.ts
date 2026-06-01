import type {
  User,
  Item,
  Rating,
  Conversation,
  Message,
} from "./types";

export const CURRENT_USER_ID = "u-me";

// Timestamps anchored to "now" so the demo always feels current.
const now = Date.now();
const ago = (opts: { d?: number; h?: number; m?: number }): string =>
  new Date(
    now -
      ((opts.d ?? 0) * 86400 + (opts.h ?? 0) * 3600 + (opts.m ?? 0) * 60) * 1000,
  ).toISOString();

export const users: User[] = [
  {
    id: "u-me",
    username: "voce",
    name: "Você",
    avatarHue: 132,
    bio: "Colecionador de Pokémon desde a 1ª edição. Caçando a Charizard Base Set. Troco com carinho, sempre com sleeve.",
    location: "Rio de Janeiro, RJ",
    joinedAt: "2024-03-12",
    ratingAvg: 4.8,
    ratingCount: 23,
    tradesCount: 31,
  },
  {
    id: "u-bia",
    username: "bia.holo",
    name: "Beatriz Antunes",
    avatarHue: 305,
    bio: "Só holo. Foco em Pokémon japonês e promos raras. Empacoto melhor que loja.",
    location: "São Paulo, SP",
    joinedAt: "2023-08-01",
    ratingAvg: 4.9,
    ratingCount: 64,
    tradesCount: 88,
  },
  {
    id: "u-rafa",
    username: "rafa.cards",
    name: "Rafael Lima",
    avatarHue: 250,
    bio: "Cartas esportivas: NBA e Fórmula 1. Tenho rookies graduados. Negocio reto e rápido.",
    location: "Belo Horizonte, MG",
    joinedAt: "2022-11-20",
    ratingAvg: 4.6,
    ratingCount: 41,
    tradesCount: 52,
  },
  {
    id: "u-duda",
    username: "duda.tcg",
    name: "Eduarda Reis",
    avatarHue: 195,
    bio: "Magic e Lorcana. Monto decks e troco o que sobra. Adoro fechar coleção de set.",
    location: "Curitiba, PR",
    joinedAt: "2024-01-05",
    ratingAvg: 4.7,
    ratingCount: 29,
    tradesCount: 33,
  },
  {
    id: "u-theo",
    username: "theo.stickers",
    name: "Theo Mendes",
    avatarHue: 78,
    bio: "Figurinhas de Copa e álbuns antigos. Tenho carrinho de repetidas enorme.",
    location: "Recife, PE",
    joinedAt: "2023-05-17",
    ratingAvg: 4.4,
    ratingCount: 18,
    tradesCount: 22,
  },
  {
    id: "u-nina",
    username: "nina.raros",
    name: "Nina Kowalski",
    avatarHue: 25,
    bio: "Itens raros e lacrados. Coleciono o improvável. Paciente para a troca certa.",
    location: "Porto Alegre, RS",
    joinedAt: "2021-09-30",
    ratingAvg: 5.0,
    ratingCount: 12,
    tradesCount: 14,
  },
];

let idc = 0;
const iid = () => `i-${(++idc).toString().padStart(3, "0")}`;

export const items: Item[] = [
  // Beatriz — Pokémon holo
  {
    id: iid(), ownerId: "u-bia", name: "Charizard Holo", category: "pokemon",
    rarity: "lendaria", description: "Base Set sombra, holo limpa, cantos afiados. A peça da minha vitrine.",
    setCode: "BS · 004/102", condition: "nm", artHue: 28, artSeed: 7,
    forTrade: true, createdAt: "2025-05-02",
  },
  {
    id: iid(), ownerId: "u-bia", name: "Umbreon VMAX Alt", category: "pokemon",
    rarity: "epica", description: "Alt art da Evolving Skies, a 'moonbreon'. Centralização ótima.",
    setCode: "EVS · 215/203", condition: "nm", artHue: 290, artSeed: 3,
    forTrade: true, createdAt: "2025-05-10",
  },
  {
    id: iid(), ownerId: "u-bia", name: "Mew ex Promo", category: "pokemon",
    rarity: "rara", description: "Promo japonesa, foil texturizado. Sleeve desde que chegou.",
    setCode: "PROMO · 205/S-P", condition: "nm", artHue: 320, artSeed: 11,
    forTrade: false, createdAt: "2025-04-21",
  },
  {
    id: iid(), ownerId: "u-bia", name: "Pikachu Illustrator (réplica)", category: "pokemon",
    rarity: "incomum", description: "Réplica de coleção, claramente marcada. Só pra display.",
    setCode: "REPRO · 000/000", condition: "sp", artHue: 95, artSeed: 5,
    forTrade: true, createdAt: "2025-03-30",
  },

  // Rafael — esportivas
  {
    id: iid(), ownerId: "u-rafa", name: "Rookie Prizm Silver", category: "esportivas",
    rarity: "epica", description: "Rookie NBA, refractor prata. Graduado, slab impecável.",
    setCode: "PRIZM · RC-21", condition: "nm", artHue: 250, artSeed: 9,
    forTrade: true, createdAt: "2025-05-14",
  },
  {
    id: iid(), ownerId: "u-rafa", name: "F1 Pole Position Gold", category: "esportivas",
    rarity: "rara", description: "Edição dourada, numerada /99. Foil que muda no ângulo.",
    setCode: "F1-23 · 044/099", condition: "nm", artHue: 78, artSeed: 2,
    forTrade: true, createdAt: "2025-05-01",
  },
  {
    id: iid(), ownerId: "u-rafa", name: "Auto Patch Relic", category: "esportivas",
    rarity: "lendaria", description: "Autógrafo + pedaço de uniforme. Peça de coleção pesada.",
    setCode: "RELIC · 12/25", condition: "nm", artHue: 250, artSeed: 14,
    forTrade: false, createdAt: "2025-02-18",
  },
  {
    id: iid(), ownerId: "u-rafa", name: "Base Veterano", category: "esportivas",
    rarity: "comum", description: "Carta base de veterano, ótima condição. Troco por qualquer rookie.",
    setCode: "BASE · 188", condition: "nm", artHue: 235, artSeed: 1,
    forTrade: true, createdAt: "2025-04-09",
  },

  // Eduarda — TCG
  {
    id: iid(), ownerId: "u-duda", name: "Black Lotus (proxy)", category: "tcg",
    rarity: "incomum", description: "Proxy de alta qualidade, marcada. Pra jogar casual, não é original.",
    setCode: "PROXY · ABU", condition: "sp", artHue: 200, artSeed: 6,
    forTrade: true, createdAt: "2025-05-08",
  },
  {
    id: iid(), ownerId: "u-duda", name: "Elsa Foil — Lorcana", category: "tcg",
    rarity: "epica", description: "Legendary foil da primeira leva. Brilho que parece gelo.",
    setCode: "LOR1 · 042/204", condition: "nm", artHue: 210, artSeed: 8,
    forTrade: true, createdAt: "2025-05-12",
  },
  {
    id: iid(), ownerId: "u-duda", name: "Dual Land Revised", category: "tcg",
    rarity: "rara", description: "Terreno duplo clássico, joga liso há anos. Leve desgaste de borda.",
    setCode: "3ED · LAND", condition: "mp", artHue: 150, artSeed: 4,
    forTrade: true, createdAt: "2025-03-15",
  },
  {
    id: iid(), ownerId: "u-duda", name: "Mythic Rare Promo", category: "tcg",
    rarity: "rara", description: "Promo de pré-lançamento, datada. Foil estendido.",
    setCode: "PRM · 198", condition: "nm", artHue: 300, artSeed: 12,
    forTrade: false, createdAt: "2025-04-28",
  },

  // Theo — figurinhas
  {
    id: iid(), ownerId: "u-theo", name: "Legend Dourada — Copa 70", category: "figurinhas",
    rarity: "lendaria", description: "Figurinha dourada do craque, álbum de 1970. Raridade de feira.",
    setCode: "COPA70 · LEG", condition: "sp", artHue: 78, artSeed: 13,
    forTrade: true, createdAt: "2025-04-30",
  },
  {
    id: iid(), ownerId: "u-theo", name: "Escudo Holográfico", category: "figurinhas",
    rarity: "rara", description: "Escudo holo de seleção, brilho intacto. Tenho 1 repetida só.",
    setCode: "COPA · ESC-12", condition: "nm", artHue: 195, artSeed: 10,
    forTrade: true, createdAt: "2025-05-06",
  },
  {
    id: iid(), ownerId: "u-theo", name: "Craque Base", category: "figurinhas",
    rarity: "comum", description: "Base comum, ótima pra fechar página. Tenho muitas repetidas.",
    setCode: "ALBUM · 233", condition: "nm", artHue: 130, artSeed: 1,
    forTrade: true, createdAt: "2025-05-15",
  },
  {
    id: iid(), ownerId: "u-theo", name: "Mascote Especial", category: "figurinhas",
    rarity: "incomum", description: "Figurinha especial do mascote, fundo metálico.",
    setCode: "ALBUM · M-05", condition: "sp", artHue: 95, artSeed: 7,
    forTrade: false, createdAt: "2025-03-22",
  },

  // Nina — outros / raros
  {
    id: iid(), ownerId: "u-nina", name: "Selo Postal Raro", category: "outros",
    rarity: "epica", description: "Selo comemorativo lacrado em proteção. Item improvável.",
    setCode: "SELO · 1958", condition: "nm", artHue: 25, artSeed: 15,
    forTrade: true, createdAt: "2025-04-11",
  },
  {
    id: iid(), ownerId: "u-nina", name: "Moeda Comemorativa", category: "outros",
    rarity: "rara", description: "Moeda de coleção, cápsula original. Acabamento espelhado.",
    setCode: "MOEDA · 2002", condition: "nm", artHue: 78, artSeed: 3,
    forTrade: true, createdAt: "2025-05-03",
  },
  {
    id: iid(), ownerId: "u-nina", name: "Mini-figura Lacrada", category: "outros",
    rarity: "lendaria", description: "Blister lacrado, série descontinuada. Não abro por nada.",
    setCode: "FIG · 01/50", condition: "nm", artHue: 305, artSeed: 9,
    forTrade: false, createdAt: "2025-01-09",
  },

  // Você — sua coleção
  {
    id: iid(), ownerId: "u-me", name: "Blastoise Holo", category: "pokemon",
    rarity: "epica", description: "Base Set holo, minha primeira holo de verdade. Troco pela Charizard.",
    setCode: "BS · 002/102", condition: "sp", artHue: 220, artSeed: 8,
    forTrade: true, createdAt: "2025-05-09",
  },
  {
    id: iid(), ownerId: "u-me", name: "Venusaur Holo", category: "pokemon",
    rarity: "epica", description: "Holo verde linda, cantos ok. Completando o trio inicial.",
    setCode: "BS · 015/102", condition: "sp", artHue: 145, artSeed: 4,
    forTrade: true, createdAt: "2025-05-09",
  },
  {
    id: iid(), ownerId: "u-me", name: "Gyarados Holo", category: "pokemon",
    rarity: "rara", description: "Holo clássica, swirl leve no holo. Disponível pra troca.",
    setCode: "BS · 006/102", condition: "mp", artHue: 250, artSeed: 6,
    forTrade: true, createdAt: "2025-04-25",
  },
  {
    id: iid(), ownerId: "u-me", name: "Eevee Promo", category: "pokemon",
    rarity: "incomum", description: "Promo fofa, guardo de carinho. Não troco essa.",
    setCode: "PROMO · 037", condition: "nm", artHue: 60, artSeed: 2,
    forTrade: false, createdAt: "2025-03-18",
  },
  {
    id: iid(), ownerId: "u-me", name: "Snorlax Base", category: "pokemon",
    rarity: "comum", description: "Comum em ótimo estado, troco por qualquer holo da Base.",
    setCode: "BS · 027/102", condition: "nm", artHue: 200, artSeed: 1,
    forTrade: true, createdAt: "2025-05-11",
  },
  // Você — procura (wishlist)
  {
    id: iid(), ownerId: "u-me", name: "Charizard Base Set", category: "pokemon",
    rarity: "lendaria", description: "O sonho. Procuro NM ou SP, pago a diferença em cartas.",
    setCode: "BS · 004/102", condition: "nm", artHue: 28, artSeed: 7,
    forTrade: false, wishlist: true, createdAt: "2025-05-16",
  },
];

export const ratings: Rating[] = [
  {
    id: "r-1", fromUserId: "u-bia", toUserId: "u-me",
    confiabilidade: 5, comunicacao: 5, experiencia: 5,
    comment: "Empacotou impecável e respondeu rápido. Troca lisa, recomendo demais.",
    createdAt: ago({ d: 28 }),
  },
  {
    id: "r-2", fromUserId: "u-rafa", toUserId: "u-me",
    confiabilidade: 5, comunicacao: 4, experiencia: 5,
    comment: "Carta exatamente como descrita. Negócio justo e tranquilo.",
    createdAt: ago({ d: 47 }),
  },
  {
    id: "r-3", fromUserId: "u-duda", toUserId: "u-me",
    confiabilidade: 4, comunicacao: 5, experiencia: 5,
    comment: "Super atencioso, mandou fotos extras antes de fechar. Voltaria a trocar.",
    createdAt: ago({ d: 74 }),
  },
  {
    id: "r-4", fromUserId: "u-me", toUserId: "u-bia",
    confiabilidade: 5, comunicacao: 5, experiencia: 5,
    comment: "Referência de empacotamento. Holo chegou perfeita, sleeve duplo.",
    createdAt: ago({ d: 26 }),
  },
  {
    id: "r-5", fromUserId: "u-rafa", toUserId: "u-bia",
    confiabilidade: 5, comunicacao: 5, experiencia: 4,
    comment: "Tudo certo, só demorou um pouco pra postar, mas avisou. Tranquilo.",
    createdAt: ago({ d: 95 }),
  },
];

export const conversations: Conversation[] = [
  {
    id: "c-1", participants: ["u-me", "u-bia"], status: "negociando",
    aboutItemId: "i-001", createdAt: ago({ h: 3 }),
  },
  {
    id: "c-2", participants: ["u-me", "u-rafa"], status: "ativa",
    aboutItemId: "i-006", createdAt: ago({ d: 2 }),
  },
  {
    id: "c-3", participants: ["u-me", "u-duda"], status: "concluida",
    aboutItemId: "i-010", createdAt: ago({ d: 33 }),
  },
];

export const messages: Message[] = [
  // c-1 — negociando Charizard
  { id: "m-1", conversationId: "c-1", senderId: "u-me", body: "Oi Bia! Vi sua Charizard Holo na vitrine, tá lindíssima. Topa trocar?", createdAt: ago({ h: 3 }) },
  { id: "m-2", conversationId: "c-1", senderId: "u-bia", body: "Oi! Topo sim, mas é minha peça principal. O que você tem da Base?", createdAt: ago({ h: 2, m: 51 }) },
  { id: "m-3", conversationId: "c-1", senderId: "u-me", body: "Tenho Blastoise e Venusaur holo (SP), posso fechar o trio com você.", itemRefId: "i-020", createdAt: ago({ h: 2, m: 48 }) },
  { id: "m-4", conversationId: "c-1", senderId: "u-bia", body: "Hmm, gostei. Manda foto dos cantos das duas? Se tiverem bem, fechamos.", createdAt: ago({ h: 2, m: 40 }) },
  { id: "m-5", conversationId: "c-1", senderId: "u-me", body: "Mando hoje à noite com luz boa. Empacoto com sleeve duplo + toploader, pode confiar.", createdAt: ago({ h: 2, m: 38 }) },

  // c-2 — ativa F1
  { id: "m-6", conversationId: "c-2", senderId: "u-me", body: "Rafa, sua F1 Pole Position Gold ainda tá disponível?", createdAt: ago({ d: 2 }) },
  { id: "m-7", conversationId: "c-2", senderId: "u-rafa", body: "Tá sim! Numerada /99, foil muda no ângulo. Tá procurando troca ou compra?", createdAt: ago({ d: 2, m: -14 }) },
  { id: "m-8", conversationId: "c-2", senderId: "u-me", body: "Troca. Tenho um Gyarados holo da Base, te interessa?", itemRefId: "i-022", createdAt: ago({ d: 2, m: -20 }) },

  // c-3 — concluida Lorcana
  { id: "m-9", conversationId: "c-3", senderId: "u-me", body: "Duda, fechado a Elsa foil pelo meu Snorlax + a promo?", createdAt: ago({ d: 33 }) },
  { id: "m-10", conversationId: "c-3", senderId: "u-duda", body: "Fechado! Posto amanhã cedo e te mando o código.", createdAt: ago({ d: 33, m: -7 }) },
  { id: "m-11", conversationId: "c-3", senderId: "u-duda", body: "Postado ✅ código no seu privado. Foi um prazer!", createdAt: ago({ d: 32 }) },
  { id: "m-12", conversationId: "c-3", senderId: "u-me", body: "Chegou perfeita, obrigado! Já te avaliei ⭐", createdAt: ago({ d: 29 }) },
];
