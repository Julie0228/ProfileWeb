import type { TimelineEntry } from '../data/resume';

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) {
    return <p className="timeline-empty">暂无数据</p>;
  }

  return (
    <div className="timeline">
      {entries.map((entry) => (
        <div key={entry.id} className="timeline-item">
          <div className="timeline-rail">
            <div className="timeline-dot" />
          </div>
          <div className="timeline-content">
            <span className="timeline-date">{entry.date}</span>
            <h3 className="timeline-title">{entry.title}</h3>
            <p className="timeline-subtitle">{entry.subtitle}</p>
            <p className="timeline-desc">{entry.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
