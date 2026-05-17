import { Router } from 'express';
import { getDb } from '../db';
import type { ProfileData } from '../../src/data/profile';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT name, title, bio, avatarUrl, socialLinks FROM profile WHERE id = 1').get() as {
    name: string; title: string; bio: string; avatarUrl: string; socialLinks: string;
  };
  const data: ProfileData = {
    ...row,
    socialLinks: JSON.parse(row.socialLinks),
  };
  res.json(data);
});

router.put('/', (req, res) => {
  const db = getDb();
  const body = req.body as ProfileData;
  db.prepare(
    'UPDATE profile SET name = ?, title = ?, bio = ?, avatarUrl = ?, socialLinks = ? WHERE id = 1',
  ).run(body.name, body.title, body.bio, body.avatarUrl, JSON.stringify(body.socialLinks));
  res.json(body);
});

export default router;
