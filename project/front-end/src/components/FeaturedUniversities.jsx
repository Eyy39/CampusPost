import React from 'react';
import { MapPin, Star } from 'lucide-react';

const universities = [
  {
    name: 'Royal University of Phnom Penh',
    location: 'Phnom Penh',
    rating: 4.8,
    reviews: 245,
    tuition: '$1,200',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Institute of Technology of Cambodia',
    location: 'Phnom Penh',
    rating: 4.6,
    reviews: 189,
    tuition: '$1,500',
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'National University of Management',
    location: 'Phnom Penh',
    rating: 4.5,
    reviews: 156,
    tuition: '$1,000',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'University of Health Sciences',
    location: 'Phnom Penh',
    rating: 4.7,
    reviews: 132,
    tuition: '$1,800',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

export default function FeaturedUniversities() {
  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-header reveal">
          <h2>Featured Universities</h2>
          <p>Discover Cambodia's top institutions for higher education</p>
        </div>
        <div className="universities-grid">
          {universities.map((uni, index) => (
            <div key={uni.name} className={`university-card reveal reveal-delay-${index + 1}`}>
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
                    {uni.rating} ({uni.reviews} reviews)
                  </span>
                </div>
                <div className="university-card-footer">
                  <span className="tuition">
                    Tuition: <strong>{uni.tuition}</strong>/year
                  </span>
                  <button className="detail-btn">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
