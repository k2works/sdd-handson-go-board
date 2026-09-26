import { describe, expect, it } from 'vitest';
import { Game } from './game';
import type { Position } from './board';
import { LAST_CELL_WINS, boardFromRows } from './testing/boards';

const at = (row: number, col: number): Position => ({ row, col });

/** 相手の手番を進めるための駒を置く、最下段の位置。 */
const FILLERS = [at(15, 1), at(15, 3), at(15, 5), at(15, 7), at(15, 9), at(15, 11)];

/** 犬と猫が交互に置く。dogs[0]、cats[0]、dogs[1]、cats[1]… の順。 */
function playAlternately(dogs: Position[], cats: Position[]): Game {
  let game = Game.start();
  for (let i = 0; i < Math.max(dogs.length, cats.length); i++) {
    for (const position of [dogs[i], cats[i]]) {
      if (!position) continue;
      const result = game.play(position);
      if (!result.ok) throw new Error(`${position.row} 行 ${position.col} 列に置けない: ${result.reason}`);
      game = result.game;
    }
  }
  return game;
}

describe('5 つ以上並べたら勝つ（S06・R7）', () => {
  it('対局を始めた直後は、勝負はついていない', () => {
    expect(Game.start().outcome).toEqual({ kind: 'ongoing' });
  });

  it.each([
    { name: '横', line: [at(8, 4), at(8, 5), at(8, 6), at(8, 7)] },
    { name: '縦', line: [at(4, 8), at(5, 8), at(6, 8), at(7, 8)] },
    { name: '右下がり', line: [at(4, 4), at(5, 5), at(6, 6), at(7, 7)] },
    { name: '右上がり', line: [at(12, 4), at(11, 5), at(10, 6), at(9, 7)] },
  ])('$name に 5 つ連続すれば犬が勝つ', ({ line }) => {
    const game = playAlternately(line, FILLERS.slice(0, 4));

    const result = game.play(at(8, 8));

    expect(result.game.outcome).toEqual({ kind: 'win', winner: 'dog' });
  });

  it('猫も 5 つ連続すれば勝つ', () => {
    const game = playAlternately(FILLERS.slice(0, 5), [at(8, 4), at(8, 5), at(8, 6), at(8, 7)]);

    const result = game.play(at(8, 8));

    expect(result.game.outcome).toEqual({ kind: 'win', winner: 'cat' });
  });

  it('6 つ以上連続しても勝つ', () => {
    const game = playAlternately([at(8, 4), at(8, 5), at(8, 7), at(8, 8), at(8, 9)], FILLERS.slice(0, 5));

    const result = game.play(at(8, 6));

    expect(result.game.outcome).toEqual({ kind: 'win', winner: 'dog' });
  });

  it('並びに接しないマスに置いても勝ちにならない', () => {
    const game = playAlternately([at(8, 4), at(8, 5), at(8, 6), at(8, 7)], FILLERS.slice(0, 4));

    const result = game.play(at(1, 1));

    expect(result.game.outcome).toEqual({ kind: 'ongoing' });
  });

  it('別の種類の駒が混ざった並びは勝ちにならない', () => {
    const game = playAlternately([at(8, 4), at(8, 5), at(8, 6), at(8, 7)], [...FILLERS.slice(0, 3), at(8, 8)]);

    expect(game.outcome).toEqual({ kind: 'ongoing' });
  });

  it('あいだが空いた並びは勝ちにならない', () => {
    const game = playAlternately([at(8, 3), at(8, 4), at(8, 5), at(8, 7)], FILLERS.slice(0, 4));

    const result = game.play(at(8, 8));

    expect(result.game.outcome).toEqual({ kind: 'ongoing' });
  });

  it('盤の端に接して 5 つ連続しても勝つ', () => {
    const game = playAlternately([at(1, 1), at(1, 2), at(1, 3), at(1, 4)], FILLERS.slice(0, 4));

    const result = game.play(at(1, 5));

    expect(result.game.outcome).toEqual({ kind: 'win', winner: 'dog' });
  });
});

describe('勝負がついたらゲームが終わる（S07・R7・R8）', () => {
  const dogWins = (): Game =>
    playAlternately([at(8, 4), at(8, 5), at(8, 6), at(8, 7), at(8, 8)], FILLERS.slice(0, 4));

  it('勝ちが決まったあとは置けず、理由は finished で、盤は変わらない', () => {
    const finished = dogWins();

    const result = finished.play(at(1, 1));

    expect(result.ok).toBe(false);
    expect(result.ok ? undefined : result.reason).toBe('finished');
    expect(result.game.board.pieceAt(at(1, 1))).toBeNull();
    expect(result.game.outcome).toEqual({ kind: 'win', winner: 'dog' });
  });

  it('最後の 1 マスで 5 つ連続したら、盤が埋まっても勝ちになる', () => {
    const game = Game.resume(boardFromRows(LAST_CELL_WINS.rows), 'dog');
    expect(game.outcome).toEqual({ kind: 'ongoing' });

    const result = game.play(LAST_CELL_WINS.lastCell);

    expect(result.ok).toBe(true);
    expect(result.game.outcome).toEqual({ kind: 'win', winner: 'dog' });
  });
});

describe('途中の盤面から対局を再開する', () => {
  it('盤にすでに 5 つの並びがあれば、その種類の勝ちで終わっている', () => {
    const board = boardFromRows(['DDDDD']);

    expect(Game.resume(board, 'cat').outcome).toEqual({ kind: 'win', winner: 'dog' });
  });
});
