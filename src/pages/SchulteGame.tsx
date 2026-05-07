import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

type Difficulty = { rows: number; cols: number; label: string };

const DIFFICULTIES: Difficulty[] = [
  { rows: 3, cols: 3, label: '3×3' },
  { rows: 5, cols: 5, label: '5×5' },
  { rows: 8, cols: 8, label: '8×8' },
];

// Generate varied hues to scatter across the grid for visual interference
const COLOR_POOL = [
  '#e5e5e5', '#cbd5e1', '#fcd34d', '#f87171', '#a78bfa',
  '#60a5fa', '#4ade80', '#fb923c', '#f472b6', '#67e8f9',
  '#fbbf24', '#34d399', '#818cf8', '#e879f9', '#fda4af',
];

function shuffleArray(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function assignColors(n: number): string[] {
  return Array.from({ length: n }, (_, i) => COLOR_POOL[i % COLOR_POOL.length]);
}

export function SchulteGame() {
  const { profile } = useData();
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[1]);

  useEffect(() => {
    document.title = `舒尔特方格 - ${profile.name}`;
  }, [profile.name]);
  const [numbers, setNumbers] = useState<number[]>(() => shuffleArray(25));
  const [colors, setColors] = useState<string[]>(() => assignColors(25));
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
    setColors(assignColors(n));
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

    if (!running) {
      setRunning(true);
      const start = Date.now();
      intervalRef.current = setInterval(() => {
        setTimer(Math.floor((Date.now() - start) / 100) / 10);
      }, 100);
    }

    if (num === currentTarget) {
      const nextClicked = new Set(clicked);
      nextClicked.add(num);
      setClicked(nextClicked);
      setErrorCell(null);

      if (num === total) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setFinished(true);
        setStage('done');
        setTimeout(() => setTimer((prev) => prev), 0);
      } else {
        setCurrentTarget((prev) => prev + 1);
      }
    } else if (num > currentTarget) {
      setErrorCell(num);
      setTimeout(() => setErrorCell(null), 300);
    }
  }, [currentTarget, clicked, running, finished, total]);

  const formatTime = (t: number) => {
    return t.toFixed(1) + 's';
  };

  // Select difficulty
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
            彩色数字增加干扰难度，训练注意力集中和视觉搜索速度。
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

  // Finished
  if (stage === 'done') {
    return (
      <div className="game-page">
        <div className="game-header">
          <Link to="/" className="game-back">← 返回</Link>
          <h1>舒尔特方格</h1>
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
  const foundCount = currentTarget - 1;

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="game-back">← 返回</Link>
        <h1>舒尔特方格</h1>
        <span className="game-score">{formatTime(timer)}</span>
        <span className="schulte-progress">已找到 {foundCount} / {total}</span>
      </div>

      <div className="schulte-progress-bar">
        <div className="schulte-progress-fill" style={{ width: `${(foundCount / total) * 100}%` }} />
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
          if (errorCell === num) cls += ' error';

          return (
            <button
              key={num}
              className={cls}
              style={clicked.has(num) ? undefined : { color: colors[num - 1] }}
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
    </div>
  );
}
