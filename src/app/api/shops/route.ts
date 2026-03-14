import { NextRequest, NextResponse } from "next/server";

const HOTPEPPER_API = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

// メニュー名 → ホットペッパーで検索しやすいキーワードに変換
function extractSearchKeyword(menuName: string): string[] {
  const keywords: string[] = [];

  // ジャンルキーワードのマッピング（優先度順にマッチ）
  const patterns: [RegExp, string][] = [
    [/ラーメン|つけ麺|担々麺/, "ラーメン"],
    [/そば|蕎麦/, "そば"],
    [/うどん/, "うどん"],
    [/パスタ|ペペロンチーノ|カルボナーラ|ナポリタン|ミートソース|ボンゴレ|ジェノベーゼ/, "パスタ イタリアン"],
    [/カレー|ハヤシ/, "カレー"],
    [/丼|牛丼|カツ丼|親子丼|天丼|海鮮丼|ポキ丼|ビビンバ|ロコモコ|ルーロー|ガパオ|タコライス|ナシゴレン/, "丼 定食"],
    [/寿司|刺身/, "寿司 海鮮"],
    [/鍋|すき焼き|しゃぶしゃぶ|おでん|チゲ|もつ鍋/, "鍋"],
    [/焼肉|ジンギスカン|サムギョプサル/, "焼肉"],
    [/ステーキ|ハンバーグ|ローストビーフ/, "ステーキ ハンバーグ"],
    [/とんかつ|カツ|フライ|唐揚げ|天ぷら|コロッケ|春巻き|串カツ/, "揚げ物 とんかつ"],
    [/餃子|焼売|小籠包|肉まん/, "餃子 中華"],
    [/麻婆|回鍋肉|青椒|酢豚|八宝菜|油淋|エビチリ|チャーハン|中華/, "中華料理"],
    [/チヂミ|タッカルビ|トッポギ|チャプチェ|キムチ|サムギョプサル|参鶏湯/, "韓国料理"],
    [/フォー|パッタイ|トムヤム|生春巻|カオマンガイ|ナシゴレン/, "タイ料理 アジア"],
    [/ピザ|グラタン|ドリア|ラザニア|リゾット|キッシュ/, "イタリアン"],
    [/お好み焼き|もんじゃ|たこ焼き/, "お好み焼き"],
    [/焼き鳥|手羽先/, "焼き鳥 居酒屋"],
    [/居酒屋|飲み/, "居酒屋"],
  ];

  for (const [pattern, keyword] of patterns) {
    if (pattern.test(menuName)) {
      keywords.push(keyword);
      break;
    }
  }

  // マッチしなかった場合はメニュー名そのまま
  if (keywords.length === 0) {
    keywords.push(menuName);
  }

  return keywords;
}

// 気分タグ → ホットペッパーのジャンルコード
function moodToGenre(mood: string): string | null {
  const map: Record<string, string> = {
    麺気分: "G013",     // ラーメン
    飲みたい: "G001",   // 居酒屋
  };
  return map[mood] || null;
}

export async function GET(req: NextRequest) {
  const key = process.env.HOTPEPPER_API_KEY;
  if (!key) {
    return NextResponse.json({ shops: [], error: "API_KEY_MISSING" });
  }

  const { searchParams } = req.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const keyword = searchParams.get("keyword") || "";
  const mood = searchParams.get("mood") || "";

  if (!lat || !lng) {
    return NextResponse.json({ shops: [], error: "LOCATION_MISSING" });
  }

  const baseParams: Record<string, string> = {
    key, lat, lng, range: "3", count: "3", format: "json", order: "4",
  };

  // ジャンルコードがある気分ならジャンル指定
  const genreCode = moodToGenre(mood);
  if (genreCode) {
    baseParams.genre = genreCode;
  }

  try {
    // 1. ジャンルキーワードで検索
    const searchKeywords = extractSearchKeyword(keyword);
    let rawShops = null;

    for (const kw of searchKeywords) {
      const res = await fetch(
        `${HOTPEPPER_API}?${new URLSearchParams({ ...baseParams, keyword: kw })}`
      );
      const data = await res.json();
      rawShops = data.results?.shop;
      if (rawShops && rawShops.length > 0) break;
    }

    // 2. それでもなければメニュー名そのままで検索
    if (!rawShops || rawShops.length === 0) {
      const res = await fetch(
        `${HOTPEPPER_API}?${new URLSearchParams({ ...baseParams, keyword })}`
      );
      const data = await res.json();
      rawShops = data.results?.shop;
    }

    if (!rawShops || rawShops.length === 0) {
      return NextResponse.json({ shops: [], error: "NO_RESULTS" });
    }

    const shops = rawShops.map(
      (s: Record<string, unknown>) => ({
        name: s.name,
        address: s.address,
        access: s.station_name
          ? `${s.station_name}駅 ${s.mobile_access || ""}`
          : (s.mobile_access as string) || "",
        photo: (s.photo as Record<string, Record<string, string>>)?.mobile?.s || "",
        url: (s.urls as Record<string, string>)?.pc || "",
        genre: (s.genre as Record<string, string>)?.name || "",
      })
    );
    return NextResponse.json({ shops });
  } catch (e) {
    return NextResponse.json({
      shops: [],
      error: "API_FETCH_FAILED",
      detail: e instanceof Error ? e.message : String(e),
    });
  }
}
