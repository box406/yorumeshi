import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "よるめし - 今日の晩ごはん、もう悩まない";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fef6ee 0%, #ffe8d0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(249, 115, 22, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(249, 115, 22, 0.06)",
            display: "flex",
          }}
        />

        {/* Emoji row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            fontSize: 48,
          }}
        >
          <span>🍖</span>
          <span>🥗</span>
          <span>🔥</span>
          <span>🧊</span>
          <span>🌶️</span>
          <span>🍜</span>
          <span>🍺</span>
          <span>✨</span>
        </div>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 72 }}>🍽️</span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#7c2d12",
              letterSpacing: "-0.02em",
            }}
          >
            よるめし
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 32,
            color: "#c2410c",
            fontWeight: 700,
            margin: 0,
            marginBottom: 32,
          }}
        >
          今日の晩ごはん、もう悩まない
        </p>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "white",
              borderRadius: 100,
              padding: "12px 24px",
              fontSize: 22,
              fontWeight: 700,
              color: "#9a3412",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            🎯 16の気分から選ぶ
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "white",
              borderRadius: 100,
              padding: "12px 24px",
              fontSize: 22,
              fontWeight: 700,
              color: "#9a3412",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            📍 近くのお店を検索
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "white",
              borderRadius: 100,
              padding: "12px 24px",
              fontSize: 22,
              fontWeight: 700,
              color: "#9a3412",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            🍳 レシピもすぐ見つかる
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
