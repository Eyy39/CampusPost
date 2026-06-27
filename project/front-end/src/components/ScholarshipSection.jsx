import React from 'react';
import { Award, Calendar, ChevronRight } from 'lucide-react';

const scholarships = [
  {
    title: 'CampusPost Excellence Scholarship',
    deadline: 'Deadline: Aug 30, 2026',
  },
  {
    title: 'STEM Merit Award for Cambodian Students',
    deadline: 'Deadline: Sep 15, 2026',
  },
  {
    title: 'ASEAN Regional Development Grant',
    deadline: 'Deadline: Oct 1, 2026',
  },
];

export default function ScholarshipSection() {
  return (
    <section className="scholarship-section">
      <div className="container">
        <div className="scholarship-layout">
          <div className="scholarship-content reveal">
            <h2>Find Your Scholarship</h2>
            <p>
              Unlock financial opportunities with hundreds of scholarships
              tailored for Cambodian students. From merit-based awards to
              need-based grants, we help you fund your education.
            </p>

            <div className="scholarship-list">
              {scholarships.map((item, index) => (
                <div
                  key={index}
                  className={`scholarship-item reveal reveal-delay-${index + 1}`}
                >
                  <div className="scholarship-item-icon">
                    <Award size={22} />
                  </div>
                  <div className="scholarship-item-info">
                    <h4>{item.title}</h4>
                    <p>{item.deadline}</p>
                  </div>
                  <ChevronRight
                    size={18}
                    style={{ marginLeft: 'auto', color: '#94A3B8', flexShrink: 0 }}
                  />
                </div>
              ))}
            </div>

            <button className="btn btn-primary">
              Browse All Scholarships
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="scholarship-image reveal reveal-delay-3">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c7f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Students studying"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
