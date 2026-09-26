# 開発

開発フェーズのドキュメントです。リリース計画、イテレーション計画、ふりかえり、完了報告書を管理します。

## プロジェクト

| プロジェクト | 概要 |
| :--- | :--- |
| [GoBoard](./goboard/index.md) | 2 人が犬と猫の駒を交互に置き、同じ種類の駒を先に 5 つ並べた方が勝つボードゲーム |

## ドキュメント一覧

### リリース計画

| ドキュメント | 説明 | GoBoard |
| :--- | :--- | :--- |
| リリース計画 | リリース全体のスコープ、スケジュール、ベロシティ、バッファ戦略 | [作成済み](./goboard/release_plan.md)（Unit・Bolt・リスク台帳） |

### イテレーション計画（Bolt 計画）

AI-DLC ではイテレーションの代わりに Bolt で計画します。

| プロジェクト | Bolt | 計画 | 状態 |
| :--- | :--- | :--- | :--- |
| GoBoard | Bolt 1 ウォーキングスケルトン | [bolt_1_plan.md](./goboard/bolt_1_plan.md) | 完了 |
| GoBoard | Bolt 2 置けない場所と手番 | [bolt_2_plan.md](./goboard/bolt_2_plan.md) | 完了 |
| GoBoard | Bolt 3 勝ち | [bolt_3_plan.md](./goboard/bolt_3_plan.md) | 完了 |
| GoBoard | Bolt 4 ちょうど 3 つの並び | [bolt_4_plan.md](./goboard/bolt_4_plan.md) | 完了 |
| GoBoard | Bolt 5 引き分けとリリース | [bolt_5_plan.md](./goboard/bolt_5_plan.md) | 完了 |

Bolt の開始時に行を追加します。

### 進捗サマリー

AI-DLC ではストーリーポイントの代わりに、完了した Bolt とストーリーで進捗を測ります。

| プロジェクト | Bolt | ストーリー | 状態 |
| :--- | :--- | :--- | :--- |
| GoBoard | 5 / 5 | 12 / 12 | v0.1.0 リリース済み |

### リリース完了報告書

| リリース | 報告書 | 状態 |
| :--- | :--- | :--- |
| GoBoard v0.1.0 | [release_report-v0.1.0.md](./goboard/release_report-v0.1.0.md) | 作成済み |

## 補足

- 各プロジェクトの文書は、プロジェクトのサブディレクトリ（例：`goboard/`）に置きます。
- テンプレートは [template/リリース計画.md](../template/リリース計画.md)、[template/イテレーション計画.md](../template/イテレーション計画.md)、[template/イテレーション完了報告書.md](../template/イテレーション完了報告書.md)、[template/リリース完了報告書.md](../template/リリース完了報告書.md) を利用できます。
