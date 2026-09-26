import assert from 'node:assert/strict';
import { Then } from '@cucumber/cucumber';
import type { PieceName } from '../support/board-page';
import { toPieceName, type GoBoardWorld } from '../support/world';

Then('手番は{piece}である', async function (this: GoBoardWorld, piece: PieceName) {
  assert.equal(await this.board.currentTurn(), piece);
});

Then('手番は{piece}のままである', async function (this: GoBoardWorld, piece: PieceName) {
  const current = this.game ? toPieceName(this.game.turn) : await this.board.currentTurn();
  assert.equal(current, piece);
});

Then('手番は置こうとしたプレイヤーのままである', async function (this: GoBoardWorld) {
  const current = this.game ? toPieceName(this.game.turn) : await this.board.currentTurn();
  assert.equal(current, this.playerBefore);
});

Then('手番を相手に渡す操作は表示されない', async function (this: GoBoardWorld) {
  assert.equal(await this.board.passButtons().count(), 0);
});
