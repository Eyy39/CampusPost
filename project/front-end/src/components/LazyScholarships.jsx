import React from 'react';
import { Sparkles, Calendar, ExternalLink } from 'lucide-react';
import { useLazy, CardSkeleton } from './LazySection';
import { api } from '../utils/api';

export default function LazyScholarships({ universityId, onData }) {
  const { data: scholarships, loading } = useLazy(
    () => api.get(`/scholarships?university_id=${universityId}`),
    [universityId]
  );

  React.useEffect(() => {
    if (scholarships && onData) {
      onData({ count: scholarships.length });
    }
  }, [scholarships]);

  if (loading) {
    return (
      <section className="detail-section">
        <h2>Scholarships</h2>
        <CardSkeleton count={2} />
      </section>
    );
  }

  if (!scholarships || scholarships.length === 0) return null;

  return (
    <section className="detail-section">
      <h2>Scholarships</h2>
      <div className="detail-scholarships-list">
        {scholarships.map((scholarship) => (
          <div key={scholarship.scholarship_id} className="detail-scholarship-card">
            <div className="detail-scholarship-header">
              <div className="detail-scholarship-icon">
                <Sparkles size={20} />
              </div>
              <div className="detail-scholarship-info">
                <h3>{scholarship.title}</h3>
                <div className="detail-scholarship-tags">
                  {scholarship.amount !== null && scholarship.amount !== undefined && (
                    <span className="detail-tag detail-tag-green">
                      {Number(scholarship.amount) === 0 ? '100% Coverage' : `$${Number(scholarship.amount).toLocaleString()}`}
                    </span>
                  )}
                  {scholarship.spots && (
                    <span className="detail-tag detail-tag-blue">{scholarship.spots} spots</span>
                  )}
                  {scholarship.deadline && (
                    <span className="detail-tag detail-tag-amber">
                      <Calendar size={12} /> Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {scholarship.description && (
              <p className="detail-scholarship-desc">{scholarship.description}</p>
            )}
            {scholarship.eligibility && (
              <div className="detail-scholarship-eligibility">
                <strong>Eligibility:</strong> {scholarship.eligibility}
              </div>
            )}
            {scholarship.registration_url && (
              <a
                href={scholarship.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-scholarship-link"
              >
                Learn More <ExternalLink size={14} />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
