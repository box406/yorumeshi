import { NextRequest, NextResponse } from "next/server";

const HOTPEPPER_API = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

// メニュー名 → ホットペッパーで検索しやすいキーワードに変換
function extractSearchKeywords(menuName: string): string[] {
  const patterns: [RegExp, string[]][] = [
    [/ラーメン|つけ麺|担々麺/, ["ラーメン"]],
    [/そば|蕎麦/, ["そば"]],
    [/うどん/, ["うどん"]],
    [/パスタ|ペペロンチーノ|カルボナーラ|ナポリタン|ミートソース|ボンゴレ|ジェノベーゼ/, ["イタリアン", "パスタ"]],
    [/カレー|ハヤシ/, ["カレー"]],
    [/丼|牛丼|カツ丼|親子丼|天丼|海鮮丼|ポキ丼|ビビンバ|ロコモコ|ルーロー|ガパオ|タコライス|ナシゴレン/, ["定食", "丼"]],
    [/寿司|刺身/, ["寿司", "海鮮"]],
    [/鍋|すき焼き|しゃぶしゃぶ|おでん|チゲ|もつ鍋/, ["鍋"]],
    [/焼肉|ジンギスカン|サムギョプサル/, ["焼肉"]],
    [/ステーキ|ハンバーグ|ローストビーフ/, ["ステーキ", "ハンバーグ"]],
    [/とんかつ|カツ|フライ|唐揚げ|天ぷら|コロッケ|春巻き|串カツ/, ["とんかつ", "定食"]],
    [/餃子|焼売|小籠包|肉まん/, ["中華", "餃子"]],
    [/麻婆|回鍋肉|青椒|酢豚|八宝菜|油淋|エビチリ|チャーハン|中華/, ["中華"]],
    [/チヂミ|タッカルビ|トッポギ|チャプチェ|キムチ|参鶏湯/, ["韓国料理"]],
    [/フォー|パッタイ|トムヤム|生春巻|カオマンガイ|ナシゴレン/, ["タイ", "アジア"]],
    [/ピザ|グラタン|ドリア|ラザニア|リゾット|キッシュ/, ["イタリアン"]],
    [/お好み焼き|もんじゃ|たこ焼き/, ["お好み焼き"]],
    [/焼き鳥|手羽先/, ["焼き鳥", "居酒屋"]],
  ];

  for (const [pattern, keywords] of patterns) {
    if (pattern.test(menuName)) {
      return keywords;
    }
  }

  return [menuName];
}

async function searchShops(
  baseParams: Record<string, string>,
  keyword?: string
): Promise<Record<string, unknown>[]> {
  const params = { ...baseParams };
  if (keyword) params.keyword = keyword;
  const res = await fetch(
    `${HOTPEPPER_API}?${new URLSearchParams(params)}`
  );
  const data = await res.json();
  return data.results?.shop || [];
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

  if (!lat || !lng) {
    return NextResponse.json({ shops: [], error: "LOCATION_MISSING" });
  }

  try {
    const base = { key, lat, lng, count: "3", format: "json", order: "4" };

    // 1. ジャンルキーワードで3km圏内を検索
    const keywords = extractSearchKeywords(keyword);
    let rawShops: Record<string, unknown>[] = [];

    for (const kw of keywords) {
      rawShops = await searchShops({ ...base, range: "5" }, kw);
      if (rawShops.length > 0) break;
    }

    // 2. メニュー名そのままで3km圏内
    if (rawShops.length === 0) {
      rawShops = await searchShops({ ...base, range: "5" }, keyword);
    }

    // 3. キーワードなしで近くのお店（フォールバック）
    const isFallback = rawShops.length === 0;
    if (isFallback) {
      rawShops = await searchShops({ ...base, range: "5" });
    }

    if (rawShops.length === 0) {
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
    return NextResponse.json({ shops, isFallback });
  } catch (e) {
    return NextResponse.json({
      shops: [],
      error: "API_FETCH_FAILED",
      detail: e instanceof Error ? e.message : String(e),
    });
  }
}
