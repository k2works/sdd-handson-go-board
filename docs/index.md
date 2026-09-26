---
okf_version: "0.2"
---

# プロジェクトドキュメント

プロジェクトで管理しているドキュメントの入口です。

## まずこれを読もうリスト

- [戦略](./strategy/index.md) - ビジネス構造やプロジェクトの方向性を整理します。
- [要件](./requirements/index.md) - RDRA 2.0 ベースで要件を定義します。
- [設計](./design/index.md) - アーキテクチャ、モデル、品質方針を整理します。
- [開発](./development/index.md) - リリース計画とイテレーション管理の入口です。
- [運用](./operation/index.md) - 環境構築、デプロイ、運用関連の入口です。
- [記事](./article/index.md) - 学習用の記事シリーズの入口です。

## プロジェクト

| プロジェクト | 概要 | 主なドキュメント |
| :--- | :--- | :--- |
| GoBoard（v0.1.0） | 2 人が犬と猫の駒を交互に置き、同じ種類の駒を先に 5 つ並べた方が勝つボードゲーム（`apps/goboard/`） | [ルール定義](./requirements/goboard/ルール定義.md)・[ユーザーストーリー](./requirements/goboard/ユーザーストーリー.md)・[アーキテクチャ設計](./design/goboard/architecture.md)・[ドメインモデル](./design/goboard/domain-model.md)・[UI 設計](./design/goboard/ui-design.md)・[リリース計画](./development/goboard/release_plan.md)・[リリース完了報告書](./development/goboard/release_report-v0.1.0.md)・[ADR](./adr/goboard/index.md) |

## ドキュメント構成

| カテゴリ | 概要                                  | 状況 |
| :--- |:------------------------------------| :--- |
| [戦略](./strategy/index.md) | 企業分析、経営戦略、ビジネスアーキテクチャ、インセプションデッキの整理 | `index.md` を整備済み |
| [要件](./requirements/index.md) | RDRA 2.0 とユースケース整理の入口               | GoBoard のルール定義・ユーザーストーリー |
| [設計](./design/index.md) | アーキテクチャ、モデル、テスト、非機能の整理              | GoBoard のアーキテクチャ設計・ドメインモデル・UI 設計 |
| [開発](./development/index.md) | リリース計画、イテレーション計画、進捗管理               | GoBoard のリリース計画・Bolt 1〜5 計画・リリース完了報告書 |
| [運用](./operation/index.md) | 環境構築、デプロイ、運用手順の整理                   | `index.md` を整備済み |
| [レビュー](./review/index.md) | 分析・開発レビュー結果の記録                      | `index.md` を整備済み |
| [ADR](./adr/index.md) | Architecture Decision Records の管理   | GoBoard の ADR 2 件 |
| [記事](./article/index.md) | 学習用の記事シリーズ一覧                        | 公開サイトへのリンク集 |
| [リファレンス](./reference/index.md) | 開発ガイドラインやベストプラクティス                  | 39 件のドキュメントを配置 |
| [テンプレート](./template/index.md) | 各種ドキュメントの作成テンプレート                   | 18 件のテンプレートを配置 |

## 補足

- 要件定義以降のカテゴリは、プロジェクトのサブディレクトリ（例：`goboard/`）で区切ります（[ドキュメント構成ガイド](./reference/ドキュメント構成ガイド.md)）。`strategy/`・`operation/`・`review/` は、現時点ではカテゴリ索引が中心です。
- `journal/` は作業ログ用の予約ディレクトリです。
- `assets/` は MkDocs 用のスタイル・スクリプトを格納しています。
