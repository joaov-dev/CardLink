import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  users as seedUsers,
  items as seedItems,
  ratings as seedRatings,
  conversations as seedConversations,
  messages as seedMessages,
} from "./seed";
import type {
  User,
  Item,
  Rating,
  Conversation,
  Message,
  ConversationStatus,
} from "./types";

interface State {
  users: User[];
  items: Item[];
  ratings: Rating[];
  conversations: Conversation[];
  messages: Message[];
  currentUserId: string | null; // null = logged out
}

type Action =
  | { type: "login"; userId: string }
  | { type: "register"; user: User }
  | { type: "logout" }
  | { type: "addItem"; item: Item }
  | { type: "updateItem"; id: string; patch: Partial<Item> }
  | { type: "removeItem"; id: string }
  | { type: "updateProfile"; patch: Partial<User> }
  | { type: "sendMessage"; message: Message }
  | { type: "startConversation"; conversation: Conversation; message?: Message }
  | { type: "setConversationStatus"; id: string; status: ConversationStatus }
  | { type: "addRating"; rating: Rating };

const STORAGE_KEY = "cardlink:v1";

const baseState: State = {
  users: seedUsers,
  items: seedItems,
  ratings: seedRatings,
  conversations: seedConversations,
  messages: seedMessages,
  // Deslogado por padrão: a visita começa na landing. "Explorar como
  // demonstração" / login entram no app como CURRENT_USER_ID.
  currentUserId: null,
};

function recomputeRating(users: User[], ratings: Rating[], userId: string): User[] {
  const received = ratings.filter((r) => r.toUserId === userId);
  if (received.length === 0) return users;
  const avg =
    received.reduce(
      (sum, r) => sum + (r.confiabilidade + r.comunicacao + r.experiencia) / 3,
      0,
    ) / received.length;
  return users.map((u) =>
    u.id === userId
      ? { ...u, ratingAvg: Math.round(avg * 10) / 10, ratingCount: received.length }
      : u,
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "login":
      return { ...state, currentUserId: action.userId };
    case "register":
      return {
        ...state,
        users: [...state.users, action.user],
        currentUserId: action.user.id,
      };
    case "logout":
      return { ...state, currentUserId: null };
    case "addItem":
      return { ...state, items: [action.item, ...state.items] };
    case "updateItem":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, ...action.patch } : i,
        ),
      };
    case "removeItem":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "updateProfile":
      if (!state.currentUserId) return state;
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === state.currentUserId ? { ...u, ...action.patch } : u,
        ),
      };
    case "sendMessage":
      return { ...state, messages: [...state.messages, action.message] };
    case "startConversation":
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
        messages: action.message
          ? [...state.messages, action.message]
          : state.messages,
      };
    case "setConversationStatus":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.id ? { ...c, status: action.status } : c,
        ),
      };
    case "addRating": {
      const ratings = [...state.ratings, action.rating];
      return {
        ...state,
        ratings,
        users: recomputeRating(state.users, ratings, action.rating.toUserId),
      };
    }
    default:
      return state;
  }
}

function loadState(): State {
  if (typeof window === "undefined") return baseState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseState;
    const parsed = JSON.parse(raw) as Partial<State>;
    // shallow-merge so new seed entities still appear for returning sessions
    return { ...baseState, ...parsed };
  } catch {
    return baseState;
  }
}

interface StoreValue extends State {
  currentUser: User | null;
  dispatch: React.Dispatch<Action>;
  getUser: (id: string) => User | undefined;
  getItem: (id: string) => Item | undefined;
  userItems: (userId: string) => Item[];
  userRatings: (userId: string) => Rating[];
  conversationMessages: (conversationId: string) => Message[];
  reset: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable — session-only is acceptable */
    }
  }, [state]);

  const getUser = useCallback(
    (id: string) => state.users.find((u) => u.id === id),
    [state.users],
  );
  const getItem = useCallback(
    (id: string) => state.items.find((i) => i.id === id),
    [state.items],
  );
  const userItems = useCallback(
    (userId: string) => state.items.filter((i) => i.ownerId === userId),
    [state.items],
  );
  const userRatings = useCallback(
    (userId: string) =>
      state.ratings
        .filter((r) => r.toUserId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.ratings],
  );
  const conversationMessages = useCallback(
    (conversationId: string) =>
      state.messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [state.messages],
  );
  const reset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      currentUser: state.currentUserId
        ? state.users.find((u) => u.id === state.currentUserId) ?? null
        : null,
      dispatch,
      getUser,
      getItem,
      userItems,
      userRatings,
      conversationMessages,
      reset,
    }),
    [state, getUser, getItem, userItems, userRatings, conversationMessages, reset],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return ctx;
}

export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
