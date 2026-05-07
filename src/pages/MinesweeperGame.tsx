import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const ROWS = 12;
const COLS = 16;
const MINES = 25;

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number;
};

function createBoard(): Cell[][] {
  // Place mines
  const mines = new Set<number>();
  while (mines.size < MINES) {
    mines.add(Math.floor(Math.random() * ROWS * COLS));
  }

  const board: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    board.push([]);
    for (let c = 0; c < COLS; c++) {
      board[r].push({
        mine: mines.has(r * COLS + c),
        revealed: false,
        flagged: false,
        count: 0,
      });
    }
  }

  // Count adjacent mines
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) {
            count++;
          }
        }
      }
      board[r][c].count = count;
    }
  }

  return board;
}

const NUMBER_COLORS = [
  '', '#60a5fa', '#4ade80', '#f472b6', '#c084fc',
  '#fb923c', '#facc15', '#f87171', '#a78bfa',
];

export function MinesweeperGame() {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(0);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, startTime]);

  const reveal = useCallback((r: number, c: number) => {
    setBoard((prev) => {
      if (prev[r][c].revealed || prev[r][c].flagged) return prev;
      if (prev[r][c].mine) {
        setGameState('lost');
        // Reveal all mines
        const next = prev.map((row) => row.map((cell) => ({ ...cell, revealed: cell.mine ? true : cell.revealed })));
        return next;
      }

      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const stack = [[r, c]];

      while (stack.length > 0) {
        const [cr, cc] = stack.pop()!;
        if (next[cr][cc].revealed || next[cr][cc].flagged) continue;
        next[cr][cc].revealed = true;

        if (next[cr][cc].count === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = cr + dr;
              const nc = cc + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !next[nr][nc].revealed) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }

      // Check win
      const unrevealed = next.flat().filter((cell) => !cell.revealed).length;
      if (unrevealed === MINES) {
        setGameState('won');
      }

      return next;
    });
  }, []);

  const toggleFlag = useCallback((r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    setBoard((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      if (next[r][c].revealed) return prev;
      next[r][c].flagged = !next[r][c].flagged;
      setFlagCount(next.flat().filter((cell) => cell.flagged).length);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setBoard(createBoard());
    setGameState('playing');
    setFlagCount(0);
  }, []);

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="game-back">← 返回</Link>
        <h1>扫雷</h1>
        <span className="game-score">💣 {MINES - flagCount}</span>
        <span className="game-score" style={{ color: 'var(--color-text-secondary)' }}>⏱ {elapsed}s</span>
      </div>
      <div className="minesweeper-board" onContextMenu={(e) => e.preventDefault()}>
        {board.map((row, r) => (
          <div key={r} className="ms-row">
            {row.map((cell, c) => (
              <button
                key={c}
                className={`ms-cell ${cell.revealed ? 'revealed' : ''} ${cell.mine && cell.revealed ? 'mine' : ''} ${cell.flagged ? 'flagged' : ''}`}
                onClick={gameState === 'playing' ? () => reveal(r, c) : undefined}
                onContextMenu={gameState === 'playing' ? (e) => toggleFlag(r, c, e) : undefined}
              >
                {cell.revealed && cell.mine && '💣'}
                {cell.revealed && !cell.mine && cell.count > 0 && (
                  <span style={{ color: NUMBER_COLORS[cell.count] }}>{cell.count}</span>
                )}
                {cell.flagged && !cell.revealed && '🚩'}
              </button>
            ))}
          </div>
        ))}
      </div>
      {gameState !== 'playing' && (
        <div className="game-result">
          <p className="game-over-text">{gameState === 'won' ? '🎉 你赢了！' : '💥 踩到雷了！'}</p>
          <button className="btn-primary" onClick={reset}>再来一局</button>
        </div>
      )}
      <p className="game-hint" style={{ marginTop: 16 }}>左键翻开 | 右键插旗</p>
    </div>
  );
}
