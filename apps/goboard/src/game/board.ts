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

/** 置けるかどうか。ok：置ける、occupied：駒がある（R5・R6）、outside：盤の外（R2）。 */
export type Placeability = 'ok' | 'occupied' | 'outside';

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
    if (!isInside(position)) {
      return null;
    }
    return this.cells[indexOf(position)] ?? null;
  }

  /** 指定したマスに駒を置けるかどうか。 */
  placeability(position: Position): Placeability {
    if (!isInside(position)) {
      return 'outside';
    }
    return this.pieceAt(position) === null ? 'ok' : 'occupied';
  }

  /**
   * 指定したマスに駒を置いた新しい盤を返す（R5）。この盤は変わらない（R6）。
   * 置けないマスを指定したら例外を投げる。置けるかどうかは先に placeability で確かめる。
   */
  place(position: Position, piece: Piece): Board {
    const placeability = this.placeability(position);
    if (placeability !== 'ok') {
      throw new Error(`${position.row} 行 ${position.col} 列には置けません（${placeability}）`);
    }
    const cells = [...this.cells];
    cells[indexOf(position)] = piece;
    return new Board(cells);
  }
}

function isInside({ row, col }: Position): boolean {
  return Number.isInteger(row) && Number.isInteger(col) && row >= 1 && row <= BOARD_SIZE && col >= 1 && col <= BOARD_SIZE;
}

function indexOf({ row, col }: Position): number {
  return (row - 1) * BOARD_SIZE + (col - 1);
}
