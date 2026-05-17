import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const LANE_COUNT = 3;
const INITIAL_SPEED = 5;
const SPEED_INCREMENT = 0.6;
const SPEED_INTERVAL = 10000;
const OBSTACLE_INTERVAL_MIN = 700;
const OBSTACLE_INTERVAL_MAX = 1500;
const COIN_INTERVAL = 1800;
const JUMP_DURATION = 450;
const SLIDE_DURATION = 400;
const PLAYER_CX = 20;
const PLAYER_CY = 30;
const OBSTACLE_H = 26;
const OBSTACLE_W_RATIO = 0.75;
const COIN_R = 12;

type ObstacleType = 'jump' | 'slide';
type PlayerAction = 'running' | 'jumping' | 'sliding';
type GamePhase = 'select' | 'playing' | 'done';

interface Obstacle {
  type: ObstacleType;
  lane: number;
  y: number;
}

interface CoinItem {
  lane: number;
  y: number;
  collected?: boolean;
}

interface GameState {
  playerLane: number;
  playerAction: PlayerAction;
  playerActionTimer: number;
  obstacles: Obstacle[];
  coins: CoinItem[];
  speed: number;
  distance: number;
  coinCount: number;
  roadOffset: number;
  lastObstacleTime: number;
  lastCoinTime: number;
  animFrame: number;
}

function createInitialState(): GameState {
  return {
    playerLane: 1,
    playerAction: 'running',
    playerActionTimer: 0,
    obstacles: [],
    coins: [],
    speed: INITIAL_SPEED,
    distance: 0,
    coinCount: 0,
    roadOffset: 0,
    lastObstacleTime: 0,
    lastCoinTime: 0,
    animFrame: 0,
  };
}

