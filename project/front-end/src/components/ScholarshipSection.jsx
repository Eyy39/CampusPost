import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronRight, Laptop, GraduationCap } from 'lucide-react';
import { api } from '../utils/api';

export default function ScholarshipSection() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const sectionRef = React.useRef(null);

  useEffect(() => {
    api.get('/scholarships')
      .then((data) => {
        let techo = null;
        let special = null;

        data.forEach((s) => {
          const title = s.title.toLowerCase();
          if (title.includes('techo') && !techo) {
            techo = {
              id: 'techo',
              title: 'Techo Digital Talent Scholarship',
              description: '100% Scholarship + Laptop | 600 spots across 7 universities',
              tag: 'Fully Funded',
              icon: 'laptop',
            };
          } else if (title.includes('special') && !special) {
            special = {
              id: 'special-cadt',
              title: s.title,
              description: s.description || 'Special scholarship for CADT students',
              tag: '50% Tuition',
              icon: 'grad',
            };
          }
        });

        const items = [];
        if (techo) items.push(techo);
        if (special) items.push(special);
        setFeatured(items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!featured.length || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const els = sectionRef.current.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [featured]);

  return (
    <section className="scholarship-section" ref={sectionRef}>
      <div className="container">
        <div className="scholarship-layout">
          <div className="scholarship-content reveal">
            <h2>Find Your Scholarship</h2>
            <p>
              Unlock financial opportunities with scholarships
              tailored for Cambodian students. From merit-based awards to
              need-based grants, we help you fund your education.
            </p>

            <div className="scholarship-list">
              {featured.map((item, index) => (
                <div
                  key={item.id}
                  className={`scholarship-item reveal reveal-delay-${index + 1}`}
                  onClick={() => navigate('/scholarships')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="scholarship-item-icon">
                    {item.icon === 'laptop' ? <Laptop size={22} /> : <GraduationCap size={22} />}
                  </div>
                  <div className="scholarship-item-info">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <span style={{
                      display: 'inline-block',
                      marginTop: 4,
                      padding: '2px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: item.tag === 'Fully Funded' ? '#dcfce7' : '#dbeafe',
                      color: item.tag === 'Fully Funded' ? '#166534' : '#1e40af',
                    }}>
                      {item.tag}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    style={{ marginLeft: 'auto', color: '#94A3B8', flexShrink: 0 }}
                  />
                </div>
              ))}
            </div>

            <button className="btn btn-primary" onClick={() => navigate('/scholarships')}>
              Browse All Scholarships
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="scholarship-image reveal reveal-delay-3">
            <img
              src="https://images.unsplash.com/photo-1618838420113-a110454368bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Smiling graduate woman outdoors in cap and gown"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
