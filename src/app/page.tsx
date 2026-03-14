"use client";

import { useState, useCallback, useEffect } from "react";
import menus from "@/data/menus.json";

type Mood = "がっつり" | "さっぱり" | "あったかい" | "冷たい" | "ヘルシー" | "こってり" | "辛い" | "やさしい" | "パパッと" | "じっくり" | "なつかしい" | "ごほうび" | "飲みたい" | "麺気分" | "どんぶり" | "サクサク";

type MoodDef = { label: Mood; emoji: string; bg: string; text: string };

const MOOD_MAP: Record<Mood, MoodDef> = {
  がっつり: { label: "がっつり", emoji: "🍖", bg: "bg-red-100", text: "text-red-700" },
  さっぱり: { label: "さっぱり", emoji: "🥗", bg: "bg-emerald-100", text: "text-emerald-700" },
  あったかい: { label: "あったかい", emoji: "🔥", bg: "bg-orange-100", text: "text-orange-700" },
  冷たい: { label: "冷たい", emoji: "🧊", bg: "bg-sky-100", text: "text-sky-700" },
  ヘルシー: { label: "ヘルシー", emoji: "🥬", bg: "bg-lime-100", text: "text-lime-700" },
  こってり: { label: "こってり", emoji: "🧈", bg: "bg-amber-100", text: "text-amber-700" },
  辛い: { label: "辛い", emoji: "🌶️", bg: "bg-rose-100", text: "text-rose-700" },
  やさしい: { label: "やさしい", emoji: "☺️", bg: "bg-pink-100", text: "text-pink-600" },
  パパッと: { label: "パパッと", emoji: "⚡", bg: "bg-yellow-100", text: "text-yellow-700" },
  じっくり: { label: "じっくり", emoji: "🍲", bg: "bg-stone-200", text: "text-stone-700" },
  なつかしい: { label: "なつかしい", emoji: "👵", bg: "bg-orange-50", text: "text-orange-600" },
  ごほうび: { label: "ごほうび", emoji: "✨", bg: "bg-violet-100", text: "text-violet-700" },
  飲みたい: { label: "飲みたい", emoji: "🍺", bg: "bg-yellow-50", text: "text-yellow-700" },
  麺気分: { label: "麺気分", emoji: "🍜", bg: "bg-orange-100", text: "text-orange-600" },
  どんぶり: { label: "どんぶり", emoji: "🍚", bg: "bg-amber-50", text: "text-amber-700" },
  サクサク: { label: "サクサク", emoji: "🍤", bg: "bg-yellow-100", text: "text-amber-700" },
};

type MoodGroup = {
  title: string;
  icon: string;
  cols: 2 | 3;
  moods: Mood[];
};

