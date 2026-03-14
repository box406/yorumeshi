import { NextRequest, NextResponse } from "next/server";

const HOTPEPPER_API = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

export async function GET(req: NextRequest) {
  const key = process.env.HOTPEPPER_API_KEY;
  if (!key) {
    return NextResponse.json({ shops: [], error: "API key not configured" }, { status: 200 });
  }

  const { searchParams } = req.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const keyword = searchParams.get("keyword") || "";

  if (!lat || !lng) {
    return NextResponse.json({ shops: [], error: "Missing lat/lng" }, { status: 400 });
  }

  const params = new URLSearchParams({
    key,
    lat,
    lng,
    range: "3",
    keyword,
    count: "3",
    format: "json",
    order: "4",
  });

  try {
    const res = await fetch(`${HOTPEPPER_API}?${params}`);
    const data = await res.json();
    const shops = (data.results?.shop || []).map(
      (s: Record<string, unknown>) => ({
        name: s.name,
        address: s.address,
        access: s.station_name
          ? `${s.station_name}駅 ${s.mobile_access || ""}`
          : s.mobile_access || "",
        photo: (s.photo as Record<string, Record<string, string>>)?.mobile?.s || "",
        url: (s.urls as Record<string, string>)?.pc || "",
        genre: (s.genre as Record<string, string>)?.name || "",
      })
    );
    return NextResponse.json({ shops });
  } catch {
    return NextResponse.json({ shops: [], error: "API request failed" }, { status: 500 });
  }
}
