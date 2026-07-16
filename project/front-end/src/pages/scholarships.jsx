import React, { useState, useEffect } from 'react';
import { BadgeCheck, CalendarDays, DollarSign, Sparkles, ChevronRight, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import '../styles/scholarships.css';

export default function Scholarships() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/scholarships')
      .then((data) => {
        const grouped = {};
        const others = [];

        data.forEach((s) => {
          const isTecho = s.title.toLowerCase().includes('techo');
          const isSpecial = s.title.toLowerCase().includes('special');
          if (isTecho) {
            if (!grouped['techo']) {
              grouped['techo'] = {
                id: 'techo',
                title: 'Techo Digital Talent Scholarship 2026-2027',
                description: '100% Scholarship + Laptop | 600 spots across 7 universities',
                tag: 'Fully Funded',
                tagType: 'blue',
                amount: '100% Tuition + Laptop',
                totalSpots: 0,
                deadline: null,
                universities: [],
              };
            }
            grouped['techo'].universities.push({
              id: s.scholarship_id,
              universityId: s.university_id,
              name: s.University?.name || 'Unknown University',
              track: s.title,
              spots: s.spots || 0,
              deadline: s.deadline,
            });
            grouped['techo'].totalSpots += s.spots || 0;
            if (s.deadline && (!grouped['techo'].deadline || s.deadline < grouped['techo'].deadline)) {
              grouped['techo'].deadline = s.deadline;
            }
          } else if (isSpecial) {
            if (!grouped['special']) {
              grouped['special'] = {
                id: 'special-cadt',
                title: s.title,
                description: s.description,
                tag: 'Special',
                tagType: 'amber',
                amount: '50% Tuition',
                totalSpots: s.spots || 0,
                deadline: s.deadline,
                provider: s.University?.name || 'CADT',
              };
            }
          } else {
            others.push({
              id: s.scholarship_id,
              title: s.title,
              provider: s.University?.name || 'Unknown University',
              amount: s.amount ? '$' + Number(s.amount).toLocaleString() : 'TBD',
              deadline: s.deadline
                ? new Date(s.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Ongoing',
              level: s.eligibility || 'All levels',
              tag: Number(s.amount) >= 2500 ? 'Fully Funded' : Number(s.amount) >= 1500 ? 'Merit Based' : 'Need Based',
              tagType: Number(s.amount) >= 2500 ? 'blue' : Number(s.amount) >= 1500 ? 'blue' : 'slate',
            });
          }
        });

        setScholarships([...Object.values(grouped), ...others]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Layout activePage="Scholarships">
      <main className="sp">
        <section className="sp-content">
          <div className="sp-container">
            {loading ? (
              <div className="sp-loading">
                <div className="sp-loading-spinner" />
                <p>Loading scholarships...</p>
              </div>
            ) : error ? (
              <div className="sp-error">{error}</div>
            ) : scholarships.length === 0 ? (
              <div className="sp-empty">No scholarships available yet.</div>
            ) : (
              <div className="sp-grid">
                {scholarships.map((item) => {
                  const deadlineDate = item.deadline ? new Date(item.deadline) : null;
                  const now = new Date();
                  const daysLeft = deadlineDate ? Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24)) : null;
                  const uniCount = item.universities?.length || 0;

                  const tagColor = item.tagType || 'slate';

                  if (item.id === 'special-cadt') {
                    return (
                      <div
                        key={item.id}
                        className={`sp-card sp-card-amber`}
                        onClick={() => navigate('/scholarships/' + item.id)}
                      >
                        <div className="sp-card-top">
                          <div className="sp-card-info">
                            <span className="sp-tag sp-tag-amber">
                              <Award size={12} />
                              {item.tag}
                            </span>
                            <h3>{item.title}</h3>
                            <p className="sp-card-provider">CADT-only scholarship for students who failed Techo or finished high school over 1 year ago. Women get 50% extra discount.</p>
                          </div>
                          <button className="sp-card-btn">
                            View Details
                            <ChevronRight size={16} />
                          </button>
                        </div>
                        <div className="sp-card-stats">
                          <div className="sp-card-stat">
                            <DollarSign size={15} />
                            <div>
                              <span className="sp-card-stat-label">Benefit</span>
                              <span className="sp-card-stat-value">Multiple Tiers</span>
                            </div>
                          </div>
                          <div className="sp-card-stat">
                            <Users size={15} />
                            <div>
                              <span className="sp-card-stat-label">Spots</span>
                              <span className="sp-card-stat-value">{item.totalSpots} at CADT</span>
                            </div>
                          </div>
                          {deadlineDate && (
                            <div className="sp-card-stat">
                              <CalendarDays size={15} />
                              <div>
                                <span className="sp-card-stat-label">Deadline</span>
                                <span className={`sp-card-stat-value ${daysLeft <= 30 ? 'sp-deadline-soon' : ''}`}>
                                  {deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  {daysLeft > 0 && (
                                    <span className={`sp-days-left ${daysLeft <= 30 ? 'sp-days-urgent' : ''}`}>
                                      ({daysLeft}d left)
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (uniCount > 0) {
                    return (
                      <div
                        key={item.id}
                        className={`sp-card sp-card-${tagColor}`}
                        onClick={() => navigate('/scholarships/' + item.id)}
                      >
                        <div className="sp-card-top">
                          <div className="sp-card-info">
                            <span className={`sp-tag sp-tag-${tagColor}`}>
                              <Sparkles size={12} />
                              {item.tag}
                            </span>
                            <h3>{item.title}</h3>
                            <p className="sp-card-provider">{item.description}</p>
                          </div>
                          <button className="sp-card-btn">
                            View Details
                            <ChevronRight size={16} />
                          </button>
                        </div>
                        <div className="sp-card-stats">
                          <div className="sp-card-stat">
                            <DollarSign size={15} />
                            <div>
                              <span className="sp-card-stat-label">Benefit</span>
                              <span className="sp-card-stat-value">{item.amount}</span>
                            </div>
                          </div>
                          <div className="sp-card-stat">
                            <Users size={15} />
                            <div>
                              <span className="sp-card-stat-label">Spots</span>
                              <span className="sp-card-stat-value">{item.totalSpots} across {uniCount} unis</span>
                            </div>
                          </div>
                          {deadlineDate && (
                            <div className="sp-card-stat">
                              <CalendarDays size={15} />
                              <div>
                                <span className="sp-card-stat-label">Deadline</span>
                                <span className={`sp-card-stat-value ${daysLeft <= 30 ? 'sp-deadline-soon' : ''}`}>
                                  {deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  {daysLeft > 0 && (
                                    <span className={`sp-days-left ${daysLeft <= 30 ? 'sp-days-urgent' : ''}`}>
                                      ({daysLeft}d left)
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="sp-card-unis">
                          {item.universities.map((uni) => (
                            <span key={uni.id} className="sp-uni-tag">
                              {uni.name.split('(')[0].trim()} ({uni.spots})
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className={`sp-card sp-card-${tagColor}`}
                      onClick={() => navigate('/scholarships/' + item.id)}
                    >
                      <div className="sp-card-top">
                        <div className="sp-card-info">
                          <span className={`sp-tag sp-tag-${tagColor}`}>
                            <BadgeCheck size={12} />
                            {item.tag}
                          </span>
                          <h3>{item.title}</h3>
                          <p className="sp-card-provider">{item.provider}</p>
                        </div>
                        <button className="sp-card-btn">
                          View Details
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="sp-card-stats">
                        <div className="sp-card-stat">
                          <DollarSign size={15} />
                          <div>
                            <span className="sp-card-stat-label">Amount</span>
                            <span className="sp-card-stat-value">{item.amount}</span>
                          </div>
                        </div>
                        <div className="sp-card-stat">
                          <CalendarDays size={15} />
                          <div>
                            <span className="sp-card-stat-label">Deadline</span>
                            <span className="sp-card-stat-value">{item.deadline}</span>
                          </div>
                        </div>
                        <div className="sp-card-stat">
                          <BadgeCheck size={15} />
                          <div>
                            <span className="sp-card-stat-label">Level</span>
                            <span className="sp-card-stat-value">{item.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
