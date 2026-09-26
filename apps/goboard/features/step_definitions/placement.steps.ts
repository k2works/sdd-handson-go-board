import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import type { PieceName } from '../support/board-page';
import type { GoBoardWorld } from '../support/world';

Given('{int} 行 {int} 列が空いている', async function (this: GoBoardWorld, row: number, col: number) {
  assert.equal(await this.board.cell(row, col, '空き').count(), 1);
});

Given('{piece}の手番である', async function (this: GoBoardWorld, piece: PieceName) {
  // 手番（U2）は Bolt 2 で実装する。それまでは、駒が 1 つもない開始直後の犬の手番（R4）だけを扱う。
  if (piece !== '犬' || (await this.board.occupiedCells().count()) !== 0) {
    return 'pending';
  }
});

When(
  '{piece}のプレイヤーが {int} 行 {int} 列に置く',
  async function (this: GoBoardWorld, _piece: PieceName, row: number, col: number) {
    await this.board.clickCell(row, col);
  },
);

Then(
  '{int} 行 {int} 列が{piece}の駒になる',
  async function (this: GoBoardWorld, row: number, col: number, piece: PieceName) {
    assert.equal(await this.board.cell(row, col, piece).count(), 1);
  },
);

Then('ほかの {int} マスは置く前と同じく空いている', async function (this: GoBoardWorld, count: number) {
  assert.equal(await this.board.emptyCells().count(), count);
});

Then('盤の駒は {int} つだけである', async function (this: GoBoardWorld, count: number) {
  assert.equal(await this.board.occupiedCells().count(), count);
});
