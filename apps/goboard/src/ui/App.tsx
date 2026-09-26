import { useState } from 'react';
import { Game, type Position } from '../game';
import { BoardView } from './BoardView';
import { pieceName, rejectionMessage } from './labels';

/**
 * GoBoard の画面（U4）のルート。
 * ルールの判断は src/game の Game に問い合わせ、ここでは行わない。
 */
export function App() {
  const [game, setGame] = useState(() => Game.start());
  const [message, setMessage] = useState<string | null>(null);

  const handleSelect = (position: Position) => {
    const result = game.play(position);
    setGame(result.game);
    setMessage(result.ok ? null : rejectionMessage(result.reason));
  };

  return (
    <main className="goboard">
      <h1>GoBoard</h1>
      <p role="status">{pieceName(game.turn)}の手番</p>
      {message && <p role="alert">{message}</p>}
      <BoardView board={game.board} onSelect={handleSelect} />
    </main>
  );
}
