import { Board, type Position } from '../board';

/**
 * テスト用の盤面。1 行を 15 文字で表し、D は犬、C は猫、. は空いているマス。
 * 例：['D.C', ...] は 1 行 1 列が犬、1 行 3 列が猫。
 */
export function boardFromRows(rows: readonly string[]): Board {
  let board = Board.empty();
  rows.forEach((line, rowIndex) => {
    [...line].forEach((mark, colIndex) => {
      const position: Position = { row: rowIndex + 1, col: colIndex + 1 };
      if (mark === 'D') board = board.place(position, 'dog');
      if (mark === 'C') board = board.place(position, 'cat');
    });
  });
  return board;
}

/**
 * 224 マスが埋まり、8 行 8 列だけが空いている盤面（S07）。
 * 犬 112・猫 112 で、どちらも 5 つ並んでいない。8 行 8 列に犬を置くと、8 行 4〜8 列が横に 5 つ並ぶ。
 * 探索スクリプトで作り、上の条件を総当たりで確かめた。
 */
export const LAST_CELL_WINS = {
  rows: [
  'DDCCDDCCDDCCDDC',
  'CCDDCCDDCCDDCCD',
  'DDCCDDCCDDCCDDC',
  'CCDDCCDDCCDDCCD',
  'DDCCDDCCDDCCDDC',
  'CCDDCCDDCCDDCCD',
  'DDCCDDCCCDCCDDC',
  'CCCDDDD.CCDDCCD',
  'DDCCDDCCDDCCDDC',
  'CCDDCCDDCCDDCCD',
  'DDCCDDCCDDCCDDC',
  'CCDDCCDDCCDDCCD',
  'DDCCDDCCDDCCDDC',
  'CCDDCCDDCCDDCCD',
  'DDCCDDCCDDCCDDC',
  ],
  lastCell: { row: 8, col: 8 },
} as const;
