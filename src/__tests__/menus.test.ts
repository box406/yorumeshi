import { describe, it, expect } from "vitest";
import menus from "@/data/menus.json";

const VALID_MOODS = [
  "がっつり", "さっぱり", "あったかい", "冷たい",
  "ヘルシー", "こってり", "辛い", "やさしい",
  "パパッと", "じっくり", "なつかしい", "ごほうび",
  "飲みたい", "麺気分", "どんぶり", "サクサク",
];

describe("menus.json", () => {
  it("200品のメニューが存在する", () => {
    expect(menus).toHaveLength(200);
  });

  it("IDが1〜200の連番になっている", () => {
    const ids = menus.map((m) => m.id);
    for (let i = 1; i <= 200; i++) {
      expect(ids).toContain(i);
    }
  });

  it("IDに重複がない", () => {
    const ids = menus.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("全メニューにnameがある", () => {
    for (const menu of menus) {
      expect(menu.name).toBeTruthy();
      expect(typeof menu.name).toBe("string");
    }
  });

  it("メニュー名に重複がない", () => {
    const names = menus.map((m) => m.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("全メニューにmood配列がある（最低1つ）", () => {
    for (const menu of menus) {
      expect(Array.isArray(menu.mood)).toBe(true);
      expect(menu.mood.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("全てのmoodタグが有効な値である", () => {
    for (const menu of menus) {
      for (const mood of menu.mood) {
        expect(VALID_MOODS).toContain(mood);
      }
    }
  });

  it("全16種類の気分タグがそれぞれ最低1品のメニューに使われている", () => {
    for (const mood of VALID_MOODS) {
      const count = menus.filter((m) => m.mood.includes(mood)).length;
      expect(count, `「${mood}」を持つメニューが0件`).toBeGreaterThan(0);
    }
  });
});
