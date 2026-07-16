export type EventType =
  | "page_view"
  | "search"
  | "product_view"
  | "add_to_cart"
  | "cart_abandon"
  | "checkout_start"
  | "purchase"
  | "wishlist_add"
  | "coupon_search"
  | "discount_click"
  | "category_browse"
  | "price_sort";

export interface SessionEvent {
  id: string;
  type: EventType;
  page?: string;
  query?: string;
  product?: string;
  category?: string;
}

export interface BehaviorSignals {
  session_id?: string;
  total_events: number;
  page_views: number;
  unique_products_viewed: number;
  repeat_product_views: number;
  searches: number;
  add_to_cart: boolean;
  cart_count: number;
  checkout_started: boolean;
  purchase_completed: boolean;
  cart_abandoned: boolean;
  wishlist_adds: number;
  coupon_searches: number;
  discount_clicks: number;
  category_browses: number;
  price_sorts: number;
  has_previous_session: boolean;
  estimated_session_minutes: number;
}

export type ShopperState =
  | "Browser"
  | "Comparer"
  | "Discount Seeker"
  | "Cart Abandoner"
  | "Loyal Customer"
  | "High Intent Buyer"
  | "Returning Visitor";

export interface ClassificationResult {
  state: ShopperState;
  confidence: number;
  reasoning: string;
  evidence: string[];
  recommended_actions: string[];
}

export const DEFAULT_EVENTS: SessionEvent[] = [
  { id: "1", type: "page_view", page: "home" },
  { id: "2", type: "search", query: "nike running shoes" },
  { id: "3", type: "product_view", product: "Nike Air Max" },
  { id: "4", type: "add_to_cart" },
  { id: "5", type: "cart_abandon" },
];

export const EVENT_TYPE_OPTIONS: EventType[] = [
  "page_view",
  "search",
  "product_view",
  "add_to_cart",
  "cart_abandon",
  "checkout_start",
  "purchase",
  "wishlist_add",
  "coupon_search",
  "discount_click",
  "category_browse",
  "price_sort",
];

export const STATE_CONFIG: Record<
  ShopperState,
  { icon: string; color: string; gradient: string; bg: string }
> = {
  Browser: {
    icon: "🌐",
    color: "text-sky-400",
    gradient: "from-sky-500 to-blue-600",
    bg: "bg-sky-500/10",
  },
  Comparer: {
    icon: "⚖️",
    color: "text-violet-400",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
  },
  "Discount Seeker": {
    icon: "🏷️",
    color: "text-amber-400",
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/10",
  },
  "Cart Abandoner": {
    icon: "🛒",
    color: "text-rose-400",
    gradient: "from-rose-500 to-red-600",
    bg: "bg-rose-500/10",
  },
  "Loyal Customer": {
    icon: "⭐",
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10",
  },
  "High Intent Buyer": {
    icon: "🚀",
    color: "text-indigo-400",
    gradient: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-500/10",
  },
  "Returning Visitor": {
    icon: "🔄",
    color: "text-teal-400",
    gradient: "from-teal-500 to-cyan-600",
    bg: "bg-teal-500/10",
  },
};
