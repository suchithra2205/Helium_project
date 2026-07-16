"use client";

import { BehaviorSignals } from "@/types";

interface InsightPanelProps {
  signals: BehaviorSignals;
}

const StatCard = ({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string | number | boolean;
  icon: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-xl p-4 border ${
      highlight
        ? "border-indigo-500/30 bg-indigo-500/10"
        : "border-white/10 bg-white/5"
    } flex items-center gap-3`}
  >
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-xs text-white/40 font-medium">{label}</p>
      <p
        className={`text-lg font-bold ${
          highlight ? "text-indigo-300" : "text-white"
        }`}
      >
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </p>
    </div>
  </div>
);

export function InsightPanel({ signals }: InsightPanelProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">📊</span>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50">
          Behavioral Summary
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard
          icon="⏱️"
          label="Session Length"
          value={`${signals.estimated_session_minutes}m`}
        />
        <StatCard icon="📄" label="Page Views" value={signals.page_views} />
        <StatCard
          icon="🛍️"
          label="Products Viewed"
          value={signals.unique_products_viewed}
        />
        <StatCard icon="🔍" label="Searches" value={signals.searches} />
        <StatCard
          icon="🛒"
          label="Cart Adds"
          value={signals.cart_count}
          highlight={signals.cart_count > 0}
        />
        <StatCard
          icon="💸"
          label="Purchases"
          value={signals.purchase_completed ? 1 : 0}
          highlight={signals.purchase_completed}
        />
        <StatCard
          icon="🔁"
          label="Repeat Views"
          value={signals.repeat_product_views}
        />
      </div>
    </div>
  );
}
