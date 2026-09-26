import { describe, expect, it } from 'vitest';
import { Board, DIRECTIONS, type Position } from './board';

function boardWith(dogs: Position[], cats: Position[] = []): Board {
  let board = Board.empty();
  for (const position of dogs) board = board.place(position, 'dog');
  for (const position of cats) board = board.place(position, 'cat');
  return board;
}

const at = (row: number, col: number): Position => ({ row, col });

describe('連続を数える（R7・R9 の土台）', () => {
  it('空いているマスの連続は 0', () => {
    expect(Board.empty().runLength(at(8, 8), DIRECTIONS.horizontal)).toBe(0);
  });

  it('1 つだけの駒は、どの向きでも 1', () => {
    const board = boardWith([at(8, 8)]);

    for (const direction of Object.values(DIRECTIONS)) {
      expect(board.runLength(at(8, 8), direction)).toBe(1);
    }
  });

  it('横に 3 つ連続していれば、並びのどのマスから数えても 3。縦は 1', () => {
    const board = boardWith([at(8, 6), at(8, 7), at(8, 8)]);

    expect(board.runLength(at(8, 6), DIRECTIONS.horizontal)).toBe(3);
    expect(board.runLength(at(8, 7), DIRECTIONS.horizontal)).toBe(3);
    expect(board.runLength(at(8, 8), DIRECTIONS.horizontal)).toBe(3);
    expect(board.runLength(at(8, 7), DIRECTIONS.vertical)).toBe(1);
  });

  it('縦に連続していれば数える', () => {
    const board = boardWith([at(6, 8), at(7, 8), at(8, 8), at(9, 8)]);

    expect(board.runLength(at(6, 8), DIRECTIONS.vertical)).toBe(4);
  });

  it('右下がりの斜めに連続していれば数える', () => {
    const board = boardWith([at(6, 6), at(7, 7), at(8, 8)]);

    expect(board.runLength(at(7, 7), DIRECTIONS.diagonalDown)).toBe(3);
    expect(board.runLength(at(7, 7), DIRECTIONS.diagonalUp)).toBe(1);
  });

  it('右上がりの斜めに連続していれば数える', () => {
    const board = boardWith([at(8, 6), at(7, 7), at(6, 8)]);

    expect(board.runLength(at(7, 7), DIRECTIONS.diagonalUp)).toBe(3);
    expect(board.runLength(at(7, 7), DIRECTIONS.diagonalDown)).toBe(1);
  });

  it('別の種類の駒で止まる', () => {
    const board = boardWith([at(8, 6), at(8, 7)], [at(8, 8)]);

    expect(board.runLength(at(8, 7), DIRECTIONS.horizontal)).toBe(2);
    expect(board.runLength(at(8, 8), DIRECTIONS.horizontal)).toBe(1);
  });

  it('あいだの空いているマスで止まる', () => {
    const board = boardWith([at(8, 5), at(8, 7)]);

    expect(board.runLength(at(8, 7), DIRECTIONS.horizontal)).toBe(1);
  });

  it('盤の端で止まる', () => {
    const board = boardWith([at(1, 1), at(1, 2), at(1, 3)]);

    expect(board.runLength(at(1, 1), DIRECTIONS.horizontal)).toBe(3);
    expect(board.runLength(at(1, 1), DIRECTIONS.diagonalUp)).toBe(1);
  });
});
