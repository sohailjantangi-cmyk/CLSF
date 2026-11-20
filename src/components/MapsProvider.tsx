import { useEffect, useState, type ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { fetchMapsConfig } from '../lib/api';

interface MapsProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function MapsProvider({ children, fallback }: MapsProviderProps) {
  const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [apiKey, setApiKey] = useState<string>(envKey);
  const [resolved, setResolved] = useState<boolean>(Boolean(envKey));

  useEffect(() => {
    if (envKey) return;
    let active = true;
    fetchMapsConfig()
      .then((res) => {
        if (active) {
          setApiKey(res.apiKey || '');
          setResolved(true);
        }
      })
      .catch(() => {
        if (active) setResolved(true);
      });
    return () => {
      active = false;
    };
  }, [envKey]);

  if (!resolved) {
    return (
      <div className="flex h-full min-h-[260px] items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
        Loading Dubai Map...
      </div>
    );
  }

  if (!apiKey) {
    return (
      <>
        {fallback || (
          <div className="flex h-full min-h-[260px] items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Google Maps API key is unavailable. Check Settings &gt; Secrets to enable map tiles.
          </div>
        )}
      </>
    );
  }

  return (
    <APIProvider apiKey={apiKey} language="en" region="AE">
      {children}
    </APIProvider>
  );
}
