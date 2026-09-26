import { useState } from 'react';
import { Board } from '../game';
import { BoardView } from './BoardView';

/**
 * GoBoard の画面（U4）のルート。
 * ルールの判断は src/game に問い合わせ、ここでは行わない。
 */
export function App() {
  const [board] = useState(() => Board.empty());

  return (
    <main className="goboard">
      <h1>GoBoard</h1>
      <BoardView board={board} />
    </main>
  );
}
