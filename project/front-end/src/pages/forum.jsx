import React from 'react';
import { MessageCircleMore, MessageSquareText, Sparkles, Users } from 'lucide-react';
import Layout from '../components/Layout';

const discussions = [
  {
    title: 'How do you prepare for university interviews?',
    author: 'Sreyneang',
    replies: 18,
    category: 'Admissions',
    preview: 'I would love to hear practical tips from students who have already gone through the process.',
  },
  {
    title: 'Best scholarships for computer science students',
    author: 'Mina',
    replies: 11,
    category: 'Scholarships',
    preview: 'What scholarships are worth applying for in Cambodia and abroad this year?',
  },
  {
    title: 'How to choose between universities?',
    author: 'Rithy',
    replies: 24,
    category: 'Guidance',
    preview: 'I am comparing tuition, reputation, and student life. Any advice?',
  },
];

export default function Forum() {
  return (
    <Layout activePage="Forum">
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 96, paddingBottom: 80 }}>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.05fr 0.95fr', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ede9fe', color: '#6d28d9', padding: '8px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                <Sparkles size={16} />
                Community Forum
              </div>
              <h1 style={{ fontSize: '2.35rem', lineHeight: 1.15, color: '#0f172a', marginBottom: 14 }}>
                Ask questions, share advice, and connect with future students.
              </h1>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
                Join peer conversations about admissions, scholarships, universities, and student life.
              </p>
              <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}>
                Start a Discussion
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Active community</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>1,200+ students discussing their journeys</div>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px 14px', color: '#334155' }}>Newest topic: admission tips</div>
                <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px 14px', color: '#334155' }}>Trending: scholarship deadlines</div>
                <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px 14px', color: '#334155' }}>Popular: choosing the right university</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            {discussions.map((item) => (
              <div key={item.title} style={{ background: '#fff', borderRadius: 20, padding: 22, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#2563eb', padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                      <MessageSquareText size={14} />
                      {item.category}
                    </div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ color: '#64748b', margin: 0 }}>by {item.author}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontWeight: 600 }}>
                    <MessageCircleMore size={16} />
                    {item.replies} replies
                  </div>
                </div>
                <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>{item.preview}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
