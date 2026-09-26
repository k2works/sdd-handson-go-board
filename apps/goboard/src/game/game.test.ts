import { describe, expect, it } from 'vitest';
import { Game } from './game';

describe('対局を始める（S05・R4）', () => {
  it('先手は犬で、盤は空いている', () => {
    const game = Game.start();

    expect(game.turn).toBe('dog');
    expect(game.board.pieceAt({ row: 8, col: 8 })).toBeNull();
  });
});

describe('手番を交互に進める（S05・R4・R5）', () => {
  it('犬の手番に置くと、そのマスは犬の駒になり、手番は猫になる', () => {
    const result = Game.start().play({ row: 8, col: 8 });

    expect(result.ok).toBe(true);
    expect(result.game.board.pieceAt({ row: 8, col: 8 })).toBe('dog');
    expect(result.game.turn).toBe('cat');
  });

  it('猫の手番に置くと、そのマスは猫の駒になり、手番は犬になる', () => {
    const catTurn = Game.start().play({ row: 8, col: 8 }).game;

    const result = catTurn.play({ row: 9, col: 9 });

    expect(result.ok).toBe(true);
    expect(result.game.board.pieceAt({ row: 9, col: 9 })).toBe('cat');
    expect(result.game.turn).toBe('dog');
  });

  it('置く前の対局は変わらない', () => {
    const game = Game.start();

    game.play({ row: 8, col: 8 });

    expect(game.turn).toBe('dog');
    expect(game.board.pieceAt({ row: 8, col: 8 })).toBeNull();
  });
});

describe('置けないときは盤も手番も変わらない（S03・S04・R2・R5・R6）', () => {
  it('駒のあるマスには置けず、理由は occupied で、手番は置こうとしたプレイヤーのまま', () => {
    const catTurn = Game.start().play({ row: 3, col: 4 }).game;

    const result = catTurn.play({ row: 3, col: 4 });

    expect(result.ok).toBe(false);
    expect(result.ok ? undefined : result.reason).toBe('occupied');
    expect(result.game.turn).toBe('cat');
    expect(result.game.board.pieceAt({ row: 3, col: 4 })).toBe('dog');
  });

  it('盤の外には置けず、理由は outside で、手番は置こうとしたプレイヤーのまま', () => {
    const result = Game.start().play({ row: 16, col: 8 });

    expect(result.ok).toBe(false);
    expect(result.ok ? undefined : result.reason).toBe('outside');
    expect(result.game.turn).toBe('dog');
  });
});
