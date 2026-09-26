import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import { Game, type Position } from '../../src/game';
import type { PieceName } from '../support/board-page';
import { ensureTurn } from '../support/turns';
import { toPiece, toPieceName, type GoBoardWorld } from '../support/world';

Given('対局中である', function (this: GoBoardWorld) {
  this.game = Game.start();
});

Given('{int} 行 {int} 列が空いている', async function (this: GoBoardWorld, row: number, col: number) {
  assert.equal(await this.board.cell(row, col, '空き').count(), 1);
});

Given('{piece}の駒が {positions} にある', async function (this: GoBoardWorld, piece: PieceName, positions: Position[]) {
  if (this.game) {
    // ルールに対して検証するときは、手番や R9 を通さずに盤へ直接置く。特に書いていないマスは空いたまま。
    const board = positions.reduce((current, position) => current.place(position, toPiece(piece)), this.game.board);
    this.game = Game.resume(board, this.game.turn);
    return;
  }
  for (const { row, col } of positions) {
    await ensureTurn(this, piece);
    await this.board.cell(row, col, '空き').click();
  }
});

Given('{piece}の手番である', async function (this: GoBoardWorld, piece: PieceName) {
  if (this.game) {
    this.game = Game.resume(this.game.board, toPiece(piece));
    return;
  }
  await ensureTurn(this, piece);
});

When(
  '{piece}のプレイヤーが {int} 行 {int} 列に置く',
  async function (this: GoBoardWorld, piece: PieceName, row: number, col: number) {
    if (this.game) {
      assert.equal(toPieceName(this.game.turn), piece, `${piece}の手番ではない`);
      playOnRules(this, { row, col });
      assert.ok(this.lastResult?.ok, `${row} 行 ${col} 列に置けなかった`);
      return;
    }
    assert.equal(await this.board.currentTurn(), piece, `${piece}の手番ではない`);
    await this.board.clickCell(row, col);
  },
);

When(
  '{piece}のプレイヤーが {int} 行 {int} 列に置こうとする',
  async function (this: GoBoardWorld, piece: PieceName, row: number, col: number) {
    if (this.game) {
      assert.equal(toPieceName(this.game.turn), piece, `${piece}の手番ではない`);
      playOnRules(this, { row, col });
      return;
    }
    // 勝負がついたあと（S07）は手番の表示がないため、対局中のときだけ手番を確かめる。
    const turn = await this.board.turnIfOngoing();
    if (turn) {
      assert.equal(turn, piece, `${piece}の手番ではない`);
    }
    this.playerBefore = piece;
    this.boardBefore = await this.board.snapshot();
    await this.board.clickCell(row, col);
  },
);

When('手番のプレイヤーが {int} 行 {int} 列に置く', async function (this: GoBoardWorld, row: number, col: number) {
  await tryToPlace(this, { row, col });
  if (this.game) {
    assert.ok(this.lastResult?.ok, `${row} 行 ${col} 列に置けなかった`);
  }
});

When('手番のプレイヤーが {int} 行 {int} 列に置こうとする', async function (this: GoBoardWorld, row: number, col: number) {
  await tryToPlace(this, { row, col });
});

/** ルール（Game）に対して、手番のプレイヤーとして置こうとする。 */
function playOnRules(world: GoBoardWorld, position: Position): void {
  assert.ok(world.game);
  world.gameBefore = world.game;
  world.playerBefore = toPieceName(world.game.turn);
  world.lastResult = world.game.play(position);
  world.game = world.lastResult.game;
}

/** 手番のプレイヤーとして置こうとする。ルールに対して検証するときは Game に、それ以外は画面で置く。 */
async function tryToPlace(world: GoBoardWorld, position: Position): Promise<void> {
  if (world.game) {
    playOnRules(world, position);
    return;
  }
  world.playerBefore = await world.board.currentTurn();
  world.boardBefore = await world.board.snapshot();
  await world.board.clickCell(position.row, position.col);
}

Then('置けない', async function (this: GoBoardWorld) {
  if (this.game) {
    assert.equal(this.lastResult?.ok, false, '置けてしまった');
    return;
  }
  assert.ok(await this.board.alert().isVisible(), '置けない理由が表示されていない');
  assert.deepEqual(await this.board.snapshot(), this.boardBefore, '盤が変わってしまった');
});

Then(
  '{int} 行 {int} 列が{piece}の駒になる',
  async function (this: GoBoardWorld, row: number, col: number, piece: PieceName) {
    if (this.game) {
      assert.equal(this.game.board.pieceAt({ row, col }), toPiece(piece));
      return;
    }
    assert.equal(await this.board.cell(row, col, piece).count(), 1);
  },
);

Then(
  '{int} 行 {int} 列は{piece}の駒のままである',
  async function (this: GoBoardWorld, row: number, col: number, piece: PieceName) {
    assert.equal(await this.board.cell(row, col, piece).count(), 1);
  },
);

Then(
  '{int} 行 {int} 列に手番のプレイヤーの駒がある',
  function (this: GoBoardWorld, row: number, col: number) {
    assert.ok(this.game && this.playerBefore, 'ルールに対する検証でのみ使うステップ');
    assert.equal(this.game.board.pieceAt({ row, col }), toPiece(this.playerBefore));
  },
);

Then('ほかの {int} マスは置く前と同じく空いている', async function (this: GoBoardWorld, count: number) {
  assert.equal(await this.board.emptyCells().count(), count);
});

Then('盤の駒は {int} つだけである', async function (this: GoBoardWorld, count: number) {
  assert.equal(await this.board.occupiedCells().count(), count);
});

Then('盤は置こうとする前と変わらない', async function (this: GoBoardWorld) {
  if (this.game) {
    assert.ok(this.gameBefore);
    assert.equal(this.game.board, this.gameBefore.board);
    return;
  }
  assert.deepEqual(await this.board.snapshot(), this.boardBefore);
});
