import express from 'express';
import profileRouter from './routes/profile';
import resumeRouter from './routes/resume';
import projectsRouter from './routes/projects';
import gamesRouter from './routes/games';
import newsRouter from './routes/news';
const app = express();
app.use(express.json());

app.use('/api/profile', profileRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/games', gamesRouter);
app.use('/api/news', newsRouter);

// Only start listening if this is the main module (not imported by tests)
const isTestEnv = process.env.VITEST || process.env.NODE_ENV === 'test';
if (!isTestEnv) {
  const PORT = process.env.PORT ?? 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
