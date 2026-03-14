"use client";

import { useState, useCallback, useEffect } from "react";
import menus from "@/data/menus.json";

type Mood = "がっつり" | "さっぱり" | "あったかい" | "冷たい" | "ヘルシー" | "こってり" | "辛い" | "やさしい" | "パパッと" | "じっくり" | "なつかしい" | "ごほうび" | "飲みたい" | "麺気分" | "どんぶり" | "サクサク";

const MOODS: { label: Mood; emoji: string }[] = [
  { label: "がっつり", emoji: "🍖" },
  { label: "さっぱり", emoji: "🥗" },
  { label: "あったかい", emoji: "🔥" },
  { label: "冷たい", emoji: "🧊" },
  { label: "ヘルシー", emoji: "🥬" },
  { label: "こってり", emoji: "🧈" },
  { label: "辛い", emoji: "🌶️" },
  { label: "やさしい", emoji: "☺️" },
  { label: "パパッと", emoji: "⚡" },
  { label: "じっくり", emoji: "🍲" },
  { label: "なつかしい", emoji: "👵" },
  { label: "ごほうび", emoji: "✨" },
  { label: "飲みたい", emoji: "🍺" },
  { label: "麺気分", emoji: "🍜" },
  { label: "どんぶり", emoji: "🍚" },
  { label: "サクサク", emoji: "🍤" },
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

  useEffect(() => {
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
    // 履歴で絞りすぎた場合はリセット
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
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      {phase === "mood" && (
        <div
          className={`flex flex-col items-center gap-10 transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">🍽️ よるめし</h1>
            <p className="mt-3 text-lg text-zinc-500">今日の気分は？</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs max-h-[60dvh] overflow-y-auto">
            {MOODS.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => handleMoodSelect(label)}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-5 text-lg font-medium shadow-sm transition-all active:scale-95 hover:shadow-md"
              >
                <span className="text-3xl">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleMoodSelect()}
            className="text-zinc-400 underline underline-offset-4 transition-colors hover:text-zinc-600"
          >
            おまかせ
          </button>
        </div>
      )}

      {phase === "result" && result && (
        <div
          className={`flex flex-col items-center gap-10 transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-lg text-zinc-500">今日の晩ごはんは</p>

          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl font-bold tracking-tight">
              {result.name}
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            {rerollCount < MAX_REROLL ? (
              <button
                onClick={handleReroll}
                className="rounded-full bg-white px-8 py-3 text-lg font-medium shadow-sm transition-all active:scale-95 hover:shadow-md"
              >
                やだ
              </button>
            ) : (
              <p className="text-sm text-zinc-400">これに決まり！</p>
            )}

            <button
              onClick={handleReset}
              className="text-zinc-400 underline underline-offset-4 transition-colors hover:text-zinc-600"
            >
              最初から
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
