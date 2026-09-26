import assert from 'node:assert/strict';
import { Then, When } from '@cucumber/cucumber';
import type { PieceName } from '../support/board-page';
import type { GoBoardWorld } from '../support/world';

When('{int} 行 {int} 列の空いているマスをクリックする', async function (this: GoBoardWorld, row: number, col: number) {
  await this.board.cell(row, col, '空き').click();
});

When('{int} 行 {int} 列のマスをクリックする', async function (this: GoBoardWorld, row: number, col: number) {
  await this.board.clickCell(row, col);
});

Then(
  '{int} 行 {int} 列に{piece}の駒 {string} が表示される',
  async function (this: GoBoardWorld, row: number, col: number, piece: PieceName, symbol: string) {
    assert.equal(await this.board.cell(row, col, piece).textContent(), symbol);
  },
);

Then('{string} と表示される', async function (this: GoBoardWorld, text: string) {
  assert.ok(await this.page.getByText(text, { exact: true }).isVisible(), `"${text}" が表示されていない`);
});

Then('置けない理由が表示される', async function (this: GoBoardWorld) {
  const alert = this.board.alert();
  assert.ok(await alert.isVisible(), '置けない理由が表示されていない');
  assert.notEqual((await alert.textContent())?.trim(), '');
});
