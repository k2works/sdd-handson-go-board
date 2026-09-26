import { World, setWorldConstructor, type IWorldOptions } from '@cucumber/cucumber';
import type { Page } from 'playwright';
import { BoardPage } from './board-page';

/** シナリオごとの状態。ブラウザのページと、盤の画面を操作するページオブジェクトを持つ。 */
export class GoBoardWorld extends World {
  page!: Page;
  baseUrl!: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  get board(): BoardPage {
    return new BoardPage(this.page, this.baseUrl);
  }
}

setWorldConstructor(GoBoardWorld);
