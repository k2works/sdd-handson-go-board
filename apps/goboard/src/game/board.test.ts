import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, Board, type Position } from './board';

function allPositions(): Position[] {
  const positions: Position[] = [];
  for (let row = 1; row <= BOARD_SIZE; row++) {
    for (let col = 1; col <= BOARD_SIZE; col++) {
      positions.push({ row, col });
    }
  }
  return positions;
}

describe('Board（S01・R2）', () => {
  it('新しい盤は縦 15 行 × 横 15 列である', () => {
    const board = Board.empty();

    expect(board.size).toBe(15);
    expect(BOARD_SIZE).toBe(15);
  });

  it('新しい盤は 225 マスすべてが空いている', () => {
    const board = Board.empty();

    const emptyCells = allPositions().filter((position) => board.pieceAt(position) === null);

    expect(emptyCells).toHaveLength(225);
  });
});

describe('Board に駒を置く（S02・R5）', () => {
  const target: Position = { row: 3, col: 4 };

  it('空いている 3 行 4 列に犬を置くと、3 行 4 列が犬になる', () => {
    const board = Board.empty().place(target, 'dog');

    expect(board.pieceAt(target)).toBe('dog');
  });

  it('駒を 1 つ置いても、ほかの 224 マスは置く前と同じく空いている', () => {
    const board = Board.empty().place(target, 'dog');

    const others = allPositions().filter((p) => !(p.row === target.row && p.col === target.col));
    expect(others).toHaveLength(224);
    expect(others.every((p) => board.pieceAt(p) === null)).toBe(true);
  });

  it('1 回置くと、盤の駒は 1 つだけ増える', () => {
    const board = Board.empty().place(target, 'dog');

    const pieces = allPositions().filter((p) => board.pieceAt(p) !== null);
    expect(pieces).toHaveLength(1);
  });

  it('置く前の盤は書き換えられない', () => {
    const before = Board.empty();

    before.place(target, 'dog');

    expect(before.pieceAt(target)).toBeNull();
  });
});
