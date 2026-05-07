import { SocialLink } from '../data/profile';

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="social-links">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={link.platform}
        >
          <span className="social-link-icon">{link.icon}</span>
          <span className="social-link-label">{link.platform}</span>
        </a>
      ))}
    </div>
  );
}
