import React, { useState, useEffect } from 'react';
import { BadgeCheck, CalendarDays, DollarSign, Sparkles, Building2, ChevronRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Layout from '../components/Layout';

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
          if (isTecho) {
            if (!grouped['techo']) {
              grouped['techo'] = {
                id: 'techo',
                title: 'Techo Digital Talent Scholarship 2026-2027',
                titleEn: 'Techo Digital Talent Scholarship 2026-2027',
                description: '100% Scholarship + Laptop | 600 spots across 7 universities',
                tag: 'Fully Funded',
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
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 96, paddingBottom: 80 }}>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dcfce7', color: '#166534', padding: '8px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              <Sparkles size={16} />
              Scholarships
            </div>
            <h1 style={{ fontSize: '2.4rem', lineHeight: 1.15, color: '#0f172a', marginBottom: 14 }}>
              Find funding opportunities for your study journey.
            </h1>
            <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.8 }}>
              Explore verified scholarships, compare benefits, and stay ahead of deadlines with CampusPost.
            </p>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading scholarships...</div>
          ) : error ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>{error}</div>
          ) : scholarships.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>No scholarships available yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: 20 }}>
              {scholarships.map((item) => {
                const uniCount = item.universities?.length || 0;
                if (uniCount > 0) {
                  const deadlineDate = item.deadline ? new Date(item.deadline) : null;
                  const now = new Date();
                  const daysLeft = deadlineDate ? Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24)) : null;
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate('/scholarships/' + item.id)}
                      style={{
                        background: '#fff',
                        borderRadius: 20,
                        padding: 28,
                        border: '2px solid #dcfce7',
                        boxShadow: '0 10px 30px rgba(15,23,42,0.04)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                        <div style={{ flex: 1, minWidth: 300 }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#166534', padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                            <Sparkles size={14} />
                            {item.tag}
                          </div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{item.title}</h3>
                          <p style={{ color: '#475569', margin: '4px 0 0' }}>{item.description}</p>
                        </div>
                        <button style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 16px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}>
                          View Details <ChevronRight size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
                        <div style={{ background: '#f0fdf4', borderRadius: 14, padding: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', marginBottom: 6 }}>
                            <DollarSign size={16} />
                            <span style={{ fontWeight: 700 }}>Benefit</span>
                          </div>
                          <div style={{ color: '#0f172a', fontWeight: 700 }}>{item.amount}</div>
                        </div>
                        <div style={{ background: '#f0fdf4', borderRadius: 14, padding: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', marginBottom: 6 }}>
                            <Users size={16} />
                            <span style={{ fontWeight: 700 }}>Total Spots</span>
                          </div>
                          <div style={{ color: '#0f172a', fontWeight: 700 }}>{item.totalSpots} across {uniCount} universities</div>
                        </div>
                        <div style={{ background: '#f0fdf4', borderRadius: 14, padding: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', marginBottom: 6 }}>
                            <CalendarDays size={16} />
                            <span style={{ fontWeight: 700 }}>Deadline</span>
                          </div>
                          <div style={{ color: daysLeft !== null && daysLeft <= 30 ? '#dc2626' : '#0f172a', fontWeight: 700 }}>
                            {deadlineDate
                              ? deadlineDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                              : 'Rolling'
                            }
                            {daysLeft !== null && daysLeft > 0 && (
                              <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 6, color: daysLeft <= 30 ? '#dc2626' : '#059669' }}>
                                ({daysLeft} days left)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* University list preview */}
                      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {item.universities.map((uni) => (
                          <span key={uni.id} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                            {uni.name.split('(')[0].trim()} ({uni.spots})
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.id} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#2563eb', padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                          <BadgeCheck size={14} />
                          {item.tag}
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{item.title}</h3>
                        <p style={{ color: '#64748b', margin: 0 }}>{item.provider}</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
                      <div style={{ background: '#f8fafc', borderRadius: 14, padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb', marginBottom: 6 }}>
                          <DollarSign size={16} />
                          <span style={{ fontWeight: 700 }}>Amount</span>
                        </div>
                        <div style={{ color: '#0f172a', fontWeight: 700 }}>{item.amount}</div>
                      </div>
                      <div style={{ background: '#f8fafc', borderRadius: 14, padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb', marginBottom: 6 }}>
                          <CalendarDays size={16} />
                          <span style={{ fontWeight: 700 }}>Deadline</span>
                        </div>
                        <div style={{ color: '#0f172a', fontWeight: 700 }}>{item.deadline}</div>
                      </div>
                      <div style={{ background: '#f8fafc', borderRadius: 14, padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb', marginBottom: 6 }}>
                          <BadgeCheck size={16} />
                          <span style={{ fontWeight: 700 }}>Level</span>
                        </div>
                        <div style={{ color: '#0f172a', fontWeight: 700 }}>{item.level}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
