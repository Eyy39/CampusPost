import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { api } from '../utils/api';

const fallbackImage = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export default function FeaturedUniversities() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const sectionRef = React.useRef(null);

  useEffect(() => {
    api.get('/universities')
      .then((data) => {
        const mapped = data.slice(0, 4).map((u) => ({
          id: u.university_id,
          name: u.name,
          image: u.logo || fallbackImage,
          location: [u.city, u.country].filter(Boolean).join(', ') || 'Cambodia',
          rating: u.ranking ? Math.max(1, 6 - u.ranking).toFixed(1) : '4.5',
          tuition: u.Majors?.length
            ? `$${Math.min(...u.Majors.map(m => Number(m.tuition_fee) || 0)).toLocaleString()}–${Math.max(...u.Majors.map(m => Number(m.tuition_fee) || 0)).toLocaleString()}/year`
            : 'Contact for details',
        }));
        setUniversities(mapped);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!universities.length || !sectionRef.current) return;
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
  }, [universities]);

  return (
    <section className="featured-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <h2>Featured Universities</h2>
          <p>Discover Cambodia's top institutions for higher education</p>
        </div>
        <div className="universities-grid">
          {universities.map((uni, index) => (
            <div key={uni.id || uni.name} className={`university-card reveal reveal-delay-${index + 1}`}>
              <div
                className="university-card-image"
                style={{ backgroundImage: `url('${uni.image}')` }}
              >
                <div className="overlay" />
                <span className="university-card-badge">Featured</span>
              </div>
              <div className="university-card-body">
                <h3>{uni.name}</h3>
                <div className="location">
                  <MapPin size={16} />
                  {uni.location}
                </div>
                <div className="university-card-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(uni.rating) ? '#F59E0B' : 'none'}
                        stroke={i < Math.floor(uni.rating) ? '#F59E0B' : '#D1D5DB'}
                      />
                    ))}
                  </div>
                  <span className="rating-text">
                    {uni.rating}
                  </span>
                </div>
                <div className="university-card-footer">
                  <span className="tuition">
                    Tuition: <strong>{uni.tuition}</strong>/year
                  </span>
                  <button className="detail-btn" onClick={() => navigate('/universities')}>Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
