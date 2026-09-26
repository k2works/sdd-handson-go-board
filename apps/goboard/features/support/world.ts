import { World, setWorldConstructor, type IWorldOptions } from '@cucumber/cucumber';
import type { Page } from 'playwright';
import type { Game, Piece, PlayResult } from '../../src/game';
import { BoardPage, type PieceName } from './board-page';

/**
 * シナリオごとの状態。
 * 通常はブラウザのページで GoBoard を操作する。画面から操作できないルール（盤の外など）は、
 * 「対局中である」で game を用意し、ルール（Game）に対して直接検証する。
 */
export class GoBoardWorld extends World {
  page!: Page;
  baseUrl!: string;

  /** ルールに対して直接検証するときの対局。undefined ならブラウザで検証する。 */
  game?: Game;
  lastResult?: PlayResult;
  /** 置こうとしたプレイヤー（置く直前の手番）。 */
  playerBefore?: PieceName;
  /** 置こうとする直前の盤（ブラウザで検証するとき）。 */
  boardBefore?: string[];

  constructor(options: IWorldOptions) {
    super(options);
  }

  get board(): BoardPage {
    return new BoardPage(this.page, this.baseUrl);
  }
}

export function toPiece(name: PieceName): Piece {
  return name === '犬' ? 'dog' : 'cat';
}

export function toPieceName(piece: Piece): PieceName {
  return piece === 'dog' ? '犬' : '猫';
}

setWorldConstructor(GoBoardWorld);
