import { describe, it, expect } from "vitest";
import { extractSearchKeywords } from "@/lib/search-keywords";

describe("extractSearchKeywords", () => {
  it("ラーメン系のメニューから「ラーメン」を抽出する", () => {
    expect(extractSearchKeywords("味噌ラーメン")).toEqual(["ラーメン"]);
    expect(extractSearchKeywords("豚骨ラーメン")).toEqual(["ラーメン"]);
    expect(extractSearchKeywords("担々麺")).toEqual(["ラーメン"]);
    expect(extractSearchKeywords("つけ麺")).toEqual(["ラーメン"]);
  });

  it("パスタ系からイタリアン系キーワードを抽出する", () => {
    expect(extractSearchKeywords("カルボナーラ")).toEqual(["イタリアン", "パスタ"]);
    expect(extractSearchKeywords("ペペロンチーノ")).toEqual(["イタリアン", "パスタ"]);
    expect(extractSearchKeywords("ナポリタン")).toEqual(["イタリアン", "パスタ"]);
  });

  it("カレー系から「カレー」を抽出する", () => {
    expect(extractSearchKeywords("カレーライス")).toEqual(["カレー"]);
    expect(extractSearchKeywords("ハヤシライス")).toEqual(["カレー"]);
  });

  it("丼系から定食・丼キーワードを抽出する", () => {
    expect(extractSearchKeywords("親子丼")).toEqual(["定食", "丼"]);
    expect(extractSearchKeywords("海鮮丼")).toEqual(["定食", "丼"]);
    expect(extractSearchKeywords("ビビンバ")).toEqual(["定食", "丼"]);
  });

  it("寿司系から寿司・海鮮キーワードを抽出する", () => {
    expect(extractSearchKeywords("寿司")).toEqual(["寿司", "海鮮"]);
    expect(extractSearchKeywords("刺身定食")).toEqual(["寿司", "海鮮"]);
  });

  it("鍋系から「鍋」を抽出する", () => {
    expect(extractSearchKeywords("すき焼き")).toEqual(["鍋"]);
    expect(extractSearchKeywords("キムチ鍋")).toEqual(["鍋"]);
    expect(extractSearchKeywords("もつ鍋")).toEqual(["鍋"]);
  });

  it("焼肉系から「焼肉」を抽出する", () => {
    expect(extractSearchKeywords("焼肉")).toEqual(["焼肉"]);
    expect(extractSearchKeywords("ジンギスカン")).toEqual(["焼肉"]);
  });

  it("揚げ物系からとんかつ・定食キーワードを抽出する", () => {
    expect(extractSearchKeywords("とんかつ")).toEqual(["とんかつ", "定食"]);
    expect(extractSearchKeywords("唐揚げ")).toEqual(["とんかつ", "定食"]);
    expect(extractSearchKeywords("天ぷら")).toEqual(["とんかつ", "定食"]);
  });

  it("中華系から「中華」を抽出する", () => {
    expect(extractSearchKeywords("麻婆豆腐")).toEqual(["中華"]);
    expect(extractSearchKeywords("チャーハン")).toEqual(["中華"]);
    expect(extractSearchKeywords("エビチリ")).toEqual(["中華"]);
  });

  it("韓国料理系から「韓国料理」を抽出する", () => {
    expect(extractSearchKeywords("チーズタッカルビ")).toEqual(["韓国料理"]);
    expect(extractSearchKeywords("チャプチェ")).toEqual(["韓国料理"]);
  });

  it("アジア料理系からタイ・アジアキーワードを抽出する", () => {
    expect(extractSearchKeywords("フォー")).toEqual(["タイ", "アジア"]);
    expect(extractSearchKeywords("パッタイ")).toEqual(["タイ", "アジア"]);
    expect(extractSearchKeywords("トムヤムクン")).toEqual(["タイ", "アジア"]);
  });

  it("マッチしないメニューはメニュー名そのままを返す", () => {
    expect(extractSearchKeywords("鮭の塩焼き")).toEqual(["鮭の塩焼き"]);
    expect(extractSearchKeywords("肉じゃが")).toEqual(["肉じゃが"]);
  });
});
