import { defineParameterType } from '@cucumber/cucumber';
import type { PieceName } from './board-page';

/** 駒の種類（犬・猫）。例：「{piece}の手番である」 */
defineParameterType({
  name: 'piece',
  regexp: /犬|猫/,
  transformer: (name: string) => name as PieceName,
});
