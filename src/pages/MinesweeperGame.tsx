import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

type Difficulty = {
  rows: number;
  cols: number;
  mines: number;
  label: string;
};

const DIFFICULTIES: Difficulty[] = [
  { rows: 9, cols: 9, mines: 10, label: '初级 9×9' },
  { rows: 16, cols: 16, mines: 40, label: '中级 16×16' },
  { rows: 16, cols: 30, mines: 99, label: '高级 16×30' },
];

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number;
};

function createBoard(rows: number, cols: number, mines: number): Cell[][] {
  const total = rows * cols;
  const mineSet = new Set<number>();
  while (mineSet.size < mines) {
    mineSet.add(Math.floor(Math.random() * total));
  }

  const board: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    board.push([]);
    for (let c = 0; c < cols; c++) {
      board[r].push({
        mine: mineSet.has(r * cols + c),
        revealed: false,
        flagged: false,
        count: 0,
      });
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
            count++;
          }
        }
      }
      board[r][c].count = count;
    }
  }

  return board;
}

function neighbors(r: number, c: number, rows: number, cols: number): [number, number][] {
  const result: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        result.push([nr, nc]);
      }
    }
  }
  return result;
}

const NUMBER_COLORS = [
  '', '#60a5fa', '#4ade80', '#f472b6', '#c084fc',
  '#fb923c', '#facc15', '#f87171', '#a78bfa',
];

export function MinesweeperGame() {
  const { profile } = useData();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'select' | 'playing' | 'won' | 'lost'>('select');
  const [flagCount, setFlagCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const timerRef = useRef(0);
  const startTimeRef = useRef(0);
  const btnRef = useRef({ left: false, right: false });
  const configRef = useRef({ rows: 9, cols: 9, mines: 10 });

  useEffect(() => {
    document.title = `扫雷 - ${profile.name}`;
  }, [profile.name]);

  useEffect(() => {
    if (gameState === 'playing') {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

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

  const startGame = useCallback((diff: Difficulty) => {
    configRef.current = { rows: diff.rows, cols: diff.cols, mines: diff.mines };
    setDifficulty(diff);
    setBoard(createBoard(diff.rows, diff.cols, diff.mines));
    setGameState('playing');
    setFlagCount(0);
    setElapsed(0);
    setHighlighted(new Set());
    clearInterval(timerRef.current);
  }, []);

  const handleCellDown = useCallback((r: number, c: number, e: React.MouseEvent) => {
    if (gameState !== 'playing') return;

    if (e.button === 0) btnRef.current.left = true;
    if (e.button === 2) btnRef.current.right = true;

    const boardNow = board;
    const cell = boardNow[r][c];

    if (btnRef.current.left && btnRef.current.right && cell.revealed && cell.count > 0) {
      e.preventDefault();
      const { rows, cols } = configRef.current;
      const surrounding = neighbors(r, c, rows, cols);
      const flagCountAround = surrounding.filter(([nr, nc]) => boardNow[nr][nc].flagged).length;

      if (flagCountAround === cell.count) {
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

  const reveal = useCallback((r: number, c: number) => {
    const { rows, cols, mines } = configRef.current;
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
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !next[nr][nc].revealed) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }

      const unrevealed = next.flat().filter((cell) => !cell.revealed).length;
      if (unrevealed === mines) {
        setGameState('won');
      }

      return next;
    });
  }, []);

  const chordReveal = useCallback((r: number, c: number) => {
    const { rows, cols, mines } = configRef.current;
    setBoard((prev) => {
      const cell = prev[r][c];
      if (!cell.revealed || cell.count === 0) return prev;

      const surrounding = neighbors(r, c, rows, cols);
      const flagsAround = surrounding.filter(([nr, nc]) => prev[nr][nc].flagged).length;

      if (flagsAround !== cell.count) return prev;

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
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !next[nr][nc].revealed) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }

      const unrevealed = next.flat().filter((cell) => !cell.revealed).length;
      if (unrevealed === mines) {
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

  const handleCellUp = useCallback((r: number, c: number, e: React.MouseEvent) => {
    if (gameState !== 'playing') return;

    const boardNow = board;
    const cell = boardNow[r][c];

    if (e.button === 0 && !btnRef.current.right) {
      reveal(r, c);
      btnRef.current.left = false;
      return;
    }

    if (e.button === 2 && !btnRef.current.left) {
      toggleFlag(r, c);
      btnRef.current.right = false;
      return;
    }

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
  }, [gameState, board, reveal, toggleFlag, chordReveal]);

  // Select difficulty
  if (gameState === 'select') {
    return (
      <div className="game-page">
        <div className="game-header">
          <Link to="/?tab=games" className="game-back">← 返回</Link>
          <h1>扫雷</h1>
        </div>
        <div className="schulte-select">
          <p className="schulte-desc">
            经典扫雷游戏。左键翻开格子，右键标记地雷，找出所有地雷即可获胜。支持双键齐按快速翻开周围格子。
          </p>
          <h3>选择难度</h3>
          <div className="schulte-difficulties">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.label}
                className="btn-primary"
                onClick={() => startGame(d)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { rows, cols, mines } = configRef.current;

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/?tab=games" className="game-back">← 返回</Link>
        <h1>扫雷</h1>
        <span className="game-score">💣 {mines - flagCount}</span>
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
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="game-result">
          <p className="game-over-text">{gameState === 'won' ? '🎉 你赢了！' : '💥 踩到雷了！'}</p>
          <div className="schulte-actions">
            <button className="btn-primary" onClick={() => startGame(difficulty!)}>再来一局</button>
            <button className="btn-sm" onClick={() => setGameState('select')}>选择难度</button>
          </div>
        </div>
      )}
      <p className="game-hint" style={{ marginTop: 16 }}>左键翻开 | 右键插旗 | 双键齐按 = 快速翻开周围</p>
    </div>
  );
}
