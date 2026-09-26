import { describe, expect, it } from 'vitest';
import { Board, type Piece, type Position } from './board';
import { Game } from './game';

const at = (row: number, col: number): Position => ({ row, col });

/** 指定した駒だけがある盤と手番で対局を再開する。特に指定していないマスは空いている。 */
function gameWith({ dogs = [], cats = [], turn }: { dogs?: Position[]; cats?: Position[]; turn: Piece }): Game {
  let board = Board.empty();
  for (const position of dogs) board = board.place(position, 'dog');
  for (const position of cats) board = board.place(position, 'cat');
  return Game.resume(board, turn);
}

function expectRejected(game: Game, position: Position) {
  const result = game.play(position);
  expect(result.ok).toBe(false);
  expect(result.ok ? undefined : result.reason).toBe('exactThrees');
  return result;
}

function expectPlaced(game: Game, position: Position, piece: Piece) {
  const result = game.play(position);
  expect(result.ok).toBe(true);
  expect(result.game.board.pieceAt(position)).toBe(piece);
}

describe('ちょうど 3 つの並びを 2 か所以上作るマスには置けない（S11・R9）', () => {
  it('横と縦にちょうど 3 つの並びが 2 か所できるマスには置けない', () => {
    expectRejected(gameWith({ dogs: [at(8, 6), at(8, 7), at(6, 8), at(7, 8)], turn: 'dog' }), at(8, 8));
  });

  it('ちょうど 3 つの並びが 1 か所だけなら置ける', () => {
    expectPlaced(gameWith({ dogs: [at(8, 6), at(8, 7)], turn: 'dog' }), at(8, 8), 'dog');
  });

  it('右下がりと右上がりの斜めに 1 か所ずつできるマスには置けない', () => {
    expectRejected(gameWith({ dogs: [at(6, 6), at(7, 7), at(6, 10), at(7, 9)], turn: 'dog' }), at(8, 8));
  });

  it('置く駒が並びの真ん中になる場合も数える', () => {
    expectRejected(gameWith({ dogs: [at(8, 7), at(8, 9), at(7, 8), at(9, 8)], turn: 'dog' }), at(8, 8));
  });

  it('4 つの連続はちょうど 3 つの並びに数えない', () => {
    expectPlaced(gameWith({ dogs: [at(8, 5), at(8, 6), at(8, 7), at(6, 8), at(7, 8)], turn: 'dog' }), at(8, 8), 'dog');
  });

  it('あいだが空いた並びはちょうど 3 つの並びに数えない', () => {
    expectPlaced(gameWith({ dogs: [at(8, 5), at(8, 6), at(6, 8), at(7, 8)], turn: 'dog' }), at(8, 8), 'dog');
  });

  it('置く駒を含まない並びは数えない', () => {
    expectPlaced(
      gameWith({ dogs: [at(2, 2), at(2, 3), at(2, 4), at(6, 8), at(7, 8)], turn: 'dog' }),
      at(8, 8),
      'dog',
    );
  });

  it('両端が相手の駒でふさがれていても数える', () => {
    expectRejected(
      gameWith({ dogs: [at(8, 6), at(8, 7), at(6, 8), at(7, 8)], cats: [at(8, 5), at(5, 8)], turn: 'dog' }),
      at(8, 8),
    );
  });

  it('盤の端でふさがれていても数える', () => {
    expectRejected(gameWith({ dogs: [at(1, 2), at(1, 3), at(2, 1), at(3, 1)], turn: 'dog' }), at(1, 1));
  });

  it('猫にも同じルールが当てはまる', () => {
    expectRejected(gameWith({ cats: [at(8, 6), at(8, 7), at(6, 8), at(7, 8)], turn: 'cat' }), at(8, 8));
  });

  it('相手の駒の並びは数えない', () => {
    expectPlaced(gameWith({ dogs: [at(8, 6), at(8, 7)], cats: [at(6, 8), at(7, 8)], turn: 'dog' }), at(8, 8), 'dog');
  });

  it('5 つ並ぶマスでも R9 に当たれば置けず、勝ちにもならない', () => {
    const game = gameWith({
      dogs: [at(8, 4), at(8, 5), at(8, 6), at(8, 7), at(6, 8), at(7, 8), at(6, 6), at(7, 7)],
      turn: 'dog',
    });

    const result = expectRejected(game, at(8, 8));

    expect(result.game.outcome).toEqual({ kind: 'ongoing' });
  });

  it('置けなかったときは盤も手番も変わらない', () => {
    const game = gameWith({ dogs: [at(8, 6), at(8, 7), at(6, 8), at(7, 8)], turn: 'dog' });

    const result = expectRejected(game, at(8, 8));

    expect(result.game).toBe(game);
    expect(result.game.board.pieceAt(at(8, 8))).toBeNull();
    expect(result.game.turn).toBe('dog');
  });
});
