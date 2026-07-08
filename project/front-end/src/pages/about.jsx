import React from 'react';
import { ArrowRight, GraduationCap, BookOpen, Sparkles, ShieldCheck, Globe2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const values = [
  {
    icon: GraduationCap,
    title: 'Guided admissions',
    text: 'We help students navigate applications, deadlines, and requirements with clarity and confidence.',
  },
  {
    icon: BookOpen,
    title: 'Smart matching',
    text: 'Discover universities and scholarships that align with your goals, budget, and academic profile.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted support',
    text: 'Our platform keeps your information organized so you can focus on what matters most: your future.',
  },
];

const stats = [
  { label: 'Universities listed', value: '120+' },
  { label: 'Scholarships tracked', value: '300+' },
  { label: 'Students supported', value: '10k+' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <Layout activePage="About">
      <main style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: 96, paddingBottom: 80 }}>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e0f2fe', color: '#0369a1', padding: '8px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                <Sparkles size={16} />
                About CampusPost
              </div>
              <h1 style={{ fontSize: '2.6rem', lineHeight: 1.15, color: '#0f172a', marginBottom: 16 }}>
                Helping students find the right path to higher education.
              </h1>
              <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
                CampusPost is a modern platform that brings universities, scholarships, and application planning together in one place.
                We make it easier for students to compare options, stay organized, and move forward with confidence.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/universities')}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Explore Universities
                </button>
                <button
                  onClick={() => navigate('/scholarships')}
                  style={{ background: 'transparent', color: '#2563eb', border: '2px solid #2563eb', borderRadius: 999, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Browse Scholarships
                </button>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: 24, padding: 28, color: '#fff', boxShadow: '0 20px 45px rgba(37,99,235,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe2 size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Built for Cambodian students</div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>Simple, modern, and student-focused</div>
                </div>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, opacity: 0.95 }}>
                From exploring institutions to submitting applications, CampusPost is designed to reduce confusion and save time at every step.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginTop: 36 }}>
            {stats.map((item) => (
              <div key={item.label} style={{ background: '#fff', borderRadius: 18, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.04)' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{item.value}</div>
                <div style={{ color: '#64748b', fontSize: 14 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: 14 }}>
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{item.text}</p>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 40, background: '#fff', borderRadius: 24, padding: 28, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Ready to begin your journey?</h2>
                <p style={{ color: '#64748b', margin: 0 }}>Create an account and start exploring your future with CampusPost.</p>
              </div>
              <button
                onClick={() => navigate('/signup')}
                style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 18px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                Get Started <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
