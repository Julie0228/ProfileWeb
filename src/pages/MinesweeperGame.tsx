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

function neighbors(r: number, c: number): [number, number][] {
  const result: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        result.push([nr, nc]);
      }
    }
  }
  return result;
}

export function MinesweeperGame() {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const timerRef = useRef(0);
  const btnRef = useRef({ left: false, right: false });

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, startTime]);

  // Track mouse button state globally
  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (e.button === 0) btnRef.current.left = true;
      if (e.button === 2) btnRef.current.right = true;
    };
    const up = (e: MouseEvent) => {
      if (e.button === 0) btnRef.current.left = false;
      if (e.button === 2) btnRef.current.right = false;
      setHighlighted(new Set());
    };
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  const handleCellDown = useCallback((r: number, c: number, e: React.MouseEvent) => {
    if (gameState !== 'playing') return;

    // Track this button press
    if (e.button === 0) btnRef.current.left = true;
    if (e.button === 2) btnRef.current.right = true;

    const boardNow = board;
    const cell = boardNow[r][c];

    // Chord: both buttons pressed on a revealed numbered cell
    if (btnRef.current.left && btnRef.current.right && cell.revealed && cell.count > 0) {
      e.preventDefault();
      const surrounding = neighbors(r, c);
      const flagCountAround = surrounding.filter(([nr, nc]) => boardNow[nr][nc].flagged).length;

      if (flagCountAround === cell.count) {
        // Highlight surrounding cells
        const hl = new Set<string>();
        surrounding.forEach(([nr, nc]) => {
          if (!boardNow[nr][nc].revealed && !boardNow[nr][nc].flagged) {
            hl.add(`${nr},${nc}`);
          }
        });
        setHighlighted(hl);
      }
    }
  }, [gameState, board]);

  const handleCellUp = useCallback((r: number, c: number, e: React.MouseEvent) => {
    if (gameState !== 'playing') return;

    const boardNow = board;
    const cell = boardNow[r][c];

    // Regular left click
    if (e.button === 0 && !btnRef.current.right) {
      reveal(r, c);
      btnRef.current.left = false;
      return;
    }

    // Regular right click (flag)
    if (e.button === 2 && !btnRef.current.left) {
      toggleFlag(r, c);
      btnRef.current.right = false;
      return;
    }

    // Chord release: both buttons on revealed numbered cell
    const bothPressed = (e.button === 0 && btnRef.current.right) || (e.button === 2 && btnRef.current.left);
    if (bothPressed && cell.revealed && cell.count > 0) {
      chordReveal(r, c);
      if (e.button === 0) btnRef.current.left = false;
      if (e.button === 2) btnRef.current.right = false;
      setHighlighted(new Set());
      return;
    }

    setHighlighted(new Set());
    if (e.button === 0) btnRef.current.left = false;
    if (e.button === 2) btnRef.current.right = false;
  }, [gameState, board]);

  const reveal = useCallback((r: number, c: number) => {
    setBoard((prev) => {
      if (prev[r][c].revealed || prev[r][c].flagged) return prev;
      if (prev[r][c].mine) {
        setGameState('lost');
        return prev.map((row) => row.map((cell) => ({ ...cell, revealed: cell.mine ? true : cell.revealed })));
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

      const unrevealed = next.flat().filter((cell) => !cell.revealed).length;
      if (unrevealed === MINES) {
        setGameState('won');
      }

      return next;
    });
  }, []);

  const chordReveal = useCallback((r: number, c: number) => {
    setBoard((prev) => {
      const cell = prev[r][c];
      if (!cell.revealed || cell.count === 0) return prev;

      const surrounding = neighbors(r, c);
      const flagsAround = surrounding.filter(([nr, nc]) => prev[nr][nc].flagged).length;

      if (flagsAround !== cell.count) return prev;

      // Check if any unflagged cell is a mine → game over
      const toReveal = surrounding.filter(([nr, nc]) => !prev[nr][nc].revealed && !prev[nr][nc].flagged);
      const hitMine = toReveal.some(([nr, nc]) => prev[nr][nc].mine);

      if (hitMine) {
        setGameState('lost');
        return prev.map((row) => row.map((cell) => ({ ...cell, revealed: cell.mine ? true : cell.revealed })));
      }

      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const stack = toReveal;

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

      const unrevealed = next.flat().filter((cell) => !cell.revealed).length;
      if (unrevealed === MINES) {
        setGameState('won');
      }

      return next;
    });
  }, []);

  const toggleFlag = useCallback((r: number, c: number) => {
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
    setHighlighted(new Set());
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
                className={
                  `ms-cell` +
                  (cell.revealed ? ' revealed' : '') +
                  (cell.mine && cell.revealed ? ' mine' : '') +
                  (cell.flagged ? ' flagged' : '') +
                  (highlighted.has(`${r},${c}`) ? ' chord-hover' : '')
                }
                onMouseDown={gameState === 'playing' ? (e) => handleCellDown(r, c, e) : undefined}
                onMouseUp={gameState === 'playing' ? (e) => handleCellUp(r, c, e) : undefined}
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
      <p className="game-hint" style={{ marginTop: 16 }}>左键翻开 | 右键插旗 | 双键齐按 = 快速翻开周围</p>
    </div>
  );
}
