import React from 'react';
import { ArrowRight, BadgeCheck, CalendarDays, DollarSign, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const scholarships = [
  {
    title: 'Cambodia Future Leaders Scholarship',
    provider: 'Ministry of Education',
    amount: '$2,500',
    deadline: 'Aug 30, 2026',
    level: 'Undergraduate',
    tag: 'Fully Funded',
  },
  {
    title: 'Digital Innovation Grant',
    provider: 'CADT',
    amount: '$1,800',
    deadline: 'Sep 12, 2026',
    level: 'Bachelor',
    tag: 'Merit Based',
  },
  {
    title: 'Women in STEM Award',
    provider: 'Royal University',
    amount: '$1,200',
    deadline: 'Oct 05, 2026',
    level: 'Postgraduate',
    tag: 'Need Based',
  },
];

export default function Scholarships() {
  const navigate = useNavigate();

  return (
    <Layout activePage="Scholarships">
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 96, paddingBottom: 80 }}>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.05fr 0.95fr', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dcfce7', color: '#166534', padding: '8px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                <Sparkles size={16} />
                Scholarships
              </div>
              <h1 style={{ fontSize: '2.4rem', lineHeight: 1.15, color: '#0f172a', marginBottom: 14 }}>
                Find funding opportunities for your study journey.
              </h1>
              <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
                Explore verified scholarships, compare benefits, and stay ahead of deadlines with CampusPost.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/signup')}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Apply Now
                </button>
                <button
                  onClick={() => navigate('/universities')}
                  style={{ background: 'transparent', color: '#2563eb', border: '2px solid #2563eb', borderRadius: 999, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Explore Universities
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Search size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Search scholarship opportunities</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Filter by field, budget, and deadline</div>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: '12px 14px', color: '#334155' }}>Field: Computer Science</div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: '12px 14px', color: '#334155' }}>Budget: Under $3,000</div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: '12px 14px', color: '#334155' }}>Deadline: This semester</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            {scholarships.map((item) => (
              <div key={item.title} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#2563eb', padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                      <BadgeCheck size={14} />
                      {item.tag}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ color: '#64748b', margin: 0 }}>{item.provider}</p>
                  </div>
                  <button style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
                    View Details
                  </button>
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
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
