import type { Locator, Page } from 'playwright';

/** 駒の種類の日本語名（ルール定義の用語）。 */
export type PieceName = '犬' | '猫';

/**
 * 盤の画面を操作するページオブジェクト。
 * マスは「8 行 8 列 空き」のような読み上げ名を持つボタンとして探す。
 */
export class BoardPage {
  constructor(
    private readonly page: Page,
    private readonly baseUrl: string,
  ) {}

  async open(): Promise<void> {
    await this.page.goto(this.baseUrl);
    await this.grid().waitFor();
  }

  heading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  grid(): Locator {
    return this.page.getByRole('grid', { name: '盤' });
  }

  rows(): Locator {
    return this.grid().getByRole('row');
  }

  cells(): Locator {
    return this.grid().getByRole('button');
  }

  emptyCells(): Locator {
    return this.grid().getByRole('button', { name: /空き$/ });
  }

  occupiedCells(): Locator {
    return this.grid().getByRole('button', { name: /(犬|猫)$/ });
  }

  cell(row: number, col: number, state: PieceName | '空き'): Locator {
    return this.grid().getByRole('button', { name: `${row} 行 ${col} 列 ${state}`, exact: true });
  }

  async clickCell(row: number, col: number): Promise<void> {
    await this.grid().getByRole('button', { name: new RegExp(`^${row} 行 ${col} 列 `) }).click();
  }

  /** 対局の状態の表示（例：「犬の手番」「犬の勝ち」）。 */
  async statusText(): Promise<string> {
    return ((await this.page.getByRole('status').textContent()) ?? '').trim();
  }

  /** 手番の表示から手番のプレイヤーを読み取る。勝負がついていれば null。 */
  async turnIfOngoing(): Promise<PieceName | null> {
    const match = /^(犬|猫)の手番$/.exec(await this.statusText());
    return match ? (match[1] as PieceName) : null;
  }

  /** 手番の表示（例：「犬の手番」）から、手番のプレイヤーを読み取る。 */
  async currentTurn(): Promise<PieceName> {
    const turn = await this.turnIfOngoing();
    if (!turn) {
      throw new Error(`手番の表示を読み取れません: "${await this.statusText()}"`);
    }
    return turn;
  }

  alert(): Locator {
    return this.page.getByRole('alert');
  }

  passButtons(): Locator {
    return this.page.getByRole('button', { name: /パス|手番を渡す/ });
  }

  /** 盤のすべてのマスの読み上げ名（盤の状態のスナップショット）。 */
  async snapshot(): Promise<string[]> {
    return this.cells().evaluateAll((buttons) => buttons.map((b) => b.getAttribute('aria-label') ?? ''));
  }
}
