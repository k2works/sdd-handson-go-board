import assert from 'node:assert/strict';
import { Given, When } from '@cucumber/cucumber';
import { Game } from '../../src/game';
import { FULL_BOARD_DRAW, NO_PLACEABLE_DRAW, boardFromRows, movesToFill } from '../../src/game/testing/boards';
import type { GoBoardWorld } from '../support/world';

/** 盤が埋まって引き分けになる手順（犬から交互に 225 手。最後は犬が 8 行 8 列に置く）。 */
const FULL_BOARD_MOVES = movesToFill(FULL_BOARD_DRAW.rows, FULL_BOARD_DRAW.lastCell);

Given('空いているマスが {int} つだけで、そこに置いても {int} つ連続しない', async function (this: GoBoardWorld, empty: number, count: number) {
  assert.equal(empty, 1);
  assert.equal(count, 5);
  await this.board.clickAllInOrder(FULL_BOARD_MOVES.slice(0, -1));
  assert.equal(await this.board.emptyCells().count(), 1);
  assert.equal(await this.board.statusText(), '犬の手番');
  this.lastCell = FULL_BOARD_DRAW.lastCell;
});

When('手番のプレイヤーが最後の空いているマスに置く', async function (this: GoBoardWorld) {
  assert.ok(this.lastCell);
  await this.board.cell(this.lastCell.row, this.lastCell.col, '空き').click();
});

Given('盤が埋まって引き分けになった', async function (this: GoBoardWorld) {
  await this.board.clickAllInOrder(FULL_BOARD_MOVES);
  assert.equal(await this.board.statusText(), '引き分け');
  this.boardAtEnd = await this.board.snapshot();
});

Given(
  '相手が次に置くと、次の手番のプレイヤーにとって空いているマスがすべて R9 で置けなくなる',
  function (this: GoBoardWorld) {
    this.game = Game.resume(boardFromRows(NO_PLACEABLE_DRAW.rows), NO_PLACEABLE_DRAW.turn);
    this.lastCell = NO_PLACEABLE_DRAW.lastCell;
    assert.deepEqual(this.game.outcome, { kind: 'ongoing' });
  },
);

When('相手のプレイヤーが勝ちにならないマスに置く', function (this: GoBoardWorld) {
  assert.ok(this.game && this.lastCell);
  this.lastResult = this.game.play(this.lastCell);
  assert.ok(this.lastResult.ok, '置けなかった');
  this.game = this.lastResult.game;
});

Given('置けるマスがなくなって引き分けになった', function (this: GoBoardWorld) {
  const result = Game.resume(boardFromRows(NO_PLACEABLE_DRAW.rows), NO_PLACEABLE_DRAW.turn).play(
    NO_PLACEABLE_DRAW.lastCell,
  );
  assert.ok(result.ok);
  this.game = result.game;
  assert.deepEqual(this.game.outcome, { kind: 'draw' });
});
