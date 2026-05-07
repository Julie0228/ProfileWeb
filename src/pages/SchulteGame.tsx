import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

type Difficulty = { rows: number; cols: number; label: string };

const DIFFICULTIES: Difficulty[] = [
  { rows: 3, cols: 3, label: '3×3' },
  { rows: 5, cols: 5, label: '5×5' },
  { rows: 8, cols: 8, label: '8×8' },
];

function shuffleArray(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function SchulteGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[1]);
  const [numbers, setNumbers] = useState<number[]>(() => shuffleArray(25));
  const [currentTarget, setCurrentTarget] = useState(1);
  const [clicked, setClicked] = useState<Set<number>>(new Set());
  const [errorCell, setErrorCell] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [stage, setStage] = useState<'select' | 'playing' | 'done'>('select');
  const intervalRef = useRef(0);

  const total = difficulty.rows * difficulty.cols;

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    const n = diff.rows * diff.cols;
    setNumbers(shuffleArray(n));
    setCurrentTarget(1);
    setClicked(new Set());
    setErrorCell(null);
    setTimer(0);
    setRunning(false);
    setFinished(false);
    setStage('playing');
  };

  const handleClick = useCallback((num: number) => {
    if (finished) return;

    // Start timer on first click
    if (!running) {
      setRunning(true);
      const start = Date.now();
      intervalRef.current = setInterval(() => {
        setTimer(Math.floor((Date.now() - start) / 100) / 10);
      }, 100);
    }

    if (num === currentTarget) {
      // Correct
      const nextClicked = new Set(clicked);
      nextClicked.add(num);
      setClicked(nextClicked);
      setErrorCell(null);

      if (num === total) {
        // Finished
        clearInterval(intervalRef.current);
        setRunning(false);
        setFinished(true);
        setStage('done');
        setTimeout(() => setTimer((prev) => prev), 0);
      } else {
        setCurrentTarget((prev) => prev + 1);
      }
    } else if (num > currentTarget) {
      // Wrong — clicked a future number
      setErrorCell(num);
      setTimeout(() => setErrorCell(null), 300);
    }
    // If num < currentTarget, it's already been clicked — ignore
  }, [currentTarget, clicked, running, finished, total]);

  const formatTime = (t: number) => {
    return t.toFixed(1) + 's';
  };

  // Select difficulty screen
  if (stage === 'select') {
    return (
      <div className="game-page">
        <div className="game-header">
          <Link to="/" className="game-back">← 返回</Link>
          <h1>舒尔特方格</h1>
        </div>
        <div className="schulte-select">
          <p className="schulte-desc">
            按顺序依次点击数字 1 → {DIFFICULTIES[2].rows * DIFFICULTIES[2].cols}，越快越好。
            训练注意力集中和视觉搜索速度。
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

  // Finished screen
  if (stage === 'done') {
    return (
      <div className="game-page">
        <div className="game-header">
          <Link to="/" className="game-back">← 返回</Link>
          <h1>舒尔特方格</h1>
          <span className="game-score">{formatTime(timer)}</span>
        </div>
        <div className="schulte-done">
          <p className="game-over-text">完成！</p>
          <p className="schulte-result">
            {difficulty.label} · {formatTime(timer)}
          </p>
          <div className="schulte-actions">
            <button className="btn-primary" onClick={() => startGame(difficulty)}>再来一局</button>
            <button className="btn-sm" onClick={() => setStage('select')}>选择难度</button>
          </div>
        </div>
      </div>
    );
  }

  // Playing
  const progress = ((currentTarget - 1) / total) * 100;

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="game-back">← 返回</Link>
        <h1>舒尔特方格</h1>
        <span className="game-score">{formatTime(timer)}</span>
        <span className="schulte-progress">{currentTarget} / {total}</span>
      </div>

      <div className="schulte-progress-bar">
        <div className="schulte-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div
        className="schulte-grid"
        style={{
          gridTemplateColumns: `repeat(${difficulty.cols}, 1fr)`,
          gridTemplateRows: `repeat(${difficulty.rows}, 1fr)`,
        }}
      >
        {numbers.map((num) => {
          let cls = 'schulte-cell';
          if (clicked.has(num)) cls += ' done';
          else if (num === currentTarget) cls += ' target';
          if (errorCell === num) cls += ' error';

          return (
            <button
              key={num}
              className={cls}
              onClick={() => handleClick(num)}
            >
              {num}
            </button>
          );
        })}
      </div>

      <button
        className="btn-sm"
        style={{ marginTop: 24 }}
        onClick={() => setStage('select')}
      >
        换个难度
      </button>

      <p className="game-hint" style={{ marginTop: 12 }}>
        按顺序点击：1 → 2 → 3 → ... → {total}
      </p>
    </div>
  );
}