const MOOD_GROUPS: MoodGroup[] = [
  {
    title: "味の気分",
    icon: "😋",
    cols: 2,
    moods: ["がっつり", "さっぱり"],
  },
  {
    title: "",
    icon: "",
    cols: 3,
    moods: ["こってり", "辛い", "やさしい"],
  },
  {
    title: "温度",
    icon: "🌡️",
    cols: 2,
    moods: ["あったかい", "冷たい"],
  },
  {
    title: "食べ方",
    icon: "🍴",
    cols: 3,
    moods: ["ヘルシー", "パパッと", "じっくり"],
  },
  {
    title: "ジャンル",
    icon: "🏷️",
    cols: 3,
    moods: ["麺気分", "どんぶり", "サクサク"],
  },
  {
    title: "シーン",
    icon: "🌙",
    cols: 3,
    moods: ["なつかしい", "ごほうび", "飲みたい"],
  },
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

  let globalIndex = 0;

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      {/* App Header */}
      <header className="sticky top-0 z-20 flex items-center justify-center px-6 pt-[env(safe-area-inset-top)] backdrop-blur-lg bg-[#fef6ee]/80 border-b border-orange-200/40">
        <div className="flex items-center gap-2.5 py-3">
          <span className="text-2xl">🍽️</span>
          <h1 className="text-xl font-black tracking-tight text-orange-900">
            よるめし
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-5 pb-6">
        {phase === "mood" && (
          <div
            className={`flex w-full max-w-md flex-1 flex-col transition-opacity duration-300 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Subtitle */}
            <p
              className="animate-fade-up mt-5 mb-4 text-center text-lg font-bold text-orange-800/70"
              style={{ animationDelay: "0.05s" }}
            >
              今日の気分は？
            </p>

            {/* Mood Groups */}
            <div className="mood-area flex flex-col gap-3 overflow-y-auto flex-1 pb-3">
              {mounted &&
                MOOD_GROUPS.map((group, gi) => (
                  <div key={gi}>
                    {/* Category Label */}
                    {group.title && (
                      <div
                        className="animate-label-slide category-label flex items-center gap-1.5 mb-2 ml-1 text-orange-400"
                        style={{ animationDelay: `${0.04 * globalIndex + 0.08}s` }}
                      >
                        <span>{group.icon}</span>
                        <span>{group.title}</span>
                      </div>
                    )}

                    {/* Mood Buttons */}
                    <div
                      className={`grid gap-2.5 ${
                        group.cols === 2 ? "grid-cols-2" : "grid-cols-3"
                      }`}
                    >
                      {group.moods.map((mood) => {
                        const def = MOOD_MAP[mood];
                        const idx = globalIndex++;
                        return (
                          <button
                            key={mood}
                            onClick={() => handleMoodSelect(mood)}
                            className={`mood-btn animate-pop-in flex flex-col items-center rounded-2xl ${def.bg} ${
                              group.cols === 2 ? "gap-1.5 py-5" : "gap-1 py-4"
                            }`}
                            style={{
                              animationDelay: `${0.04 * idx + 0.1}s`,
                            }}
                          >
                            <span
                              className={`mood-emoji leading-none ${
                                group.cols === 2 ? "text-4xl" : "text-3xl"
                              }`}
                            >
                              {def.emoji}
                            </span>
                            <span
                              className={`font-bold ${def.text} ${
                                group.cols === 2 ? "text-sm" : "text-xs"
                              }`}
                            >
                              {def.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>

            {/* Omakase */}
            <div
              className="animate-fade-up shrink-0 pt-3 pb-1 text-center"
              style={{ animationDelay: "0.7s" }}
            >
              <button
                onClick={() => handleMoodSelect()}
                className="omakase-btn rounded-full border border-orange-200/60 px-8 py-3 text-sm font-black text-orange-600 transition-all active:scale-95"
              >
                🎲 おまかせで決める
              </button>
            </div>
          </div>
        )}

        {phase === "result" && result && (
          <div
            className={`flex flex-1 flex-col items-center justify-center gap-8 transition-opacity duration-300 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            <p className="animate-fade-up text-base font-medium text-orange-800/60">
              今日の晩ごはんは
            </p>

            <div
              className="animate-result-reveal flex flex-col items-center gap-4"
              style={{ animationDelay: "0.15s" }}
            >
              <span className="text-center text-5xl font-black leading-tight tracking-tight text-orange-950 sm:text-6xl">
                {result.name}
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {(result.mood as string[]).slice(0, 4).map((m) => {
                  const def = MOOD_MAP[m as Mood];
                  if (!def) return null;
                  return (
                    <span
                      key={m}
                      className={`rounded-full ${def.bg} px-3 py-1 text-xs font-bold ${def.text}`}
                    >
                      {def.emoji} {m}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Nearby Search */}
            <div
              className="animate-fade-up w-full max-w-xs"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(result.name + " レストラン")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-white border border-orange-200/60 px-5 py-4 shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg">
                  📍
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-orange-900">
                    近くのお店を探す
                  </span>
                  <span className="text-xs text-orange-400">
                    Google Mapsで「{result.name}」を検索
                  </span>
                </div>
                <span className="ml-auto text-orange-300">›</span>
              </a>
            </div>

            <div
              className="animate-fade-up flex flex-col items-center gap-4"
              style={{ animationDelay: "0.5s" }}
            >
              {rerollCount < MAX_REROLL ? (
                <button
                  onClick={handleReroll}
                  className="rounded-full border border-orange-200 bg-white px-8 py-3 text-base font-black text-orange-600 shadow-sm transition-all active:scale-95 hover:shadow-md"
                >
                  🔄 やだ
                </button>
              ) : (
                <p className="text-sm font-bold text-orange-400">
                  ✨ これに決まり！
                </p>
              )}

              <button
                onClick={handleReset}
                className="text-sm text-orange-300 underline underline-offset-4 transition-colors hover:text-orange-500"
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
