import type { Cell, Piece, RejectionReason } from '../game';

/** 駒の種類の日本語名（ルール定義の用語）。 */
export function pieceName(piece: Piece): string {
  return piece === 'dog' ? '犬' : '猫';
}

/** マスの表示（ルール定義「表示」）。 */
export function cellSymbol(cell: Cell): string {
  switch (cell) {
    case 'dog':
      return '🐶';
    case 'cat':
      return '🐱';
    case null:
      return '・';
  }
}

/** マスの状態の読み上げ名。 */
export function cellName(cell: Cell): string {
  return cell === null ? '空き' : pieceName(cell);
}

/** 置けなかった理由の表示。 */
export function rejectionMessage(reason: RejectionReason): string {
  switch (reason) {
    case 'occupied':
      return 'そのマスにはすでに駒があるため置けません';
    case 'outside':
      return '盤の外には置けません';
    case 'finished':
      return 'ゲームは終わっているため置けません';
  }
}
