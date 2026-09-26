/** 盤の一辺のマス数（R2：盤は縦 15 × 横 15）。 */
export const BOARD_SIZE = 15;

/** 駒の種類（R3：駒は犬と猫の 2 種類）。 */
export type Piece = 'dog' | 'cat';

/** マスの位置。行・列とも 1 から BOARD_SIZE まで。 */
export type Position = {
  readonly row: number;
  readonly col: number;
};

/** マスの状態。駒が置かれていなければ null（空いているマス）。 */
export type Cell = Piece | null;

/** 盤（R2）。縦 BOARD_SIZE 行 × 横 BOARD_SIZE 列のマス目。 */
export class Board {
  readonly size = BOARD_SIZE;

  private constructor(private readonly cells: readonly Cell[]) {}

  /** すべてのマスが空いている盤を作る。 */
  static empty(): Board {
    return new Board(Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => null));
  }

  /** 指定したマスの駒を返す。空いていれば null。 */
  pieceAt(position: Position): Cell {
    return this.cells[indexOf(position)] ?? null;
  }
}

function indexOf({ row, col }: Position): number {
  return (row - 1) * BOARD_SIZE + (col - 1);
}
