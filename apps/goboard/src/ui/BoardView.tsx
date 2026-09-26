import { BOARD_SIZE, type Board, type Cell } from '../game';
import './BoardView.css';

type Props = {
  board: Board;
};

const LINES = Array.from({ length: BOARD_SIZE }, (_, i) => i + 1);

/** 盤を 15 × 15 のマス目として表示する。 */
export function BoardView({ board }: Props) {
  return (
    <div role="grid" aria-label="盤" className="board">
      {LINES.map((row) => (
        <div role="row" key={row} className="board-row">
          {LINES.map((col) => {
            const cell = board.pieceAt({ row, col });
            return (
              <div role="gridcell" key={col}>
                <button type="button" className="cell" aria-label={`${row} 行 ${col} 列 ${cellName(cell)}`}>
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

/** マスの表示（ルール定義「表示」）。 */
function cellSymbol(cell: Cell): string {
  switch (cell) {
    case 'dog':
      return '🐶';
    case 'cat':
      return '🐱';
    case null:
      return '・';
  }
}

/** マスの状態の読み上げ名。 */
function cellName(cell: Cell): string {
  switch (cell) {
    case 'dog':
      return '犬';
    case 'cat':
      return '猫';
    case null:
      return '空き';
  }
}
