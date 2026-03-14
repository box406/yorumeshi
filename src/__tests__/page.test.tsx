import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";

// Mock navigator.geolocation
const mockGetCurrentPosition = vi.fn();
Object.defineProperty(global.navigator, "geolocation", {
  value: { getCurrentPosition: mockGetCurrentPosition },
  writable: true,
});

// Mock navigator.serviceWorker
Object.defineProperty(global.navigator, "serviceWorker", {
  value: { register: vi.fn() },
  writable: true,
});

// Mock fetch for /api/shops
global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({ shops: [], error: "NO_RESULTS" }),
});

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("Home page", () => {
  it("初期表示で「今日の気分は？」が表示される", () => {
    render(<Home />);
    expect(screen.getAllByText("今日の気分は？").length).toBeGreaterThanOrEqual(1);
  });

  it("ロゴ「よるめし」がヘッダーに表示される", () => {
    render(<Home />);
    expect(screen.getAllByText("よるめし").length).toBeGreaterThanOrEqual(1);
  });

  it("16個の気分ボタンが表示される", async () => {
    render(<Home />);
    const moods = [
      "がっつり", "さっぱり", "あったかい", "冷たい",
      "ヘルシー", "こってり", "辛い", "やさしい",
      "パパッと", "じっくり", "なつかしい", "ごほうび",
      "飲みたい", "麺気分", "どんぶり", "サクサク",
    ];
    await waitFor(() => {
      for (const mood of moods) {
        expect(screen.getAllByText(mood).length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  it("「おまかせで決める」ボタンが表示される", () => {
    render(<Home />);
    expect(screen.getAllByText("🎲 おまかせで決める").length).toBeGreaterThanOrEqual(1);
  });

  it("カテゴリラベルが表示される", async () => {
    render(<Home />);
    await waitFor(() => {
      for (const label of ["味の気分", "温度", "食べ方", "ジャンル", "シーン"]) {
        expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  it("気分を選択するとメニュー結果が表示される", async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByText("がっつり").length).toBeGreaterThanOrEqual(1);
    });

    fireEvent.click(screen.getAllByText("がっつり")[0]);

    await waitFor(
      () => {
        expect(screen.getAllByText("今日の晩ごはんは").length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 1000 }
    );
  });

  it("おまかせを押すとメニュー結果が表示される", async () => {
    render(<Home />);

    fireEvent.click(screen.getAllByText("🎲 おまかせで決める")[0]);

    await waitFor(
      () => {
        expect(screen.getAllByText("今日の晩ごはんは").length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 1000 }
    );
  });

  it("結果画面に「やだ」ボタンが表示される", async () => {
    render(<Home />);
    fireEvent.click(screen.getAllByText("🎲 おまかせで決める")[0]);

    await waitFor(
      () => {
        expect(screen.getAllByText("🔄 やだ").length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 1000 }
    );
  });

  it("結果画面にレシピリンクが表示される", async () => {
    render(<Home />);
    fireEvent.click(screen.getAllByText("🎲 おまかせで決める")[0]);

    await waitFor(
      () => {
        expect(screen.getAllByText("Rettyで探す").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("クックパッドで探す").length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 1000 }
    );
  });

  it("結果画面にGoogle Mapsリンクが表示される", async () => {
    render(<Home />);
    fireEvent.click(screen.getAllByText("🎲 おまかせで決める")[0]);

    await waitFor(
      () => {
        expect(screen.getAllByText("Google Mapsで探す").length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 1000 }
    );
  });

  it("「最初から」を押すと気分選択画面に戻る", async () => {
    render(<Home />);
    fireEvent.click(screen.getAllByText("🎲 おまかせで決める")[0]);

    await waitFor(
      () => {
        expect(screen.getAllByText("最初から").length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 1000 }
    );

    fireEvent.click(screen.getAllByText("最初から")[0]);

    await waitFor(() => {
      expect(screen.getAllByText("今日の気分は？").length).toBeGreaterThanOrEqual(1);
    });
  });
});
