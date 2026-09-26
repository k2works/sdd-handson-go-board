# フィーチャーファイルのタグ

GoBoard のフィーチャーファイルで使うタグの一覧です。タグを追加したら、この一覧にも追加します。

| タグ | 意味 |
| :--- | :--- |
| `@S01`〜`@S12` | 対応するユーザーストーリー（`docs/requirements/goboard/ユーザーストーリー.md`） |
| `@R1`〜`@R10` | 対応するルール（`docs/requirements/goboard/ルール定義.md`） |
| `@U1`〜`@U4` | 対応する Unit（`docs/development/goboard/release_plan.md`） |
| `@wip` | まだ実装していないシナリオ。既定の実行（`npm run test:acceptance`）から除く。実装する Bolt で外す |

## フォルダ

| フォルダ | 機能領域 |
| :--- | :--- |
| `start/` | 対局の開始 |
| `placement/` | 駒を置く・置けない（U1） |
| `turn/` | 手番（U2） |
| `result/` | 勝ち・引き分け・ゲームの終わり（U3） |
| `screen/` | 画面の操作と表示（U4） |
