import { Router } from 'express';
import { getDb } from '../db';
import type { ResumeData, TimelineEntry, Skill } from '../../src/data/resume';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();

  const eduRows = db.prepare(
    'SELECT id, title, subtitle, date, description FROM timeline_entries WHERE type = ? ORDER BY sort_order',
  ).all('education') as Omit<TimelineEntry, 'type'>[];

  const expRows = db.prepare(
    'SELECT id, title, subtitle, date, description FROM timeline_entries WHERE type = ? ORDER BY sort_order',
  ).all('experience') as Omit<TimelineEntry, 'type'>[];

  const skillRows = db.prepare(
    'SELECT name, level FROM skills ORDER BY sort_order',
  ).all() as Skill[];

  const data: ResumeData = {
    education: eduRows,
    experience: expRows,
    skills: skillRows,
  };
  res.json(data);
});

router.put('/', (req, res) => {
  const db = getDb();
  const body = req.body as ResumeData;

  const replaceTimeline = db.transaction(() => {
    db.prepare('DELETE FROM timeline_entries WHERE resume_id = 1').run();
    const insert = db.prepare(
      'INSERT INTO timeline_entries (id, type, title, subtitle, date, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
    );
    body.education.forEach((entry, i) => {
      insert.run(entry.id, 'education', entry.title, entry.subtitle, entry.date, entry.description, i);
    });
    body.experience.forEach((entry, i) => {
      insert.run(entry.id, 'experience', entry.title, entry.subtitle, entry.date, entry.description, i);
    });
  });

  const replaceSkills = db.transaction(() => {
    db.prepare('DELETE FROM skills WHERE resume_id = 1').run();
    const insert = db.prepare('INSERT INTO skills (name, level, sort_order) VALUES (?, ?, ?)');
    body.skills.forEach((skill, i) => {
      insert.run(skill.name, skill.level, i);
    });
  });

  replaceTimeline();
  replaceSkills();

  res.json(body);
});

export default router;
