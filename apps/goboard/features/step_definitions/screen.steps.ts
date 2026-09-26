import assert from 'node:assert/strict';
import { Then, When } from '@cucumber/cucumber';
import type { PieceName } from '../support/board-page';
import type { GoBoardWorld } from '../support/world';

When('{int} 行 {int} 列の空いているマスをクリックする', async function (this: GoBoardWorld, row: number, col: number) {
  await this.board.cell(row, col, '空き').click();
});

Then(
  '{int} 行 {int} 列に{piece}の駒 {string} が表示される',
  async function (this: GoBoardWorld, row: number, col: number, piece: PieceName, symbol: string) {
    assert.equal(await this.board.cell(row, col, piece).textContent(), symbol);
  },
);
