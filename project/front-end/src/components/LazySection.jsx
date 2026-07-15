import React, { useState, useEffect } from 'react';

export function useLazy(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error };
}

export function SectionSkeleton({ lines = 3, height = 20 }) {
  return (
    <div className="lazy-section-skeleton">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="lazy-skeleton-line"
          style={{
            height,
            width: `${70 + Math.random() * 30}%`,
            opacity: Math.max(0.3, 1 - i * 0.2),
          }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="lazy-card-skeleton-grid">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="lazy-card-skeleton">
          <div className="lazy-skeleton-line" style={{ width: '60%', height: 18, marginBottom: 8 }} />
          <div className="lazy-skeleton-line" style={{ width: '40%', height: 14 }} />
        </div>
      ))}
    </div>
  );
}
