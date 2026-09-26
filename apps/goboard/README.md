# GoBoard

2 人が犬と猫の駒を交互に置き、同じ種類の駒を先に 5 つ並べた方が勝つボードゲームです。ルールは [ルール定義](../../docs/requirements/goboard/ルール定義.md) だけを正解とします。

## コマンド

`apps/goboard/` で実行します。最初に `npm install` を実行してください。

| コマンド | 内容 |
| :--- | :--- |
| `npm run dev` | 開発サーバーを起動する |
| `npm run build` | 型チェックをして本番用にビルドする |
| `npm run typecheck` | 型チェックだけを行う |
| `npm test` | ルールと画面の単体テスト（Vitest）を実行する |
| `npm run test:acceptance` | 受け入れテスト（Cucumber と Playwright）を実行する。`@wip` のシナリオは除く |
| `npm run test:acceptance:wip` | 実装前（`@wip`）のシナリオだけを実行し、未定義のステップを確認する |

受け入れテストは Chromium を使います。Playwright のブラウザが入っていなければ、先に `npx playwright install chromium` を実行します。別に用意した Chromium を使う場合は、環境変数 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` にその実行ファイルのパスを指定します。

## 構成

| パス | 内容 |
| :--- | :--- |
| `src/game/` | ルール（U1 盤と着手・U2 手番・U3 勝敗判定）。React や DOM に依存しない |
| `src/ui/` | Web 画面（U4） |
| `features/` | 受入条件の日本語 Gherkin と、Playwright で操作するステップ定義。タグは `features/tags.md` |

設計判断は [ADR](../../docs/adr/goboard/index.md) を参照してください。
