import { BOARD_SIZE, Board, DIRECTIONS, type Piece, type Placeability, type Position } from './board';

/** 勝ちになる連続の数（R7：5 つ以上）。 */
export const WIN_LENGTH = 5;

/** 「ちょうど 3 つの並び」の数（R9）。 */
export const EXACT_THREE_LENGTH = 3;

/** 置けなくなる「ちょうど 3 つの並び」の数（R9：同時に 2 か所以上）。 */
export const EXACT_THREES_LIMIT = 2;

/**
 * 置けなかった理由。
 * finished：勝負がついてゲームが終わっている（S07）。
 * exactThrees：ちょうど 3 つの並びが同時に 2 か所以上できる（R9）。
 */
export type RejectionReason = Exclude<Placeability, 'ok'> | 'exactThrees' | 'finished';

/** 勝負の状態。ongoing：対局中、win：勝ちが決まった（R7）。 */
export type Outcome = { readonly kind: 'ongoing' } | { readonly kind: 'win'; readonly winner: Piece };

/** 駒を置こうとした結果。置けなかったときは、置こうとする前の対局と理由を返す。 */
export type PlayResult =
  | { readonly ok: true; readonly game: Game }
  | { readonly ok: false; readonly game: Game; readonly reason: RejectionReason };

const ONGOING: Outcome = { kind: 'ongoing' };

/** 対局（U2・U3）。盤と手番と勝負の状態を持ち、手番のプレイヤーの駒を置くたびに手番を交代する。 */
export class Game {
  private constructor(
    readonly board: Board,
    readonly turn: Piece,
    readonly outcome: Outcome,
  ) {}

  /** 空の盤と、先手の犬の手番で対局を始める（R4）。 */
  static start(): Game {
    return new Game(Board.empty(), 'dog', ONGOING);
  }

  /** 途中の盤面と手番から対局を再開する。盤にすでに 5 つ以上の並びがあれば、その種類の勝ちで終わっている。 */
  static resume(board: Board, turn: Piece): Game {
    const winner = findWinner(board);
    return new Game(board, turn, winner ? { kind: 'win', winner } : ONGOING);
  }

  /**
   * 手番のプレイヤーの駒を置く（R5）。置いたあとに勝ちを判定し（R7・R8）、勝ちでなければ手番を相手に渡す（R4）。
   * 置けなければ、盤も手番も変えずに理由を返す（パスにはならない）。
   * 置けるかどうか（R9 を含む）は、置く前に判定する。そのため R9 に当たるマスは、5 つ並ぶマスでも置けない。
   */
  play(position: Position): PlayResult {
    if (this.outcome.kind !== 'ongoing') {
      return { ok: false, game: this, reason: 'finished' };
    }
    const placeability = this.board.placeability(position);
    if (placeability !== 'ok') {
      return { ok: false, game: this, reason: placeability };
    }
    const board = this.board.place(position, this.turn);
    if (countExactThrees(board, position) >= EXACT_THREES_LIMIT) {
      return { ok: false, game: this, reason: 'exactThrees' };
    }
    const outcome: Outcome = makesWinningLine(board, position) ? { kind: 'win', winner: this.turn } : ONGOING;
    return { ok: true, game: new Game(board, opponentOf(this.turn), outcome) };
  }
}

/** 指定したマスを通る 4 方向のどれかに、5 つ以上の連続があるか（R7）。 */
function makesWinningLine(board: Board, position: Position): boolean {
  return Object.values(DIRECTIONS).some((direction) => board.runLength(position, direction) >= WIN_LENGTH);
}

/**
 * 指定したマスを通る 4 方向のうち、ちょうど 3 つの並びになっている方向の数（R9）。
 * runLength は同じ種類の駒があいだを空けずに連続する最大の長さなので、ちょうど 3 なら
 * 両隣に同じ種類の駒はない。4 つ以上の連続・あいだの空いた並びは含まれず、
 * 相手の駒や盤の端でふさがれていても数えられる。
 */
function countExactThrees(board: Board, position: Position): number {
  return Object.values(DIRECTIONS).filter((direction) => board.runLength(position, direction) === EXACT_THREE_LENGTH)
    .length;
}

/** 盤全体から、5 つ以上の連続がある駒の種類を探す。 */
function findWinner(board: Board): Piece | null {
  for (let row = 1; row <= BOARD_SIZE; row++) {
    for (let col = 1; col <= BOARD_SIZE; col++) {
      const position = { row, col };
      if (makesWinningLine(board, position)) {
        return board.pieceAt(position);
      }
    }
  }
  return null;
}

function opponentOf(piece: Piece): Piece {
  return piece === 'dog' ? 'cat' : 'dog';
}
