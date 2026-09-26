---
type: ADR
title: "0001 TypeScript と React による Web アプリにする"
description: "GoBoard を、ルールから画面まで TypeScript で書き、React・Vite・Vitest を使う 1 台のブラウザで遊ぶ Web アプリにする決定。Go の CLI 計画を置き換える。"
tags: [adr,goboard]
status: draft
generated: { by: process:claude-code, at: 2026-09-26T07:56:09Z }
---

# 0001 TypeScript と React による Web アプリにする

GoBoard を、ルールから画面まで TypeScript で書く、1 台のブラウザで遊ぶ Web アプリにする。画面は React、ビルドは Vite、テストは Vitest と Testing Library で行う。

日付: 2026-09-26

## ステータス

2026-09-26 承認されました（プロダクトオーナー）

## コンテキスト

- 最初の計画では、GoBoard を Go の CLI（ターミナル）アプリとして作る予定だった。Bolt 1 のステップ 1 で Go モジュールの骨組みまで作った。
- プロダクトオーナーから「ユーザーインターフェースまで一貫した Web ベースのアプリにしたいので TypeScript にする」という指示があった。
- あわせて、次の 2 点をプロダクトオーナーが選んだ。
  - 対戦形態：1 台のブラウザで 2 人が交互にマスをクリックする（オンライン対戦は含めない）
  - 画面の作り方：React + Vite
- CLI 版で懸念していた、端末によって絵文字の表示幅がずれるリスク（K1）は、ブラウザではマス目をレイアウトで固定できるため小さくなる。

## 決定

| 項目 | 決定 |
| :--- | :--- |
| 言語 | TypeScript（`strict` を有効にする） |
| 画面 | React |
| ビルド・開発サーバー | Vite |
| テスト | Vitest（jsdom）、Testing Library（React・jest-dom・user-event） |
| 配置 | `apps/goboard/` に npm パッケージとして置く。`npm run dev` で起動する |
| サーバー | 使わない。ビルド結果は静的ファイルとして配信できる |

ソースの構成とパッケージの依存の向きは次のとおりとする。

```text
apps/goboard/src/
├── game/   # U1 盤と着手・U2 手番・U3 勝敗判定。React や DOM に依存しない
└── ui/     # U4 Web 画面。ルールの判断は game に問い合わせる（ui → game の一方向）
```

理由は次のとおり。

- **ルールと画面を 1 つの言語で書ける**：同じ型（盤・マス・駒）を画面とルールで共有できる。
- **ルールを画面から独立させられる**：`game` は純粋な TypeScript なので、ルールの受入条件をブラウザなしで高速にテストできる。
- **画面の振る舞いを受入条件どおりにテストできる**：Testing Library で「マスをクリックすると犬の駒が表示される」といった利用者の操作をテストに書ける。

## 影響

- Go の骨組み（`apps/goboard/go.mod` など）は削除する。
- リリース計画の U4 を「CLI 対戦」から「Web 画面」に変える。座標の入力（仮定 A1）はマスのクリックに置き換わり、A1 は不要になる。
- ルール定義の「遊び方」と「表示」を更新する。ルールそのもの（R1〜R8）は変わらない。
- 外部ライブラリとして React・Vite・Vitest・Testing Library・jsdom に依存する。依存の更新は `npm outdated` で確認する。
- 将来オンライン対戦を加える場合は、`game` をサーバー側でも再利用できる。そのときは新しい ADR で決める。

## コンプライアンス

- `src/game/` から `react` や DOM の API を import していないことを、レビューで確認する。
- `apps/goboard/` で `npm run typecheck`・`npm test`・`npm run build` がすべて成功する。

## 備考

- 提案：AI（Claude Code）
- 決定：プロダクトオーナー
- 置き換えた計画：CLI 版のリリース計画（Go）。変更は [リリース計画](../../development/goboard/release_plan.md) に反映した。
