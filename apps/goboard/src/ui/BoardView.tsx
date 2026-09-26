import { BOARD_SIZE, type Board, type Position } from '../game';
import './BoardView.css';
import { cellName, cellSymbol } from './labels';

type Props = {
  board: Board;
  /** マスが選ばれたときに呼ばれる。 */
  onSelect: (position: Position) => void;
};

const LINES = Array.from({ length: BOARD_SIZE }, (_, i) => i + 1);

/** 盤を 15 × 15 のマス目として表示する。 */
export function BoardView({ board, onSelect }: Props) {
  return (
    <div role="grid" aria-label="盤" className="board">
      {LINES.map((row) => (
        <div role="row" key={row} className="board-row">
          {LINES.map((col) => {
            const cell = board.pieceAt({ row, col });
            return (
              <div role="gridcell" key={col}>
                <button
                  type="button"
                  className="cell"
                  aria-label={`${row} 行 ${col} 列 ${cellName(cell)}`}
                  onClick={() => onSelect({ row, col })}
                >
                  {cellSymbol(cell)}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
