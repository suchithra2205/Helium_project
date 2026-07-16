"use client";

import { useEffect, useState } from "react";

interface ConfidenceMeterProps {
  value: number;
  gradient: string;
}

export function ConfidenceMeter({ value, gradient }: ConfidenceMeterProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getLabel = (v: number) => {
    if (v >= 85) return { text: "Very High", color: "text-emerald-400" };
    if (v >= 65) return { text: "High", color: "text-sky-400" };
    if (v >= 45) return { text: "Moderate", color: "text-amber-400" };
    return { text: "Low", color: "text-rose-400" };
  };

  const label = getLabel(value);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-3xl font-bold ${label.color}`}>{value}%</span>
        <span className={`text-xs font-semibold uppercase tracking-widest ${label.color}`}>
          {label.text}
        </span>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out shadow-lg`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick} className="text-xs text-white/20">
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}
