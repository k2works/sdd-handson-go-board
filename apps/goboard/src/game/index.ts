/**
 * GoBoard のルール（U1 盤と着手・U2 手番・U3 勝敗判定）。
 *
 * ルールの唯一の正解は docs/requirements/goboard/ルール定義.md であり、
 * ここにはそこに書かれたルールだけを実装する。React や DOM には依存しない。
 */
export { BOARD_SIZE, Board, DIRECTIONS } from './board';
export type { Cell, Direction, Piece, Placeability, Position } from './board';
export { Game, WIN_LENGTH } from './game';
export type { Outcome, PlayResult, RejectionReason } from './game';
