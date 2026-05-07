import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const GRID = 20;
const COLS = 30;
const ROWS = 20;
const SPEED = 120;

type Point = { x: number; y: number };

function createFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

export function SnakeGame() {
  const { profile } = useData();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.title = `贪吃蛇 - ${profile.name}`;
  }, [profile.name]);
  const snakeRef = useRef<Point[]>([{ x: 15, y: 10 }]);
  const foodRef = useRef<Point>({ x: 20, y: 10 });
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const loopRef = useRef(0);

  const reset = useCallback(() => {
    snakeRef.current = [{ x: 15, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = createFood(snakeRef.current);
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = COLS * GRID;
    canvas.height = ROWS * GRID;

    const draw = () => {
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Food
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * GRID + GRID / 2,
        foodRef.current.y * GRID + GRID / 2,
        GRID / 2 - 1,
        0, Math.PI * 2,
      );
      ctx.fill();

      // Snake
      const snake = snakeRef.current;
      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
        ctx.fillRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2);
      });
    };

    const tick = () => {
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const newHead: Point = {
        x: head.x + dirRef.current.x,
        y: head.y + dirRef.current.y,
      };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
        setGameOver(true);
        setStarted(false);
        return;
      }

      // Self collision
      if (snakeRef.current.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setGameOver(true);
        setStarted(false);
        return;
      }

      snakeRef.current.unshift(newHead);

      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        scoreRef.current += 10;
        setScore(scoreRef.current);
        foodRef.current = createFood(snakeRef.current);
      } else {
        snakeRef.current.pop();
      }

      draw();
      loopRef.current = setTimeout(tick, SPEED);
    };

    if (started && !gameOver) {
      loopRef.current = setTimeout(tick, SPEED);
    }
    draw();

    return () => clearTimeout(loopRef.current);
  }, [started, gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const d = nextDirRef.current;
      switch (e.key) {
        case 'ArrowUp': if (d.y !== 1) nextDirRef.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (d.y !== -1) nextDirRef.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (d.x !== 1) nextDirRef.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (d.x !== -1) nextDirRef.current = { x: 1, y: 0 }; break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="game-back">← 返回</Link>
        <h1>贪吃蛇</h1>
        <span className="game-score">分数: {score}</span>
      </div>
      <div className="game-canvas-wrap">
        <canvas ref={canvasRef} className="game-canvas" />
        {!started && (
          <div className="game-overlay">
            {gameOver ? (
              <>
                <p className="game-over-text">游戏结束</p>
                <p className="game-over-score">得分: {score}</p>
              </>
            ) : (
              <p className="game-over-text">贪吃蛇</p>
            )}
            <button className="btn-primary" onClick={reset}>
              {gameOver ? '再来一局' : '开始游戏'}
            </button>
            <p className="game-hint">方向键控制移动</p>
          </div>
        )}
      </div>
    </div>
  );
}
