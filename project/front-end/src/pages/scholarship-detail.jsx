import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, DollarSign, CalendarDays, Building2, GraduationCap, Globe, Clock, ChevronRight, ExternalLink, Users, BookOpen, Phone, Award, Target, FileText } from 'lucide-react';
import { api } from '../utils/api';
import Layout from '../components/Layout';

const TECHO_OFFICIAL = {
  title: 'Techo Digital Talent Scholarship 2026-2027',
  totalSpots: 600,
  benefits: [
    { icon: '💻', text: '1 Laptop provided' },
    { icon: '🎓', text: '100% tuition coverage until graduation' },
    { icon: '💰', text: 'Tuition value from $3,100 to $24,700 USD' },
    { icon: '💼', text: 'Career opportunities with high salary at ministries, institutions, or tech companies' },
    { icon: '🏛️', text: 'MPTC support throughout your studies until graduation' },
  ],
  requirements: [
    'Passed Bacc II (Grade 12) in the 2025-2026 academic year with grades A, B, or C',
    'Passed the competitive entrance exam organized by the Scholarship Committee',
    'Students from low-income families, remote areas, persons with disabilities, and female students are encouraged to apply',
  ],
  examSubjects: {
    cadt: 'Math, Logic, English + Oral Interview',
    aupp: 'Math, Physics, English',
  },
};

const UNIVERSITY_PROGRAMS = [
  {
    id: 1, code: 'cadt', name: 'Cambodia Academy of Digital Technology (CADT)',
    spots: 200, deadline: '2026-09-30',
    programs: [
      'Software Engineering',
      'Data Science',
      'e-Commerce',
      'Telecommunications & Networking Engineering (Including Satellite)',
      'Cybersecurity',
    ],
    contact: '015 335 877 / 077 335 877',
    registerUrl: 'https://www.cadt.edu.kh/scholarship',
    examSubjects: 'Math, Logic, English + Oral Interview',
  },
  {
    id: 2, code: 'aupp', name: 'American University of Phnom Penh (AUPP)',
    spots: 200, deadline: '2026-09-18',
    programs: [
      'IT Management / Computer Science',
      'Information and Communication Technology',
      'Cybersecurity',
      'Artificial Intelligence',
      'Digital Infrastructure',
      'Software Development',
      'Data Analytics / Information Systems',
      'Interactive App Design and Development',
    ],
    contact: '070 366 623 / 093 366 623',
    registerUrl: null,
    registerNote: 'Register in person at AUPP campus',
    examSubjects: 'Math, Physics, English',
  },
  {
    id: 5, code: 'rupp', name: 'Royal University of Phnom Penh (RUPP)',
    spots: 75, deadline: '2026-09-30',
    programs: [
      'Telecommunications and Satellite Engineering',
      'Data Science and Engineering',
    ],
    contact: '015 335 877 / 077 335 877',
    registerUrl: 'https://www.cadt.edu.kh/scholarship',
    examSubjects: 'Math, Logic, English + Oral Interview',
  },
  {
    id: 3, code: 'itc', name: 'Institute of Technology of Cambodia (ITC)',
    spots: 65, deadline: '2026-09-30',
    programs: [
      'Aerospace and Autonomous Systems Engineering',
      'Software Engineering',
      'AI Engineering and Cybersecurity',
    ],
    contact: '015 335 877 / 077 335 877',
    registerUrl: 'https://www.cadt.edu.kh/scholarship',
    examSubjects: 'Math, Logic, English + Oral Interview (additional ITC requirements)',
  },
  {
    id: 4, code: 'num', name: 'National University of Management (NUM)',
    spots: 20, deadline: '2026-09-30',
    programs: [
      'Digital Economy',
      'Financial Technology',
      'Global Entrepreneurship and Innovation',
    ],
    contact: '015 335 877 / 077 335 877',
    registerUrl: 'https://www.cadt.edu.kh/scholarship',
    examSubjects: 'Math, Logic, English + Oral Interview',
  },
  {
    id: 6, code: 'paragon', name: 'Paragon International University (PARAGON)',
    spots: 20, deadline: '2026-09-30',
    programs: [
      'Computer Science',
      'Management of Information System',
      'Digital Arts and Design',
    ],
    contact: '015 335 877 / 077 335 877',
    registerUrl: 'https://www.cadt.edu.kh/scholarship',
    examSubjects: 'Math, Logic, English + Oral Interview',
  },
  {
    id: 7, code: 'uc', name: 'University of Cambodia (UC)',
    spots: 20, deadline: '2026-09-30',
    programs: [
      'Information Technology',
    ],
    contact: '015 335 877 / 077 335 877',
    registerUrl: 'https://www.cadt.edu.kh/scholarship',
    examSubjects: 'Math, Logic, English + Oral Interview',
  },
];

