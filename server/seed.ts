import type Database from 'better-sqlite3';
import { profile as defaultProfile } from '../src/data/profile';
import { resume as defaultResume } from '../src/data/resume';
import { projects as defaultProjects } from '../src/data/projects';
import { games as defaultGames } from '../src/data/games';

export function seed(db: Database.Database): void {
  db.prepare(
    'INSERT INTO profile (name, title, bio, avatarUrl, socialLinks) VALUES (?, ?, ?, ?, ?)',
  ).run(
    defaultProfile.name,
    defaultProfile.title,
    defaultProfile.bio,
    defaultProfile.avatarUrl,
    JSON.stringify(defaultProfile.socialLinks),
  );

  db.prepare('INSERT INTO resume (id) VALUES (1)').run();

  const insertTimeline = db.prepare(
    'INSERT INTO timeline_entries (id, type, title, subtitle, date, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );

  defaultResume.education.forEach((entry, i) => {
    insertTimeline.run(entry.id, 'education', entry.title, entry.subtitle, entry.date, entry.description, i);
  });

  defaultResume.experience.forEach((entry, i) => {
    insertTimeline.run(entry.id, 'experience', entry.title, entry.subtitle, entry.date, entry.description, i);
  });

  const insertSkill = db.prepare('INSERT INTO skills (name, level, sort_order) VALUES (?, ?, ?)');
  defaultResume.skills.forEach((skill, i) => {
    insertSkill.run(skill.name, skill.level, i);
  });

  const insertProject = db.prepare(
    'INSERT INTO projects (id, name, description, techStack, imageUrl, githubUrl, liveUrl, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  );
  defaultProjects.forEach((proj, i) => {
    insertProject.run(
      proj.id, proj.name, proj.description, JSON.stringify(proj.techStack),
      proj.imageUrl, proj.githubUrl, proj.liveUrl ?? '', i,
    );
  });

  const insertGame = db.prepare(
    'INSERT INTO games (id, name, description, coverUrl, playUrl, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
  );
  defaultGames.forEach((game, i) => {
    insertGame.run(game.id, game.name, game.description, game.coverUrl, game.playUrl, i);
  });
}
