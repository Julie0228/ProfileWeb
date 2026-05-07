import type { ProfileData } from '../data/profile';
import { Avatar } from '../components/Avatar';
import { SocialLinks } from '../components/SocialLinks';

interface HomeSectionProps {
  data: ProfileData;
  isActive: boolean;
}

export function HomeSection({ data, isActive }: HomeSectionProps) {
  return (
    <section className={`section home-section section-fade ${isActive ? 'active' : ''}`}>
      <div className="home-content">
        <Avatar src={data.avatarUrl} alt={data.name} size={120} />
        <h1 className="home-name">{data.name}</h1>
        <p className="home-title">{data.title}</p>
        <p className="home-bio">{data.bio}</p>
        <SocialLinks links={data.socialLinks} />
      </div>
    </section>
  );
}
