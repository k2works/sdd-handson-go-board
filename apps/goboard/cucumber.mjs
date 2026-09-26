/**
 * Cucumber-JS の設定。受け入れテストはブラウザ（Playwright）で GoBoard を操作して検証する。
 * 実装前のシナリオには @wip を付け、既定の実行から除く（features/tags.md）。
 */
const common = {
  paths: ['features/**/*.feature'],
  import: ['features/support/**/*.ts', 'features/step_definitions/**/*.ts'],
  formatOptions: { snippetInterface: 'async-await' },
};

/** 既定：実装済みのシナリオだけを実行する。 */
export default {
  ...common,
  tags: 'not @wip',
  format: ['progress', 'html:reports/cucumber-report.html'],
};

/** 実装前（@wip）のシナリオだけを実行し、未定義・保留のステップを確認する。 */
export const wip = {
  ...common,
  tags: '@wip',
  format: ['progress'],
  strict: false,
};