export function RunnerGame() {
  const { profile } = useData();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(createInitialState());
  const rafRef = useRef(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef(0);
  const [phase, setPhase] = useState<GamePhase>('select');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    document.title = `跑酷 - ${profile.name}`;
  }, [profile.name]);

  // Shared action handler — fires once per keypress/touch, not per frame
  const doAction = useCallback((action: 'left' | 'right' | 'jump' | 'slide') => {
    const g = gameRef.current;
    if (phase !== 'playing') return;

    if (action === 'left') {
      if (g.playerAction === 'running' && g.playerLane > 0) {
        g.playerLane--;
      }
    } else if (action === 'right') {
      if (g.playerAction === 'running' && g.playerLane < LANE_COUNT - 1) {
        g.playerLane++;
      }
    } else if (action === 'jump') {
      if (g.playerAction === 'running') {
        g.playerAction = 'jumping';
        g.playerActionTimer = JUMP_DURATION;
      }
    } else if (action === 'slide') {
      if (g.playerAction === 'running') {
        g.playerAction = 'sliding';
        g.playerActionTimer = SLIDE_DURATION;
      }
    }
  }, [phase]);

  // Keyboard — event-driven, fires once per keydown
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowleft': case 'a': e.preventDefault(); doAction('left'); break;
        case 'arrowright': case 'd': e.preventDefault(); doAction('right'); break;
        case 'arrowup': case 'w': case ' ': e.preventDefault(); doAction('jump'); break;
        case 'arrowdown': case 's': e.preventDefault(); doAction('slide'); break;
      }
    };
    window.addEventListener('keydown', onDown);
    return () => window.removeEventListener('keydown', onDown);
  }, [doAction]);

  // Touch — event-driven, fires once per swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    touchRef.current = null;

    if (Math.max(absDx, absDy) < 20) return;

    if (absDy > absDx) {
      if (dy < -20) doAction('jump');
      else if (dy > 20) doAction('slide');
    } else {
      if (dx > 20) doAction('right');
      else if (dx < -20) doAction('left');
    }
  }, [doAction]);

  const startGame = useCallback(() => {
    gameRef.current = createInitialState();
    lastTimeRef.current = 0;
    setScore(0);
    setCoins(0);
    setPhase('playing');
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const w = Math.min(container.clientWidth, 420);
      const h = Math.min(window.innerHeight - 80, w * 1.8);
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      let dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Clamp dt to avoid huge jumps
      if (dt > 200) dt = 16;
      const speedMs = gameRef.current.speed / 16;
      const elapsed = dt * speedMs;

      const g = gameRef.current;
      const cw = canvas.width;
      const ch = canvas.height;
      const laneW = cw / LANE_COUNT;

      // Update action timer
      if (g.playerAction !== 'running') {
        g.playerActionTimer -= dt;
        if (g.playerActionTimer <= 0) {
          g.playerAction = 'running';
          g.playerActionTimer = 0;
        }
      }

      // Spawn obstacles
      const obsInterval = OBSTACLE_INTERVAL_MAX - (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) * ((g.speed - INITIAL_SPEED) / (INITIAL_SPEED * 3));
      const clampedObsInterval = Math.max(OBSTACLE_INTERVAL_MIN, Math.min(OBSTACLE_INTERVAL_MAX, obsInterval));
      if (timestamp - g.lastObstacleTime > clampedObsInterval) {
        g.lastObstacleTime = timestamp;
        // Pick 1-2 lanes for obstacles, ensuring at least one lane is clear
        const obsLanes: number[] = [];
        const lanePool = [0, 1, 2];
        const count = Math.random() < 0.4 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * lanePool.length);
          obsLanes.push(lanePool.splice(idx, 1)[0]);
        }
        obsLanes.forEach((lane) => {
          g.obstacles.push({
            type: Math.random() < 0.55 ? 'jump' : 'slide',
            lane,
            y: -OBSTACLE_H,
          });
        });
      }

      // Spawn coins
      if (timestamp - g.lastCoinTime > COIN_INTERVAL) {
        g.lastCoinTime = timestamp;
        const lane = Math.floor(Math.random() * LANE_COUNT);
        // Don't spawn coin on same lane as an obstacle that's near
        const hasObsNear = g.obstacles.some((o) => o.lane === lane && o.y < -OBSTACLE_H + 60);
        if (!hasObsNear) {
          g.coins.push({ lane, y: -COIN_R });
        }
      }

      // Move obstacles and coins
      g.obstacles.forEach((o) => { o.y += elapsed; });
      g.coins.forEach((c) => { c.y += elapsed; });

      // Remove off-screen
      g.obstacles = g.obstacles.filter((o) => o.y < ch + 50);
      g.coins = g.coins.filter((c) => c.y < ch + 50);

      // Collision: player
      const px = g.playerLane * laneW + laneW / 2;
      const py = ch - 90;
      const pw = PLAYER_CX * 2;
      let ph = PLAYER_CY * 2;

      if (g.playerAction === 'jumping') {
        // Player is higher up, so check jump obstacles
        // In jumping state, the player rises — we'll render them higher. Collision box shrinks / moves up.
      }
      if (g.playerAction === 'sliding') {
        ph = PLAYER_CY * 1.2; // shorter hitbox
      }

      // Check obstacle collisions
      for (const obs of g.obstacles) {
        const ox = obs.lane * laneW + laneW * (1 - OBSTACLE_W_RATIO) / 2;
        const ow = laneW * OBSTACLE_W_RATIO;
        const oy = obs.y;

        let playerTop = py - ph;
        const playerBot = py;
        const playerLeft = px - pw;
        const playerRight = px + pw;

        // Default: jump obstacle is a low wall, slide obstacle is a high beam
        let obsTop: number;
        let obsBot: number;

        if (obs.type === 'jump') {
          obsTop = oy;
          obsBot = oy + OBSTACLE_H;
        } else {
          // Slide obstacle: positioned high, with clearance below
          obsTop = oy;
          obsBot = oy + OBSTACLE_H;
        }

        // For jump obstacles: collision only if player is NOT jumping
        // For slide obstacles: collision only if player is NOT sliding
        if (obs.type === 'jump' && g.playerAction === 'jumping') continue;
        if (obs.type === 'slide' && g.playerAction === 'sliding') continue;

        // Adjust hitbox for jumping (player moves up)
        if (g.playerAction === 'jumping') {
          playerTop -= 30;
        } else {
          playerTop = py - ph;
        }

        if (
          playerRight > ox + 4 &&
          playerLeft < ox + ow - 4 &&
          playerBot > obsTop + 6 &&
          playerTop < obsBot - 6
        ) {
          // Game over
          cancelAnimationFrame(rafRef.current);
          setScore(Math.floor(g.distance / 10) + g.coinCount * 10);
          setCoins(g.coinCount);
          setPhase('done');
          return;
        }
      }

      // Check coin collection
      g.coins.forEach((c) => {
        const cx = c.lane * laneW + laneW / 2;
        const cy = c.y;
        const dist = Math.hypot(px - cx, py - cy);
        if (dist < COIN_R + pw) {
          c.collected = true;
          g.coinCount++;
        }
      });
      g.coins = g.coins.filter((c) => !c.collected);

      // Increase speed over time
      g.speed += (SPEED_INCREMENT * dt) / SPEED_INTERVAL;
      g.distance += elapsed;
      g.roadOffset = (g.roadOffset + elapsed) % 40;
      g.animFrame++;

      // Update score display periodically
      const displayScore = Math.floor(g.distance / 10) + g.coinCount * 10;
      setScore(displayScore);
      setCoins(g.coinCount);

      // ---- DRAW ----
      ctx.clearRect(0, 0, cw, ch);

      // Background
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, cw, ch);

      // Road
      ctx.fillStyle = '#141416';
      ctx.fillRect(0, 0, cw, ch);

      // Lane dividers (dashed)
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);
      for (let i = 1; i < LANE_COUNT; i++) {
        const lx = i * laneW;
        ctx.beginPath();
        ctx.moveTo(lx, -g.roadOffset);
        ctx.lineTo(lx, ch);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.lineWidth = 1;

      // Side kerbs
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(0, ch);
      ctx.moveTo(cw, 0); ctx.lineTo(cw, ch);
      ctx.stroke();
      ctx.lineWidth = 1;

      // Coins
      g.coins.forEach((c) => {
        const cx = c.lane * laneW + laneW / 2;
        const cy = c.y;
        // Glow
        const grad = ctx.createRadialGradient(cx, cy, COIN_R * 0.3, cx, cy, COIN_R * 1.6);
        grad.addColorStop(0, 'rgba(252, 211, 77, 0.4)');
        grad.addColorStop(1, 'rgba(252, 211, 77, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, COIN_R * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Coin body
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(cx, cy, COIN_R, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(cx - 2, cy - 3, COIN_R * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // $ symbol
        ctx.fillStyle = '#b45309';
        ctx.font = `bold ${COIN_R * 1.1}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', cx, cy);
      });

      // Obstacles
      g.obstacles.forEach((obs) => {
        const ox = obs.lane * laneW + laneW * (1 - OBSTACLE_W_RATIO) / 2;
        const ow = laneW * OBSTACLE_W_RATIO;
        const oy = obs.y;

        if (obs.type === 'jump') {
          // Low wall — jump over
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(ox + 2, oy, ow - 4, OBSTACLE_H);
          // Warning stripes on top
          ctx.fillStyle = '#fca5a5';
          const stripeW = ow / 6;
          for (let s = 0; s < 6; s += 2) {
            ctx.fillRect(ox + 2 + s * stripeW, oy, stripeW, 4);
          }
        } else {
          // High beam — slide under
          const beamY = oy;
          const beamH = OBSTACLE_H;
          // Pillars on sides
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(ox + 4, beamY + beamH, 6, 30);
          ctx.fillRect(ox + ow - 10, beamY + beamH, 6, 30);
          // Beam
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(ox + 2, beamY, ow - 4, beamH);
          // Warning
          ctx.fillStyle = '#fcd34d';
          const stripeW2 = ow / 6;
          for (let s = 0; s < 6; s += 2) {
            ctx.fillRect(ox + 2 + s * stripeW2, beamY, stripeW2, 3);
          }
        }
      });

      // Player
      const ppx = g.playerLane * laneW + laneW / 2;
      const ppy = ch - 90 + (g.playerAction === 'jumping' ? -(g.playerActionTimer / JUMP_DURATION) * 35 : 0);
      const pph = g.playerAction === 'sliding' ? PLAYER_CY * 1.2 : PLAYER_CY * 2;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(ppx, ch - 88, pw * 0.7, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.roundRect(ppx - PLAYER_CX, ppy - pph, PLAYER_CX * 2, pph, 6);
      ctx.fill();

      // Head
      const headR = PLAYER_CX * 0.7 + 2;
      const headY = ppy - pph - headR + 4;
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath();
      ctx.arc(ppx, headY, headR, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#0d0d0d';
      ctx.beginPath();
      ctx.arc(ppx - 5, headY - 1, 2.5, 0, Math.PI * 2);
      ctx.arc(ppx + 5, headY - 1, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Running legs animation
      if (g.playerAction === 'running') {
        const legPhase = Math.sin(g.animFrame * 0.3) * 8;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(ppx - 8, ppy - 10, 5, 12 + legPhase);
        ctx.fillRect(ppx + 3, ppy - 10, 5, 12 - legPhase);
      } else if (g.playerAction === 'jumping') {
        // Legs tucked
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(ppx - 7, ppy - 6, 5, 8);
        ctx.fillRect(ppx + 2, ppy - 6, 5, 8);
      } else {
        // Sliding — legs forward
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(ppx - 6, ppy - 4, 10, 6);
        ctx.fillRect(ppx + 4, ppy - 4, 10, 6);
      }

      // Speed indicator
      const speedMult = ((g.speed - INITIAL_SPEED) / INITIAL_SPEED + 1);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Speed ×${speedMult.toFixed(1)}`, cw - 12, 20);

      // Lane movement cooldown visual
      if (g.playerAction === 'running') {
        // Visual hint: slight glow on reachable lanes
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [phase]);

  // Select phase
  if (phase === 'select') {
    return (
      <div className="game-page">
        <div className="game-header">
          <Link to="/?tab=games" className="game-back">← 返回</Link>
          <h1>跑酷 Runner</h1>
        </div>
        <div className="schulte-select">
          <p className="schulte-desc">
            三条跑道上奔跑，躲避障碍物收集金币。
            ← → 换道，↑ / 空格 跳跃，↓ 蹲下。速度会越来越快！
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: -8 }}>
            手机端支持滑动手势
          </p>
          <button className="btn-primary" style={{ marginTop: 24 }} onClick={startGame}>
            开始游戏
          </button>
        </div>
      </div>
    );
  }

  // Done phase
  if (phase === 'done') {
    return (
      <div className="game-page">
        <div className="game-header">
          <Link to="/?tab=games" className="game-back">← 返回</Link>
          <h1>跑酷 Runner</h1>
        </div>
        <div className="schulte-done">
          <p className="game-over-text">游戏结束</p>
          <p className="schulte-result">
            得分 {score} · 🪙 {coins}
          </p>
          <div className="schulte-actions">
            <button className="btn-primary" onClick={startGame}>再来一局</button>
            <button className="btn-sm" onClick={() => setPhase('select')}>返回</button>
          </div>
        </div>
      </div>
    );
  }

  // Playing
  const speedMult = ((gameRef.current.speed - INITIAL_SPEED) / INITIAL_SPEED + 1);
  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/?tab=games" className="game-back">← 返回</Link>
        <h1>跑酷 Runner</h1>
        <span className="game-score">{score}</span>
        <span className="schulte-progress">
          ×{speedMult.toFixed(1)} 🪙{coins}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="runner-canvas"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ display: 'block' }}
      />
    </div>
  );
}
