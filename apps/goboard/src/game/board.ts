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

/** 並びの向き。1 歩進むときの行と列の変化で表す。 */
export type Direction = {
  readonly dRow: number;
  readonly dCol: number;
};

/** 並びの 4 方向（R7・R9）。 */
export const DIRECTIONS = {
  horizontal: { dRow: 0, dCol: 1 },
  vertical: { dRow: 1, dCol: 0 },
  /** 右下がりの斜め */
  diagonalDown: { dRow: 1, dCol: 1 },
  /** 右上がりの斜め */
  diagonalUp: { dRow: -1, dCol: 1 },
} as const satisfies Record<string, Direction>;

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

  /**
   * 指定したマスの駒と同じ種類の駒が、その向きの軸（前後両方向）に
   * あいだを空けずにいくつ連続しているかを返す。空いているマスなら 0。
   */
  runLength(position: Position, direction: Direction): number {
    const piece = this.pieceAt(position);
    if (piece === null) {
      return 0;
    }
    const countToward = (dRow: number, dCol: number): number => {
      let count = 0;
      let next = { row: position.row + dRow, col: position.col + dCol };
      while (this.pieceAt(next) === piece) {
        count++;
        next = { row: next.row + dRow, col: next.col + dCol };
      }
      return count;
    };
    return 1 + countToward(direction.dRow, direction.dCol) + countToward(-direction.dRow, -direction.dCol);
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
