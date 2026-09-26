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

describe('手番を表示し、交互に置く（S05・S09・R4・R5）', () => {
  it('開いた直後は「犬の手番」と表示される', () => {
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('犬の手番');
  });

  it('犬が置くと「猫の手番」と表示される', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '8 行 8 列 空き' }));

    expect(screen.getByRole('status')).toHaveTextContent('猫の手番');
  });

  it('猫の手番にクリックすると猫の駒（🐱）が置かれ、「犬の手番」に戻る', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '8 行 8 列 空き' }));
    await user.click(screen.getByRole('button', { name: '9 行 9 列 空き' }));

    expect(screen.getByRole('button', { name: '9 行 9 列 猫' })).toHaveTextContent('🐱');
    expect(screen.getByRole('status')).toHaveTextContent('犬の手番');
  });

  it('手番を相手に渡す操作（パス）は表示されない', () => {
    render(<App />);

    expect(screen.queryByRole('button', { name: /パス|手番を渡す/ })).not.toBeInTheDocument();
  });
});

describe('駒のあるマスをクリックしても置けない（S03・S09・R5・R6）', () => {
  it('駒は変わらず、置けない理由が表示され、手番は猫のまま', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '3 行 4 列 空き' }));

    await user.click(screen.getByRole('button', { name: '3 行 4 列 犬' }));

    expect(screen.getByRole('button', { name: '3 行 4 列 犬' })).toHaveTextContent('🐶');
    expect(screen.getByRole('alert')).toHaveTextContent('そのマスにはすでに駒があるため置けません');
    expect(screen.getByRole('status')).toHaveTextContent('猫の手番');
  });

  it('次に置けたら、置けない理由の表示は消える', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '3 行 4 列 空き' }));
    await user.click(screen.getByRole('button', { name: '3 行 4 列 犬' }));

    await user.click(screen.getByRole('button', { name: '9 行 9 列 空き' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
