import { NextRequest, NextResponse } from "next/server";

const HOTPEPPER_API = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

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

  // まずキーワード付きで検索
  const baseParams = { key, lat, lng, range: "3", count: "3", format: "json", order: "4" };

  try {
    let res = await fetch(
      `${HOTPEPPER_API}?${new URLSearchParams({ ...baseParams, keyword })}`
    );
    let data = await res.json();
    let rawShops = data.results?.shop;

    // キーワードでヒットしなければキーワードなしで再検索
    if (!rawShops || rawShops.length === 0) {
      res = await fetch(
        `${HOTPEPPER_API}?${new URLSearchParams(baseParams)}`
      );
      data = await res.json();
      rawShops = data.results?.shop;
    }

    if (!rawShops || rawShops.length === 0) {
      return NextResponse.json({ shops: [], error: "NO_RESULTS", debug: { lat, lng, keyword } });
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
