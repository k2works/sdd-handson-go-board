import type { PieceName } from './board-page';
import type { GoBoardWorld } from './world';

/** 相手の手番を進めるための駒を置く行。シナリオで使う位置と重ならないよう、最下段を使う。 */
const FILLER_ROW = 15;

/**
 * 指定したプレイヤーの手番になるまで、相手の駒を最下段の空いているマスに置いて手番を進める。
 * 画面のクリックだけで盤を準備するため、ルールどおりに交互に置く必要がある。
 */
export async function ensureTurn(world: GoBoardWorld, piece: PieceName): Promise<void> {
  if ((await world.board.currentTurn()) === piece) {
    return;
  }
  for (let col = 1; col <= 15; col += 2) {
    const filler = world.board.cell(FILLER_ROW, col, '空き');
    if ((await filler.count()) === 1) {
      await filler.click();
      break;
    }
  }
  if ((await world.board.currentTurn()) !== piece) {
    throw new Error(`${piece}の手番にできません`);
  }
}
