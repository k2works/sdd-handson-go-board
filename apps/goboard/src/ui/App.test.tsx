import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('GoBoard の画面を開く（S01）', () => {
  it('盤の上に「GoBoard」という名前が表示される', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'GoBoard' })).toBeInTheDocument();
  });

  it('縦 15 行 × 横 15 列、225 マスすべてが空いているマス（・）で表示される', () => {
    render(<App />);

    const board = screen.getByRole('grid', { name: '盤' });
    const rows = within(board).getAllByRole('row');
    expect(rows).toHaveLength(15);
    for (const row of rows) {
      expect(within(row).getAllByRole('button')).toHaveLength(15);
    }

    const cells = within(board).getAllByRole('button');
    expect(cells).toHaveLength(225);
    for (const cell of cells) {
      expect(cell).toHaveTextContent('・');
    }
  });

  it('各マスは行・列と状態が分かる名前を持つ', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: '1 行 1 列 空き' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '15 行 15 列 空き' })).toBeInTheDocument();
  });
});

describe('マスをクリックして駒を置く（S09）', () => {
  it('8 行 8 列の空いているマスをクリックすると、そのマスに犬の駒（🐶）が表示される', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '8 行 8 列 空き' }));

    const cell = screen.getByRole('button', { name: '8 行 8 列 犬' });
    expect(cell).toHaveTextContent('🐶');
  });

  it('クリックしたマス以外は空いているマスのまま表示される', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '8 行 8 列 空き' }));

    expect(screen.getAllByRole('button', { name: /空き$/ })).toHaveLength(224);
  });
});
