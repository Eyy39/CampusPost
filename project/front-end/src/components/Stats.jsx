import React, { useEffect, useRef, useState } from 'react';
import { Building2, DollarSign, BookOpen, Star } from 'lucide-react';

const stats = [
  { icon: Building2, label: 'Universities', value: 50, suffix: '+', color: 'blue' },
  { icon: DollarSign, label: 'Scholarships', value: 200, suffix: '+', color: 'green' },
  { icon: BookOpen, label: 'Programs', value: 1000, suffix: '+', color: 'purple' },
  { icon: Star, label: 'Student Reviews', value: 5, suffix: 'K+', color: 'orange' },
];

function CountUp({ end, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const startTime = performance.now();
          const isK = typeof suffix === 'string' && suffix.includes('K');

          function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * end);
            setCount(isK ? current : current);
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, suffix]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`stat-card reveal reveal-delay-${index + 1}`}>
                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="stat-number">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
