import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "よるめし - 今日の晩ごはん、もう悩まない";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
            display: "flex",
            gap: 16,
            marginBottom: 24,
            fontSize: 48,
          }}
        >
          <span>🍖</span>
          <span>🥗</span>
          <span>🔥</span>
          <span>🌶️</span>
          <span>🍜</span>
          <span>✨</span>
        </div>

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
            }}
          >
            よるめし
          </span>
        </div>

        <p
          style={{
            fontSize: 32,
            color: "#c2410c",
            fontWeight: 700,
            margin: 0,
          }}
        >
          今日の晩ごはん、もう悩まない
        </p>
      </div>
    ),
    { ...size }
  );
}