export default function ScholarshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUni, setSelectedUni] = useState(null);

  useEffect(() => {
    if (id === 'techo') {
      api.get('/scholarships')
        .then((all) => {
          const techo = all.filter((s) => s.title.toLowerCase().includes('techo'));
          const uniMap = {};
          techo.forEach((s) => {
            const uid = s.university_id;
            if (!uniMap[uid]) {
              uniMap[uid] = { name: s.University?.name || 'Unknown', spots: s.spots || 0, deadline: s.deadline };
            }
          });
          setApiData({ isGrouped: true, scholarships: techo, uniMap });
          setLoading(false);
        })
        .catch((err) => { setError(err.message); setLoading(false); });
    } else {
      api.get(`/scholarships/${id}`)
        .then((s) => {
          const uni = UNIVERSITY_PROGRAMS.find((u) => u.id === s.university_id);
          setApiData({
            isGrouped: false,
            id: s.scholarship_id,
            title: s.title,
            provider: s.University?.name || 'Unknown University',
            description: s.description || '',
            amount: s.amount ? '$' + Number(s.amount).toLocaleString() : '100% Tuition + Laptop',
            spots: s.spots || 'TBD',
            deadline: s.deadline ? new Date(s.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Rolling',
            eligibility: s.eligibility || 'Contact university for details',
            contact: s.contact_info || uni?.contact || '',
            registerUrl: s.registration_url || uni?.registerUrl,
            programs: uni?.programs || [],
            examSubjects: uni?.examSubjects || '',
          });
          setLoading(false);
        })
        .catch((err) => { setError(err.message); setLoading(false); });
    }
  }, [id]);

  const renderGrouped = () => (
    <div>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #059669, #10b981)',
        borderRadius: 24, padding: 40, color: '#fff', marginBottom: 32,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          <Sparkles size={14} />
          Fully Funded Scholarship
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
          {TECHO_OFFICIAL.title}
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: 0, lineHeight: 1.7 }}>
          Academic Year 2026-2027 | <strong>{TECHO_OFFICIAL.totalSpots}</strong> spots available
        </p>
        <p style={{ fontSize: '0.95rem', opacity: 0.85, marginTop: 8 }}>
          Under the patronage of Samdech Moha Pavvrathep Hun Manet, Prime Minister of the Kingdom of Cambodia
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Users size={24} color="#059669" style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.5rem' }}>600</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Total Spots</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Building2 size={24} color="#059669" style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.5rem' }}>7</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Universities</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <BookOpen size={24} color="#059669" style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.5rem' }}>25</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Programs</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <DollarSign size={24} color="#059669" style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.5rem' }}>100%</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Tuition Coverage</div>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Award size={20} /> Scholarship Benefits
        </h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {TECHO_OFFICIAL.benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 16px', background: '#f0fdf4', borderRadius: 12 }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{b.icon}</span>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{b.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={20} /> Eligibility Requirements
        </h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {TECHO_OFFICIAL.requirements.map((r, i) => (
            <li key={i} style={{ padding: '10px 0', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, borderBottom: i < TECHO_OFFICIAL.requirements.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <span style={{ color: '#059669', fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Exam Info */}
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={20} /> Entrance Exam
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#f8fafc', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8, fontSize: 14 }}>CADT / RUPP / ITC / NUM / Paragon / UC</div>
            <div style={{ color: '#475569', fontSize: 13, lineHeight: 1.7 }}>
              <div>Subjects: <strong>Math, Logic, English</strong></div>
              <div style={{ marginTop: 4 }}>Plus: <strong>Oral interview</strong> at the Academy</div>
              <div style={{ marginTop: 4, color: '#64748b' }}>Contact: 015 335 877 / 077 335 877</div>
            </div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8, fontSize: 14 }}>AUPP</div>
            <div style={{ color: '#475569', fontSize: 13, lineHeight: 1.7 }}>
              <div>Subjects: <strong>Math, Physics, English</strong></div>
              <div style={{ marginTop: 4 }}>Registration: <strong>In person</strong> at AUPP campus</div>
              <div style={{ marginTop: 4, color: '#64748b' }}>Contact: 070 366 623 / 093 366 623</div>
            </div>
          </div>
        </div>
      </div>

      {/* University Programs */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Building2 size={22} /> Partner Universities & Programs
      </h3>
      <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
        {UNIVERSITY_PROGRAMS.map((uni) => {
          const isOpen = selectedUni === uni.id;
          const deadlineDate = new Date(uni.deadline);
          const now = new Date();
          const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
          return (
            <div key={uni.id} style={{
              background: '#fff', borderRadius: 20, border: isOpen ? '2px solid #10b981' : '1px solid #e2e8f0',
              overflow: 'hidden', transition: 'border 0.2s',
            }}>
              <div
                onClick={() => setSelectedUni(isOpen ? null : uni.id)}
                style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <Building2 size={18} color="#059669" />
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{uni.name}</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: 13, paddingLeft: 28 }}>{uni.nameKh}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                      {uni.spots} spots
                    </div>
                    <div style={{ fontSize: 12, color: daysLeft > 0 ? '#64748b' : '#ef4444', marginTop: 4 }}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                    </div>
                  </div>
                  <ChevronRight size={18} color="#94a3b8" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#059669', marginBottom: 10 }}>Available Programs ({uni.programs.length})</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {uni.programs.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '6px 10px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#334155' }}>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>&#8226;</span>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#475569' }}>
                      <CalendarDays size={16} color="#059669" style={{ marginTop: 2 }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>Deadline</div>
                        <div>{new Date(uni.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#475569' }}>
                      <FileText size={16} color="#059669" style={{ marginTop: 2 }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>Entrance Exam</div>
                        <div>{uni.examSubjects}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#475569' }}>
                    <Phone size={16} color="#059669" style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>Contact</div>
                      <div>{uni.contact}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => navigate('/application')}
                      style={{
                        background: '#10b981', color: '#fff', border: 'none', borderRadius: 999,
                        padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13,
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      Apply Now <ExternalLink size={14} />
                    </button>
                    {uni.registerUrl ? (
                      <a
                        href={uni.registerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 999,
                          padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13,
                          display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                        }}
                      >
                        Register Online <ExternalLink size={14} />
                      </a>
                    ) : uni.registerNote ? (
                      <span style={{
                        background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: 999,
                        padding: '10px 20px', fontWeight: 600, fontSize: 13,
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}>
                        {uni.registerNote}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: 32, textAlign: 'center' }}>
        <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, marginBottom: 8 }}>Apply Now!</h3>
        <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14 }}>
          Register at <strong>www.cadt.edu.kh/scholarship</strong> before September 30, 2026
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a
            href="https://www.cadt.edu.kh/scholarship"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#10b981', color: '#fff', border: 'none', borderRadius: 999,
              padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            }}
          >
            Register at CADT <ExternalLink size={16} />
          </a>
          <button
            onClick={() => navigate('/application')}
            style={{
              background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999,
              padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14,
            }}
          >
            Start Application
          </button>
        </div>
      </div>
    </div>
  );

  const renderSingle = () => (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #059669, #10b981)',
        borderRadius: 24, padding: 40, color: '#fff', marginBottom: 32,
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          <Sparkles size={14} />
          Techo Scholarship
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>{apiData.title}</h1>
        <p style={{ fontSize: '1rem', opacity: 0.9 }}>{apiData.provider}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0' }}>
          <DollarSign size={20} color="#059669" style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{apiData.amount}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Scholarship Benefit</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0' }}>
          <CalendarDays size={20} color="#059669" style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{apiData.deadline}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Deadline</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0' }}>
          <Users size={20} color="#059669" style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{apiData.spots} spots</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Available</div>
        </div>
      </div>

      {apiData.programs.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', marginBottom: 16 }}>Available Programs</h3>
          <div style={{ display: 'grid', gap: 6 }}>
            {apiData.programs.map((p, i) => (
              <div key={i} style={{ padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, fontSize: 14, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>&#8226;</span>
                {p}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', marginBottom: 12 }}>About This Scholarship</h3>
        <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 14 }}>{apiData.description}</p>
        <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 14, marginTop: 8 }}><strong>Eligibility:</strong> {apiData.eligibility}</p>
        {apiData.examSubjects && (
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 14, marginTop: 8 }}><strong>Exam Subjects:</strong> {apiData.examSubjects}</p>
        )}
        {apiData.contact && (
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 14, marginTop: 8 }}><strong>Contact:</strong> {apiData.contact}</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => navigate('/application')}
          style={{
            background: '#10b981', color: '#fff', border: 'none', borderRadius: 999,
            padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
        >
          Apply Now <ExternalLink size={16} />
        </button>
        {apiData.registerUrl ? (
          <a
            href={apiData.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 999,
              padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            }}
          >
            Register Online <ExternalLink size={16} />
          </a>
        ) : null}
      </div>
    </div>
  );

  return (
    <Layout activePage="Scholarships">
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 96, paddingBottom: 80 }}>
        <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <button
            onClick={() => navigate('/scholarships')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
              fontWeight: 600, marginBottom: 24, fontSize: 14, padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            Back to Scholarships
          </button>

          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading scholarship details...</div>
          ) : error ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#ef4444' }}>{error}</div>
          ) : apiData?.isGrouped ? renderGrouped() : apiData ? renderSingle() : null}
        </section>
      </main>
    </Layout>
  );
}
