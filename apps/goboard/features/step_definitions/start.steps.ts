import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import type { GoBoardWorld } from '../support/world';

Given('GoBoard を開いていない', async function (this: GoBoardWorld) {
  assert.equal(this.page.url(), 'about:blank');
});

When('ブラウザで GoBoard を開く', async function (this: GoBoardWorld) {
  await this.board.open();
});

Given('GoBoard を開いた', async function (this: GoBoardWorld) {
  await this.board.open();
});

Then('縦 {int} 行 × 横 {int} 列の盤が表示される', async function (this: GoBoardWorld, rows: number, cols: number) {
  const rowLocators = await this.board.rows().all();
  assert.equal(rowLocators.length, rows);
  for (const row of rowLocators) {
    assert.equal(await row.getByRole('button').count(), cols);
  }
});

Then(
  '{int} マスすべてが空いているマス {string} で表示される',
  async function (this: GoBoardWorld, count: number, symbol: string) {
    assert.equal(await this.board.emptyCells().count(), count);
    const texts = await this.board.cells().allTextContents();
    assert.equal(texts.length, count);
    assert.ok(texts.every((text) => text === symbol), `すべてのマスが "${symbol}" ではない`);
  },
);

Then('盤の上に {string} という名前が表示される', async function (this: GoBoardWorld, name: string) {
  assert.ok(await this.board.heading(name).isVisible(), `"${name}" の見出しが表示されていない`);
});
