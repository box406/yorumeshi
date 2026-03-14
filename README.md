# 🍽️ よるめし

> 今日の晩ごはん、もう悩まない

気分を選ぶだけで今夜のメニューを提案してくれるWebアプリ。外食派には近くのお店、自炊派にはレシピリンクも表示します。

**URL**: https://yorumeshi.vercel.app

## 主な機能

### 🎯 気分でメニュー提案
- 16種類の気分ボタンから選ぶだけでメニューを提案
- 200種類以上の献立データベース
- 過去の提案履歴を考慮して重複を回避

### 気分カテゴリ（16種類）

| カテゴリ | 気分 |
|---|---|
| 味の気分 | がっつり🍖 / さっぱり🥗 / こってり🧈 / 辛い🌶️ / やさしい☺️ |
| 温度 | あったかい🔥 / 冷たい🧊 |
| 食べ方 | ヘルシー🥬 / パパッと⚡ / じっくり🍲 |
| ジャンル | 麺気分🍜 / どんぶり🍚 / サクサク🍤 |
| シーン | なつかしい👵 / ごほうび✨ / 飲みたい🍺 |

### 📍 近くのお店検索（外食向け）
- **ホットペッパーグルメAPI**: メニューに合ったジャンルで近くのお店を最大3件表示
- **Google Maps**: メニュー名で地図検索

### 🍳 レシピ検索（自炊向け）
- **クラシル**: メニュー名で動画レシピを検索
- **クックパッド**: メニュー名で人気レシピを検索

### 🔄 その他
- 「おまかせ」でランダム提案
- 「やだ」で1回だけ別メニューに変更可能
- PWA対応（ホーム画面に追加して使える）

## 技術スタック

| 項目 | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS 4 |
| フォント | Zen Maru Gothic (Google Fonts) |
| ホスティング | Vercel |
| 外部API | ホットペッパーグルメAPI |
| PWA | Service Worker (Network First) |
| OGP画像 | next/og で自動生成 |

| テスト | Vitest + Testing Library |

## プロジェクト構成

```
src/
├── app/
│   ├── api/
│   │   └── shops/
│   │       └── route.ts        # ホットペッパーAPIプロキシ
│   ├── globals.css              # グローバルスタイル・アニメーション
│   ├── layout.tsx               # メタデータ・SEO・構造化データ
│   ├── opengraph-image.tsx      # OGP画像自動生成
│   ├── twitter-image.tsx        # Twitter Card画像自動生成
│   ├── page.tsx                 # メインページ
│   ├── robots.ts                # robots.txt生成
│   └── sitemap.ts               # sitemap.xml生成
├── lib/
│   └── search-keywords.ts       # メニュー名→検索キーワード変換
├── data/
│   └── menus.json               # 200品のメニューデータ
└── __tests__/
    ├── setup.ts                  # テストセットアップ
    ├── menus.test.ts             # メニューデータの整合性テスト
    ├── search-keywords.test.ts   # キーワード変換ロジックテスト
    └── page.test.tsx             # UIコンポーネントテスト
```

## セットアップ

### 1. インストール

```bash
npm install
```

### 2. 環境変数

```env
HOTPEPPER_API_KEY=ホットペッパーAPIキー
```

ホットペッパーAPIキーは https://webservice.recruit.co.jp/ で無料取得できます。

### 3. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 で確認できます。

### 4. ビルド

```bash
npm run build
```

## デプロイ

Vercelにpushすると自動デプロイされます。

Vercelダッシュボードで環境変数 `HOTPEPPER_API_KEY` を設定してください。

## テスト

Vitest + Testing Library で31テストを実装。

```bash
npm test            # 1回実行
npm run test:watch  # ウォッチモード
```

| テストファイル | 内容 | テスト数 |
|---|---|---|
| `menus.test.ts` | 200品の存在確認・ID連番・重複なし・全タグ有効・全気分使用 | 8 |
| `search-keywords.test.ts` | 18ジャンルのキーワード変換・フォールバック | 12 |
| `page.test.tsx` | 初期表示・気分選択・結果表示・レシピリンク・画面遷移 | 11 |

## SEO対策

- メタデータ（title / description / keywords）
- OpenGraph / Twitter Card メタタグ + 自動生成画像
- robots.txt（/api/ クロール除外）
- sitemap.xml（自動生成）
- JSON-LD 構造化データ（WebApplication）
- Google Search Console 登録済み
- canonical URL 設定

## ライセンス

MIT
