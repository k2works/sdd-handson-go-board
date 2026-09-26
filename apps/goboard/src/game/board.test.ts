import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, Board } from './board';

describe('Board（S01・R2）', () => {
  it('新しい盤は縦 15 行 × 横 15 列である', () => {
    const board = Board.empty();

    expect(board.size).toBe(15);
    expect(BOARD_SIZE).toBe(15);
  });

  it('新しい盤は 225 マスすべてが空いている', () => {
    const board = Board.empty();

    let emptyCells = 0;
    for (let row = 1; row <= BOARD_SIZE; row++) {
      for (let col = 1; col <= BOARD_SIZE; col++) {
        if (board.pieceAt({ row, col }) === null) {
          emptyCells++;
        }
      }
    }

    expect(emptyCells).toBe(225);
  });
});
