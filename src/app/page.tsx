"use client";

import { useState, useCallback, useEffect } from "react";
import menus from "@/data/menus.json";

type Mood = "がっつり" | "さっぱり" | "あったかい" | "冷たい" | "ヘルシー" | "こってり" | "辛い" | "やさしい" | "パパッと" | "じっくり" | "なつかしい" | "ごほうび" | "飲みたい" | "麺気分" | "どんぶり" | "サクサク";

const MOODS: { label: Mood; emoji: string; color: string }[] = [
  { label: "がっつり", emoji: "🍖", color: "from-red-900/60 to-red-800/30" },
  { label: "さっぱり", emoji: "🥗", color: "from-emerald-900/60 to-emerald-800/30" },
  { label: "あったかい", emoji: "🔥", color: "from-amber-900/60 to-amber-800/30" },
  { label: "冷たい", emoji: "🧊", color: "from-sky-900/60 to-sky-800/30" },
  { label: "ヘルシー", emoji: "🥬", color: "from-lime-900/60 to-lime-800/30" },
  { label: "こってり", emoji: "🧈", color: "from-yellow-900/60 to-yellow-800/30" },
  { label: "辛い", emoji: "🌶️", color: "from-rose-900/60 to-rose-800/30" },
  { label: "やさしい", emoji: "☺️", color: "from-pink-900/60 to-pink-800/30" },
  { label: "パパッと", emoji: "⚡", color: "from-orange-900/60 to-orange-800/30" },
  { label: "じっくり", emoji: "🍲", color: "from-stone-800/60 to-stone-700/30" },
  { label: "なつかしい", emoji: "👵", color: "from-amber-950/60 to-amber-900/30" },
  { label: "ごほうび", emoji: "✨", color: "from-violet-900/60 to-violet-800/30" },
  { label: "飲みたい", emoji: "🍺", color: "from-yellow-800/60 to-yellow-700/30" },
  { label: "麺気分", emoji: "🍜", color: "from-orange-950/60 to-orange-900/30" },
  { label: "どんぶり", emoji: "🍚", color: "from-stone-700/60 to-stone-600/30" },
  { label: "サクサク", emoji: "🍤", color: "from-amber-800/60 to-amber-700/30" },
];

const HISTORY_KEY = "yorumeshi-history";
const MAX_HISTORY = 10;
const MAX_REROLL = 1;

function getHistory(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function addHistory(id: number) {
  const history = getHistory();
  const updated = [id, ...history.filter((h) => h !== id)].slice(
    0,
    MAX_HISTORY
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export default function Home() {
  const [phase, setPhase] = useState<"mood" | "result">("mood");
  const [result, setResult] = useState<(typeof menus)[number] | null>(null);
  const [rerollCount, setRerollCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  const pickMenu = useCallback((mood?: Mood) => {
    const history = getHistory();
    let candidates = menus.filter((m) => !history.includes(m.id));
    if (mood) {
      candidates = candidates.filter((m) => m.mood.includes(mood));
    }
    if (candidates.length === 0) {
      candidates = mood
        ? menus.filter((m) => m.mood.includes(mood))
        : [...menus];
    }
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    return pick;
  }, []);

  const handleMoodSelect = (mood?: Mood) => {
    const pick = pickMenu(mood);
    setIsAnimating(true);
    setTimeout(() => {
      setResult(pick);
      setRerollCount(0);
      setPhase("result");
      addHistory(pick.id);
      setIsAnimating(false);
    }, 400);
  };

  const handleReroll = () => {
    if (rerollCount >= MAX_REROLL) return;
    const currentMoods = result?.mood as Mood[] | undefined;
    const mood = currentMoods?.[0];
    const pick = pickMenu(mood);
    setIsAnimating(true);
    setTimeout(() => {
      setResult(pick);
      setRerollCount((c) => c + 1);
      addHistory(pick.id);
      setIsAnimating(false);
    }, 400);
  };

  const handleReset = () => {
    setPhase("mood");
    setResult(null);
    setRerollCount(0);
  };

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      {/* App Header */}
      <header className="sticky top-0 z-20 flex items-center justify-center px-6 pt-[env(safe-area-inset-top)] backdrop-blur-md bg-[#1a1511]/80 border-b border-white/5">
        <div className="flex items-center gap-2 py-3">
          <span className="text-2xl">🍽️</span>
          <h1 className="text-xl font-bold tracking-tight text-[#f5ece3]">
            よるめし
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-5 pb-8">
        {phase === "mood" && (
          <div
            className={`flex w-full max-w-md flex-1 flex-col transition-opacity duration-300 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Subtitle */}
            <p
              className="animate-fade-up mt-6 mb-5 text-center text-base font-medium text-[#a89888]"
              style={{ animationDelay: "0.05s" }}
            >
              今日の気分は？
            </p>

            {/* Mood Grid */}
            <div className="mood-grid grid grid-cols-3 gap-2.5 overflow-y-auto flex-1 pb-4">
              {mounted &&
                MOODS.map(({ label, emoji, color }, i) => (
                  <button
                    key={label}
                    onClick={() => handleMoodSelect(label)}
                    className={`mood-btn animate-pop-in flex flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-br ${color} px-2 py-4`}
                    style={{ animationDelay: `${0.03 * i + 0.1}s` }}
                  >
                    <span className="mood-emoji text-3xl leading-none">
                      {emoji}
                    </span>
                    <span className="text-xs font-medium text-[#f5ece3]/90">
                      {label}
                    </span>
                  </button>
                ))}
            </div>

            {/* Omakase */}
            <div
              className="animate-fade-up pt-2 pb-2 text-center"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                onClick={() => handleMoodSelect()}
                className="omakase-btn rounded-full border border-white/10 px-8 py-3 text-sm font-bold text-[#f5ece3] transition-all active:scale-95"
              >
                🎲 おまかせで決める
              </button>
            </div>
          </div>
        )}

        {phase === "result" && result && (
          <div
            className={`flex flex-1 flex-col items-center justify-center gap-10 transition-opacity duration-300 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            <p className="animate-fade-up text-base text-[#a89888]">
              今日の晩ごはんは
            </p>

            <div
              className="animate-result-reveal flex flex-col items-center gap-3"
              style={{ animationDelay: "0.15s" }}
            >
              <span className="text-center text-5xl font-black leading-tight tracking-tight text-[#f5ece3] sm:text-6xl">
                {result.name}
              </span>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {(result.mood as string[]).slice(0, 4).map((m) => {
                  const mood = MOODS.find((md) => md.label === m);
                  return (
                    <span
                      key={m}
                      className="rounded-full bg-white/8 px-3 py-1 text-xs text-[#a89888]"
                    >
                      {mood?.emoji} {m}
                    </span>
                  );
                })}
              </div>
            </div>

            <div
              className="animate-fade-up flex flex-col items-center gap-4"
              style={{ animationDelay: "0.4s" }}
            >
              {rerollCount < MAX_REROLL ? (
                <button
                  onClick={handleReroll}
                  className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-base font-bold text-[#f5ece3] transition-all active:scale-95 hover:bg-white/10"
                >
                  🔄 やだ
                </button>
              ) : (
                <p className="text-sm font-medium text-orange-400/80">
                  ✨ これに決まり！
                </p>
              )}

              <button
                onClick={handleReset}
                className="text-sm text-[#a89888]/60 underline underline-offset-4 transition-colors hover:text-[#a89888]"
              >
                最初から
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
