import { Router } from 'express';
import { getDb } from '../db';
import type { GameEntry } from '../../src/data/games';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const data = db.prepare(
    'SELECT id, name, description, coverUrl, playUrl FROM games ORDER BY sort_order',
  ).all() as GameEntry[];
  res.json(data);
});

router.put('/', (req, res) => {
  const db = getDb();
  const body = req.body as GameEntry[];

  const replace = db.transaction(() => {
    db.prepare('DELETE FROM games').run();
    const insert = db.prepare(
      'INSERT INTO games (id, name, description, coverUrl, playUrl, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
    );
    body.forEach((game, i) => {
      insert.run(game.id, game.name, game.description, game.coverUrl, game.playUrl, i);
    });
  });

  replace();
  res.json(body);
});

export default router;
