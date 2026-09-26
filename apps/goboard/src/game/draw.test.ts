import { describe, expect, it } from 'vitest';
import type { Position } from './board';
import { Game } from './game';
import { FULL_BOARD_DRAW, NO_PLACEABLE_DRAW, boardFromRows, movesToFill } from './testing/boards';

/** 手順どおりに置く。置けなかったら失敗にする。 */
function playAll(game: Game, moves: Position[]): Game {
  return moves.reduce((current, position) => {
    const result = current.play(position);
    if (!result.ok) throw new Error(`${position.row} 行 ${position.col} 列に置けない: ${result.reason}`);
    return result.game;
  }, game);
}

describe('盤が埋まったら引き分けになる（S08・R8）', () => {
  const moves = movesToFill(FULL_BOARD_DRAW.rows, FULL_BOARD_DRAW.lastCell);

  it('最初の手から 224 手まで、勝負はつかない', () => {
    expect(moves).toHaveLength(225);

    const game = playAll(Game.start(), moves.slice(0, 224));

    expect(game.outcome).toEqual({ kind: 'ongoing' });
    expect(game.turn).toBe('dog');
  });

  it('最後の 1 マスに置いても勝ちがなければ引き分け', () => {
    const game = playAll(Game.start(), moves.slice(0, 224));

    const result = game.play(FULL_BOARD_DRAW.lastCell);

    expect(result.ok).toBe(true);
    expect(result.game.outcome).toEqual({ kind: 'draw' });
  });

  it('引き分けのあとは置けない', () => {
    const drawn = playAll(Game.start(), moves);

    const result = drawn.play({ row: 1, col: 1 });

    expect(result.ok).toBe(false);
    expect(result.ok ? undefined : result.reason).toBe('finished');
  });
});

describe('置けるマスがなくなったら引き分けになる（S12・R10）', () => {
  const resume = () => Game.resume(boardFromRows(NO_PLACEABLE_DRAW.rows), NO_PLACEABLE_DRAW.turn);

  it('再開した時点では、猫に置けるマスがあるので勝負はついていない', () => {
    expect(resume().outcome).toEqual({ kind: 'ongoing' });
  });

  it('猫が置いたあと、犬の置けるマスが R9 のマスだけになると引き分け', () => {
    const result = resume().play(NO_PLACEABLE_DRAW.lastCell);

    expect(result.ok).toBe(true);
    expect(result.game.board.pieceAt(NO_PLACEABLE_DRAW.blockedCell)).toBeNull();
    expect(result.game.outcome).toEqual({ kind: 'draw' });
  });

  it('次の手番のプレイヤーが置けるマスがあれば引き分けにならない', () => {
    const result = Game.start().play({ row: 8, col: 8 });

    expect(result.game.outcome).toEqual({ kind: 'ongoing' });
  });

  it('置けるマスがない盤面から再開すると、引き分けで終わっている', () => {
    const board = boardFromRows(NO_PLACEABLE_DRAW.rows).place(NO_PLACEABLE_DRAW.lastCell, 'cat');

    expect(Game.resume(board, 'dog').outcome).toEqual({ kind: 'draw' });
  });
});
