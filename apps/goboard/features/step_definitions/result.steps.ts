import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import { Game, WIN_LENGTH } from '../../src/game';
import { LAST_CELL_WINS, boardFromRows } from '../../src/game/testing/boards';
import type { PieceName } from '../support/board-page';
import { ensureTurn } from '../support/turns';
import { toPiece, type GoBoardWorld } from '../support/world';

/** 勝ちを作る並び。8 行 4〜7 列に置いたあと、8 行 8 列に置くと横に 5 つ並ぶ。 */
const WINNING_LINE = [4, 5, 6, 7].map((col) => ({ row: 8, col }));
const WINNING_CELL = { row: 8, col: 8 };

Given('{piece}が {int} つ連続させて勝った', async function (this: GoBoardWorld, piece: PieceName, count: number) {
  assert.equal(count, WIN_LENGTH);
  for (const { row, col } of [...WINNING_LINE, WINNING_CELL]) {
    await ensureTurn(this, piece);
    await this.board.cell(row, col, '空き').click();
  }
  assert.equal(await this.board.statusText(), `${piece}の勝ち`);
  this.boardAtEnd = await this.board.snapshot();
});

Given(
  '空いているマスが {int} つだけで、そこに置くと犬の駒が {int} つ連続する',
  function (this: GoBoardWorld, empty: number, count: number) {
    assert.equal(empty, 1);
    assert.equal(count, WIN_LENGTH);
    // 画面のクリックでは準備できない盤面のため、ルール（Game）に対して直接検証する。
    this.game = Game.resume(boardFromRows(LAST_CELL_WINS.rows), 'dog');
    this.lastCell = LAST_CELL_WINS.lastCell;
  },
);

When('犬のプレイヤーが最後の空いているマスに置く', function (this: GoBoardWorld) {
  assert.ok(this.game && this.lastCell, 'ルールに対する検証でのみ使うステップ');
  assert.equal(this.game.turn, 'dog');
  this.lastResult = this.game.play(this.lastCell);
  assert.ok(this.lastResult.ok, '最後の空いているマスに置けなかった');
  this.game = this.lastResult.game;
});

When('空いているマスをクリックする', async function (this: GoBoardWorld) {
  const cell = this.board.cell(1, 1, '空き');
  assert.equal(await cell.count(), 1, '1 行 1 列が空いていない');
  await cell.click();
});

Then('{piece}の勝ちになる', async function (this: GoBoardWorld, piece: PieceName) {
  if (this.game) {
    assert.deepEqual(this.game.outcome, { kind: 'win', winner: toPiece(piece) });
    return;
  }
  assert.equal(await this.board.statusText(), `${piece}の勝ち`);
});

Then('ゲームは終わっていない', async function (this: GoBoardWorld) {
  if (this.game) {
    assert.deepEqual(this.game.outcome, { kind: 'ongoing' });
    return;
  }
  assert.notEqual(await this.board.turnIfOngoing(), null, `勝負がついている: "${await this.board.statusText()}"`);
});

Then('盤は勝ちが決まった時点のまま変わらない', async function (this: GoBoardWorld) {
  assert.deepEqual(await this.board.snapshot(), this.boardAtEnd);
});

Then('駒は置かれない', async function (this: GoBoardWorld) {
  assert.deepEqual(await this.board.snapshot(), this.boardAtEnd);
});

Then('最後の盤と {string} が表示される', async function (this: GoBoardWorld, text: string) {
  assert.equal(await this.board.statusText(), text);
  assert.deepEqual(await this.board.snapshot(), this.boardAtEnd);
});
