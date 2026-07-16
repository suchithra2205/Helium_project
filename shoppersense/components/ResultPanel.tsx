"use client";

import { ConfidenceMeter } from "@/components/ConfidenceMeter";
import { ClassificationResult, ShopperState, STATE_CONFIG } from "@/types";

interface ResultPanelProps {
  result: ClassificationResult;
}

export function ResultPanel({ result }: ResultPanelProps) {
  const state = result.state as ShopperState;
  const config = STATE_CONFIG[state] || STATE_CONFIG["Browser"];

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* State Badge */}
      <div className={`rounded-2xl p-5 ${config.bg} border border-white/10`}>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{config.icon}</span>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">
              Shopper State
            </p>
            <h2 className={`text-2xl font-bold ${config.color}`}>
              {result.state}
            </h2>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">
          Confidence Score
        </p>
        <ConfidenceMeter value={result.confidence} gradient={config.gradient} />
      </div>

      {/* Evidence */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">
          Evidence
        </p>
        <ul className="space-y-2">
          {result.evidence.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/80">
              <span className={`mt-0.5 text-xs ${config.color}`}>●</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Actions */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">
          Recommended Actions
        </p>
        <ul className="space-y-2">
          {result.recommended_actions.map((action, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-white/80">
              <span className={`text-base ${config.color}`}>✓</span>
              {action}
            </li>
          ))}
        </ul>
      </div>

      {/* Reasoning */}
      <div className={`rounded-2xl p-5 bg-gradient-to-br ${config.gradient} bg-opacity-10 border border-white/10`}>
        <p className="text-xs uppercase tracking-widest text-white/60 font-semibold mb-2">
          AI Reasoning
        </p>
        <p className="text-sm text-white/90 leading-relaxed italic">
          &ldquo;{result.reasoning}&rdquo;
        </p>
      </div>
    </div>
  );
}
