import type { GameEntry } from '../data/games';
import { GameCard } from '../components/GameCard';

interface GamesSectionProps {
  data: GameEntry[];
  isActive: boolean;
}

export function GamesSection({ data, isActive }: GamesSectionProps) {
  return (
    <section className={`section games-section section-fade ${isActive ? 'active' : ''}`}>
      <div className="container">
        <h2 className="section-title">游戏</h2>
        {data.length === 0 ? (
          <p className="projects-empty">暂无游戏</p>
        ) : (
          <div className="projects-grid">
            {data.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
