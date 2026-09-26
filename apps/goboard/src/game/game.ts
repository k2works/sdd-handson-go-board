import { Board, type Piece, type Placeability, type Position } from './board';

/** 置けなかった理由。 */
export type RejectionReason = Exclude<Placeability, 'ok'>;

/** 駒を置こうとした結果。置けなかったときは、置こうとする前の対局と理由を返す。 */
export type PlayResult =
  | { readonly ok: true; readonly game: Game }
  | { readonly ok: false; readonly game: Game; readonly reason: RejectionReason };

/** 対局（U2）。盤と手番を持ち、手番のプレイヤーの駒を置くたびに手番を交代する。 */
export class Game {
  private constructor(
    readonly board: Board,
    readonly turn: Piece,
  ) {}

  /** 空の盤と、先手の犬の手番で対局を始める（R4）。 */
  static start(): Game {
    return new Game(Board.empty(), 'dog');
  }

  /**
   * 手番のプレイヤーの駒を置く（R5）。置けたら手番を相手に渡す（R4）。
   * 置けなければ、盤も手番も変えずに理由を返す（パスにはならない）。
   */
  play(position: Position): PlayResult {
    const placeability = this.board.placeability(position);
    if (placeability !== 'ok') {
      return { ok: false, game: this, reason: placeability };
    }
    return { ok: true, game: new Game(this.board.place(position, this.turn), opponentOf(this.turn)) };
  }
}

function opponentOf(piece: Piece): Piece {
  return piece === 'dog' ? 'cat' : 'dog';
}
