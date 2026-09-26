import { defineParameterType } from '@cucumber/cucumber';
import type { Position } from '../../src/game';
import type { PieceName } from './board-page';

/** 駒の種類（犬・猫）。例：「{piece}の手番である」 */
defineParameterType({
  name: 'piece',
  regexp: /犬|猫/,
  transformer: (name: string) => name as PieceName,
});

/** 「行,列」を「・」で区切った位置の並び。例：「8,6・8,7・6,8」 */
defineParameterType({
  name: 'positions',
  regexp: /\d+,\d+(?:・\d+,\d+)*/,
  transformer: (text: string): Position[] =>
    text.split('・').map((pair) => {
      const [row, col] = pair.split(',').map(Number);
      return { row: row!, col: col! };
    }),
});
