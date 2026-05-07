import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
}

export function Avatar({ src, alt, size = 120 }: AvatarProps) {
  const [hasError, setHasError] = useState(!src);
  const initial = alt.charAt(0).toUpperCase();

  if (hasError) {
    return (
      <div
        className="avatar-fallback"
        style={{ width: size, height: size, borderRadius: '50%' }}
        aria-label={alt}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
    />
  );
}
