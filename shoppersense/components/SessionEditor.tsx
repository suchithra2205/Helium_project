"use client";

import { useState } from "react";
import { SessionEvent, EventType, EVENT_TYPE_OPTIONS } from "@/types";
import { nanoid } from "nanoid";

const EVENT_ICONS: Record<EventType, string> = {
  page_view: "🏠",
  search: "🔍",
  product_view: "👟",
  add_to_cart: "🛒",
  cart_abandon: "⚠️",
  checkout_start: "💳",
  purchase: "✅",
  wishlist_add: "❤️",
  coupon_search: "🏷️",
  discount_click: "💰",
  category_browse: "📂",
  price_sort: "↕️",
};

const EVENT_LABELS: Record<EventType, string> = {
  page_view: "Page View",
  search: "Search",
  product_view: "Product View",
  add_to_cart: "Add to Cart",
  cart_abandon: "Cart Abandon",
  checkout_start: "Checkout Start",
  purchase: "Purchase",
  wishlist_add: "Wishlist Add",
  coupon_search: "Coupon Search",
  discount_click: "Discount Click",
  category_browse: "Category Browse",
  price_sort: "Price Sort",
};

interface SessionEditorProps {
  events: SessionEvent[];
  onChange: (events: SessionEvent[]) => void;
}

export function SessionEditor({ events, onChange }: SessionEditorProps) {
  const [newType, setNewType] = useState<EventType>("page_view");
  const [newMeta, setNewMeta] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const removeEvent = (id: string) => {
    onChange(events.filter((e) => e.id !== id));
  };

  const addEvent = () => {
    const event: SessionEvent = { id: nanoid(), type: newType };
    if (newMeta) {
      if (newType === "search" || newType === "coupon_search") event.query = newMeta;
      else if (newType === "product_view" || newType === "add_to_cart") event.product = newMeta;
      else if (newType === "page_view") event.page = newMeta;
      else if (newType === "category_browse") event.category = newMeta;
    }
    onChange([...events, event]);
    setNewMeta("");
    setShowAddForm(false);
  };

  const needsMeta = (type: EventType) =>
    ["search", "coupon_search", "product_view", "page_view", "category_browse"].includes(type);

  const metaPlaceholder: Record<EventType, string> = {
    page_view: "e.g. home, checkout, category...",
    search: "e.g. nike shoes",
    product_view: "e.g. Nike Air Max",
    coupon_search: "e.g. SAVE20",
    category_browse: "e.g. Footwear",
    add_to_cart: "",
    cart_abandon: "",
    checkout_start: "",
    purchase: "",
    wishlist_add: "",
    discount_click: "",
    price_sort: "",
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Session Events
          </h2>
          <p className="text-white/60 text-sm mt-0.5">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          {showAddForm ? "✕ Cancel" : "+ Add Event"}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card rounded-xl p-4 border border-indigo-500/30 space-y-3">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as EventType)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            {EVENT_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t} className="bg-gray-900">
                {EVENT_ICONS[t]} {EVENT_LABELS[t]}
              </option>
            ))}
          </select>
          {needsMeta(newType) && (
            <input
              type="text"
              placeholder={metaPlaceholder[newType]}
              value={newMeta}
              onChange={(e) => setNewMeta(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder-white/30 focus:outline-none focus:border-indigo-500"
            />
          )}
          <button
            onClick={addEvent}
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            Add Event
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {events.map((event, i) => (
          <div
            key={event.id}
            className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-base flex-shrink-0">
              {EVENT_ICONS[event.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90">
                {EVENT_LABELS[event.type]}
              </p>
              {(event.page || event.query || event.product || event.category) && (
                <p className="text-xs text-white/40 truncate">
                  {event.page || event.query || event.product || event.category}
                </p>
              )}
            </div>
            <span className="text-xs text-white/20 font-mono w-5 text-right flex-shrink-0">
              #{i + 1}
            </span>
            <button
              onClick={() => removeEvent(event.id)}
              className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 text-sm ml-1 transition-all flex-shrink-0"
              title="Remove event"
            >
              ✕
            </button>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center py-10 text-white/30 text-sm">
            No events. Add some above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
