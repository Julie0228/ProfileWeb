import { useEffect, useRef } from 'react';

interface Star {
  ox: number;       // original x
  oy: number;       // original y
  cx: number;       // current x
  cy: number;       // current y
  r: number;        // radius
  opacity: number;  // base opacity
  phase: number;    // twinkle phase offset
  speed: number;    // twinkle speed
}

const STAR_COUNT = 100;
const REPEL_RADIUS = 130;
const REPEL_STRENGTH = 35;
const RETURN_SPEED = 0.06;

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const stars: Star[] = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          ox: Math.random() * canvas.width,
          oy: Math.random() * canvas.height,
          cx: 0,
          cy: 0,
          r: 0.4 + Math.random() * 1.2,
          opacity: 0.3 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.015,
        });
        stars[i].cx = stars[i].ox;
        stars[i].cy = stars[i].oy;
      }
      starsRef.current = stars;
    };

    const animate = (time: number) => {
      const stars = starsRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        // Repel from mouse
        const dx = star.cx - mx;
        const dy = star.cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 0.1) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * REPEL_STRENGTH;
          const pushY = Math.sin(angle) * force * REPEL_STRENGTH;
          star.cx += pushX;
          star.cy += pushY;
        }

        // Return to original position
        star.cx += (star.ox - star.cx) * RETURN_SPEED;
        star.cy += (star.oy - star.cy) * RETURN_SPEED;

        // Twinkle
        const twinkle = star.opacity + Math.sin(time * star.speed + star.phase) * 0.15;
        const alpha = Math.max(0.1, Math.min(1, twinkle));

        // Draw star
        ctx.beginPath();
        ctx.arc(star.cx, star.cy, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 220, 230, ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse, { passive: true });
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
