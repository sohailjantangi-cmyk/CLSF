import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
  priority?: boolean;
}

export function Image({ src, alt, className = '', aspectClass = '', priority = false }: ImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[hsl(0_0%_16%)] ${aspectClass} ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-6 text-center">
          <Building2 className="h-6 w-6 text-[hsl(var(--accent))]" aria-hidden="true" />
          <span className="max-w-xs text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}
