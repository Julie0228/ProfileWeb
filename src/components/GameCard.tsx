import { Link } from 'react-router-dom';
import type { GameEntry } from '../data/games';

interface GameCardProps {
  game: GameEntry;
}

export function GameCard({ game }: GameCardProps) {
  const coverSrc = game.coverUrl || '/project-placeholder.svg';

  return (
    <Link to={game.playUrl} className="game-card">
      <img
        src={coverSrc}
        alt={game.name}
        className="game-card-image"
        loading="lazy"
        width={400}
        height={240}
      />
      <div className="game-card-body">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-desc">{game.description}</p>
        <span className="game-card-play">点击开始 →</span>
      </div>
    </Link>
  );
}
