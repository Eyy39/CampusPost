import React from 'react';
import { Book, Clock, GraduationCap } from 'lucide-react';
import { useLazy, SectionSkeleton, CardSkeleton } from './LazySection';
import { api } from '../utils/api';

export default function LazyPrograms({ universityId, onData }) {
  const { data: majors, loading } = useLazy(
    () => api.get(`/universities/${universityId}/majors`),
    [universityId]
  );

  React.useEffect(() => {
    if (majors && onData) {
      const amounts = majors.map((m) => Number(m.tuition_fee) || 0);
      const min = amounts.length ? Math.min(...amounts) : 0;
      const max = amounts.length ? Math.max(...amounts) : 0;
      const tuition = amounts.length
        ? (min === max
          ? `$${min.toLocaleString()}/year`
          : `$${min.toLocaleString()}–${max.toLocaleString()}/year`)
        : 'Contact for details';
      onData({ tuition, count: majors.length });
    }
  }, [majors]);

  if (loading) {
    return (
      <section className="detail-section">
        <h2>Available Programs</h2>
        <CardSkeleton count={3} />
      </section>
    );
  }

  if (!majors || majors.length === 0) return null;

  const amounts = majors.map((m) => Number(m.tuition_fee) || 0);
  const min = amounts.length ? Math.min(...amounts) : 0;
  const max = amounts.length ? Math.max(...amounts) : 0;

  return (
    <>
      <section className="detail-section">
        <h2>Tuition Fee</h2>
        <div className="detail-tuition-banner">
          <GraduationCap size={28} />
          <div>
            <span className="detail-tuition-label">Annual Tuition Range</span>
            <span className="detail-tuition-range">
              {amounts.length
                ? (min === max
                  ? `$${min.toLocaleString()}/year`
                  : `$${min.toLocaleString()}–${max.toLocaleString()}/year`)
                : 'Contact for details'}
            </span>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <h2>Available Programs</h2>
        <div className="detail-majors-grid">
          {majors.map((major) => (
            <div key={major.major_id} className="detail-major-card">
              <div className="detail-major-icon">
                <Book size={20} />
              </div>
              <div className="detail-major-content">
                <h3>{major.major_name}</h3>
                <div className="detail-major-meta">
                  {major.degree_level && (
                    <span className="detail-badge detail-badge-blue">{major.degree_level}</span>
                  )}
                  {major.duration && (
                    <span className="detail-badge detail-badge-gray">
                      <Clock size={12} /> {major.duration}
                    </span>
                  )}
                </div>
                {major.tuition_fee && (
                  <p className="detail-major-tuition">
                    ${Number(major.tuition_fee).toLocaleString()}/year
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
