"use client";

import { useState } from "react";
import { SessionEvent, ClassificationResult, BehaviorSignals, DEFAULT_EVENTS, ShopperState, STATE_CONFIG } from "@/types";
import { SessionEditor } from "@/components/SessionEditor";
import { ResultPanel } from "@/components/ResultPanel";
import { InsightPanel } from "@/components/InsightPanel";

type Tab = "visual" | "json";

export default function Home() {
  const [events, setEvents] = useState<SessionEvent[]>(DEFAULT_EVENTS);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [signals, setSignals] = useState<BehaviorSignals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("visual");
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify({ session_id: "123", events: DEFAULT_EVENTS.map(({ id, ...e }) => e) }, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const classify = async (eventsToClassify: SessionEvent[]) => {
    if (eventsToClassify.length === 0) {
      setError("Please add at least one event to the session.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setSignals(null);

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: eventsToClassify }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Classification failed");
      setResult(data.result);
      setSignals(data.signals);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleJsonClassify = () => {
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      const rawEvents = parsed.events || parsed;
      if (!Array.isArray(rawEvents)) throw new Error("Expected an array of events");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: SessionEvent[] = rawEvents.map((e: any, i: number) => ({
        id: String(i + 1),
        type: e.type as SessionEvent["type"],
        ...(e.page && { page: e.page }),
        ...(e.query && { query: e.query }),
        ...(e.product && { product: e.product }),
        ...(e.category && { category: e.category }),
      }));
      setEvents(mapped);
      classify(mapped);
    } catch (err: unknown) {
      setJsonError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const stateConfig =
    result ? STATE_CONFIG[result.state as ShopperState] : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-sky-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <span className="animate-pulse">●</span> AI-Powered
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent mb-3">
            ShopperSense
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Real-time AI personalization engine — classify shopper intent and get
            actionable recommendations instantly.
          </p>
        </header>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setTab("visual")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "visual"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white"
              }`}
            >
              🎛️ Visual Editor
            </button>
            <button
              onClick={() => setTab("json")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "json"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {"{ }"} JSON Input
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className={`grid gap-6 mb-6 ${result ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-2xl mx-auto"}`}>
          {/* Left Panel */}
          <div className="glass-card rounded-2xl p-6 min-h-[480px] flex flex-col">
            {tab === "visual" ? (
              <SessionEditor events={events} onChange={setEvents} />
            ) : (
              <div className="flex flex-col gap-4 h-full">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    JSON Session Input
                  </h2>
                  <p className="text-white/50 text-sm mt-0.5">
                    Paste or edit a raw session JSON
                  </p>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="flex-1 font-mono text-xs bg-black/30 border border-white/10 rounded-xl p-4 text-green-300 placeholder-white/20 focus:outline-none focus:border-indigo-500 resize-none min-h-[320px]"
                  spellCheck={false}
                />
                {jsonError && (
                  <p className="text-rose-400 text-xs">⚠ {jsonError}</p>
                )}
              </div>
            )}

            {/* Classify Button */}
            <div className="mt-5 pt-5 border-t border-white/10">
              <button
                onClick={() =>
                  tab === "visual" ? classify(events) : handleJsonClassify()
                }
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-500/25 relative overflow-hidden group"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Analyzing Session...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🧠 Classify Shopper Intent
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                )}
              </button>
              {error && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  ⚠ {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          {result && (
            <div
              className={`glass-card rounded-2xl p-6 border ${
                stateConfig ? `border-white/10` : "border-white/10"
              }`}
            >
              <ResultPanel result={result} />
            </div>
          )}
        </div>

        {/* Insight Panel */}
        {signals && <InsightPanel signals={signals} />}

        {/* Empty State */}
        {!result && !loading && (
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 text-white/20 text-sm">
              <span>↑</span> Add events and click classify to see AI insights
            </div>
          </div>
        )}

        {/* Shopper State Reference */}
        <div className="mt-10 glass-card rounded-2xl p-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
            Supported Shopper States
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {(Object.entries(STATE_CONFIG) as [ShopperState, typeof STATE_CONFIG[ShopperState]][]).map(([state, cfg]) => (
              <div
                key={state}
                className={`rounded-xl p-3 text-center ${cfg.bg} border border-white/5`}
              >
                <div className="text-2xl mb-1">{cfg.icon}</div>
                <div className={`text-xs font-semibold ${cfg.color}`}>{state}</div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center mt-10 text-white/20 text-xs">
          ShopperSense · Powered by GPT-4o-mini · Built for Vercel
        </footer>
      </div>
    </div>
  );
}
