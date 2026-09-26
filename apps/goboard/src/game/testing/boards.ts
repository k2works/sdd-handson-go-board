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

/**
 * すべてのマスが埋まり、どこにも同じ種類の 3 つ以上の連続がない盤面（S08・S10）。犬 113・猫 112。
 * どの途中の盤も連続は 2 以下なので、勝ち（R7）にも R9 にも当たらず、最初の手から交互に置いて到達できる。
 * 最後に犬が 8 行 8 列に置くと盤が埋まり、引き分けになる（R8）。
 */
export const FULL_BOARD_DRAW = {
  rows: [
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
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

/**
 * 5 行 7 列と 1 行 3 列だけが空いている盤面（S12）。手番は猫。
 * 猫が 1 行 3 列に置くと、犬が置けるのは 5 行 7 列だけになる。そこに犬を置くと 4 方向に
 * ちょうど 3 つの並びができるため R9 で置けず、置けるマスがなくなって引き分けになる（R10）。
 * 探索スクリプトで作り、上の条件を確かめた。
 */
export const NO_PLACEABLE_DRAW = {
  rows: [
    'DD.CDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDD.CDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
    'CCDDCCDDCCDDCCD',
    'DDCCDDCCDDCCDDC',
  ],
  turn: 'cat',
  lastCell: { row: 1, col: 3 },
  blockedCell: { row: 5, col: 7 },
} as const;

/**
 * 盤面の駒を、犬から始めて犬と猫が交互に置く手順に並べる。lastCell は最後に置く。
 * それぞれの駒は読み順（1 行目の左から）に置く。
 */
export function movesToFill(rows: readonly string[], lastCell: Position): Position[] {
  const cells = (mark: string): Position[] =>
    rows.flatMap((line, rowIndex) =>
      [...line].flatMap((m, colIndex) =>
        m === mark && !(rowIndex + 1 === lastCell.row && colIndex + 1 === lastCell.col)
          ? [{ row: rowIndex + 1, col: colIndex + 1 }]
          : [],
      ),
    );
  const lastMark = rows[lastCell.row - 1]?.[lastCell.col - 1];
  const dogs = [...cells('D'), ...(lastMark === 'D' ? [lastCell] : [])];
  const cats = [...cells('C'), ...(lastMark === 'C' ? [lastCell] : [])];
  const moves: Position[] = [];
  for (let i = 0; i < Math.max(dogs.length, cats.length); i++) {
    if (dogs[i]) moves.push(dogs[i]!);
    if (cats[i]) moves.push(cats[i]!);
  }
  return moves;
}

