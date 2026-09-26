---
type: ADR
title: "0002 Cucumber と Playwright で受け入れテストを書く"
description: "GoBoard の受入条件を日本語 Gherkin のフィーチャーファイルにし、Cucumber-JS と Playwright でブラウザから検証する決定。"
tags: [adr,goboard]
status: draft
generated: { by: process:claude-code, at: 2026-09-26T08:14:10Z }
---

# 0002 Cucumber と Playwright で受け入れテストを書く

GoBoard のユーザーストーリーの受入条件を日本語の Gherkin（フィーチャーファイル）に書き、Cucumber-JS で実行する。ステップ定義は Playwright でブラウザを操作し、利用者と同じ画面から受入条件を検証する。

日付: 2026-09-26

## ステータス

2026-09-26 承認されました（プロダクトオーナー）

## コンテキスト

- プロダクトオーナーから「BDD 導入ガイドに従って Cucumber を設定し、Playwright で受け入れテストができるようにする。ユーザーストーリーを Gherkin に変換してから」という指示があった。
- これまでの受入条件は `docs/requirements/goboard/ユーザーストーリー.md` の Given/When/Then の文章で、自動テストは Vitest の単体テストと Testing Library の画面テストだけだった。受入条件そのものを、実行できる形で持っていなかった。
- [BDD 導入ガイド](../../reference/BDD導入ガイド.md) は、日本語で業務を語るチームは `# language: ja` の日本語 Gherkin で書くこと、Cucumber-JS はプロジェクトの依存として入れること、フィーチャーファイルを機能領域ごとのフォルダで整理し、タグを一覧化することを求めている。

## 決定

| 項目 | 決定 |
| :--- | :--- |
| 受入条件の実行可能な形 | 日本語 Gherkin のフィーチャーファイル（`apps/goboard/features/**/*.feature`）。1 ストーリー 1 ファイル |
| 実行 | Cucumber-JS（`@cucumber/cucumber`）。TypeScript のステップ定義は `tsx` で読み込む |
| ブラウザ操作 | Playwright（`playwright` ライブラリ）の Chromium。テスト実行時に Vite の開発サーバーを起動する |
| 整理 | 機能領域ごとのフォルダ（`start/`・`placement/`・`turn/`・`result/`・`screen/`）。タグは `features/tags.md` に一覧化する |
| 実装前のシナリオ | `@wip` を付けて既定の実行から除く。実装する Bolt で `@wip` を外す |
| コマンド | `npm run test:acceptance`（実装済みのシナリオ）、`npm run test:acceptance:wip`（実装前のシナリオの確認） |
| レポート | `reports/cucumber-report.html`（リポジトリには含めない） |

画面の要素は、利用者が知覚できる手がかり（見出し、「盤」という名前のグリッド、「8 行 8 列 空き」という読み上げ名のボタン）で探す。CSS のクラス名には依存させない。操作は `features/support/board-page.ts` のページオブジェクトに集め、ステップ定義は薄く保つ。

## 影響

- テストの層は次の 3 つになる。
  - ルールの単体テスト（Vitest）：受入条件の境界を速く網羅する。
  - 画面のコンポーネントテスト（Vitest と Testing Library）：画面の部品の振る舞いを確かめる。
  - 受け入れテスト（Cucumber と Playwright）：ストーリーの受入条件を、ブラウザで実際に操作して確かめる。
- Bolt の完了条件に「対象ストーリーのシナリオから `@wip` を外し、`npm run test:acceptance` が成功する」を加える。
- 受入条件は、ユーザーストーリーの文書とフィーチャーファイルの 2 か所に書かれる。受入条件を変えるときは両方を同時に更新する（リスク K6）。
- 外部ライブラリとして `@cucumber/cucumber`・`playwright`・`tsx`・`@types/node` を追加する。
- Playwright は既定では、自分のバージョンに合うブラウザを使う。ブラウザを別に用意した環境では、環境変数 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` に Chromium の実行ファイルのパスを指定する。ブラウザが無い環境では、先に `npx playwright install chromium` を実行する。

## コンプライアンス

- `apps/goboard/` で `npm run test:acceptance` が成功する。
- すべてのフィーチャーファイルに、ストーリーのタグ（`@S01`〜）と、シナリオごとのルールのタグ（`@R1`〜）が付いている。
- 実装を壊すと受け入れテストが失敗する（導入時に、犬の表示を別の絵文字に変えると失敗することを確認した）。

## 備考

- 提案：AI（Claude Code）
- 決定：プロダクトオーナー
- 関連：[ADR 0001](./0001-TypeScriptとReactによるWebアプリにする.md)、[BDD 導入ガイド](../../reference/BDD導入ガイド.md)
