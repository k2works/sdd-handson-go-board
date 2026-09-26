import { useState } from 'react';
import { Board, type Position } from '../game';
import { BoardView } from './BoardView';

/**
 * GoBoard の画面（U4）のルート。
 * ルールの判断は src/game に問い合わせ、ここでは行わない。
 */
export function App() {
  const [board, setBoard] = useState(() => Board.empty());

  // Bolt 1 には手番（U2）がないため、置く駒は常に犬とする。
  const handleSelect = (position: Position) => {
    setBoard((current) => current.place(position, 'dog'));
  };

  return (
    <main className="goboard">
      <h1>GoBoard</h1>
      <BoardView board={board} onSelect={handleSelect} />
    </main>
  );
}
