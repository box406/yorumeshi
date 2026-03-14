import { NextRequest, NextResponse } from "next/server";
import { extractSearchKeywords } from "@/lib/search-keywords";

const HOTPEPPER_API = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

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
