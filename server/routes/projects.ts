import { Router } from 'express';
import { getDb } from '../db';
import type { ProjectEntry } from '../../src/data/projects';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const rows = db.prepare(
    'SELECT id, name, description, techStack, imageUrl, githubUrl, liveUrl FROM projects ORDER BY sort_order',
  ).all() as (Omit<ProjectEntry, 'techStack'> & { techStack: string })[];
  const data: ProjectEntry[] = rows.map((row) => ({
    ...row,
    techStack: JSON.parse(row.techStack),
  }));
  res.json(data);
});

router.put('/', (req, res) => {
  const db = getDb();
  const body = req.body as ProjectEntry[];

  const replace = db.transaction(() => {
    db.prepare('DELETE FROM projects').run();
    const insert = db.prepare(
      'INSERT INTO projects (id, name, description, techStack, imageUrl, githubUrl, liveUrl, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    );
    body.forEach((proj, i) => {
      insert.run(
        proj.id, proj.name, proj.description, JSON.stringify(proj.techStack),
        proj.imageUrl, proj.githubUrl, proj.liveUrl ?? '', i,
      );
    });
  });

  replace();
  res.json(body);
});

export default router;
