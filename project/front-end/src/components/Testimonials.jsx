import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sopheak Vann',
    university: 'Royal University of Phnom Penh',
    text: 'CampusPost made finding the right university so easy. I compared programs, checked scholarships, and read reviews from current students. I found my dream program in just one week!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Mey Srey Leak',
    university: 'Institute of Technology of Cambodia',
    text: 'The scholarship feature is incredible. I discovered a full-ride scholarship I would never have found otherwise. CampusPost is a game-changer for Cambodian students.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sok Piseth',
    university: 'National University of Management',
    text: 'As a student from a rural province, I was worried about finding the right university. CampusPost helped me explore all my options and connect with the right people.',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header reveal">
          <h2>What Students Say</h2>
          <p>Hear from students who found their path through CampusPost</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div
              key={item.name}
              className={`testimonial-card reveal reveal-delay-${index + 1}`}
            >
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < item.rating ? '#F59E0B' : 'none'}
                    stroke={i < item.rating ? '#F59E0B' : '#D1D5DB'}
                  />
                ))}
              </div>
              <p className="testimonial-text">"{item.text}"</p>
              <div className="testimonial-author">
                <div
                  className="testimonial-avatar"
                  style={{ backgroundImage: `url('${item.avatar}')` }}
                />
                <div className="testimonial-info">
                  <h4>{item.name}</h4>
                  <p>{item.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
