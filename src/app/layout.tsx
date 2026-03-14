import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yorumeshi.vercel.app"),
  title: "よるめし - 今日の晩ごはん、もう悩まない",
  description:
    "今日の晩ごはんが決まらない？気分を選ぶだけでメニューを提案！200種類以上の献立から、がっつり・さっぱり・ヘルシーなど16の気分で今夜のごはんが決まります。近くのお店検索やレシピリンクも。",
  keywords: [
    "晩ごはん",
    "献立",
    "今日の夕飯",
    "メニュー決め",
    "夕食",
    "レシピ",
    "料理",
    "外食",
    "自炊",
    "近くのレストラン",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "よるめし",
  },
  openGraph: {
    title: "よるめし - 今日の晩ごはん、もう悩まない",
    description:
      "気分を選ぶだけで今夜のメニューが決まる！200種類以上の献立×16の気分。近くのお店やレシピも探せます。",
    url: "https://yorumeshi.vercel.app",
    siteName: "よるめし",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "よるめし - 今日の晩ごはん、もう悩まない",
    description:
      "気分を選ぶだけで今夜のメニューが決まる！200種類以上の献立×16の気分。",
  },
  alternates: {
    canonical: "https://yorumeshi.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${zenMaru.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "よるめし",
              description:
                "気分を選ぶだけで今夜のメニューが決まる献立提案アプリ。200種類以上の献立×16の気分。近くのお店検索やレシピリンクも。",
              url: "https://yorumeshi.vercel.app",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "JPY",
              },
              inLanguage: "ja",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
