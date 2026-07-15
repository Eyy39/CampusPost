import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Star, Award,
  Globe, Mail, Phone,
  TrendingUp, Percent, Book, Heart,
} from 'lucide-react';
import Layout from '../components/Layout';
import LazyPrograms from '../components/LazyPrograms';
import LazyScholarships from '../components/LazyScholarships';
import LazyReviews from '../components/LazyReviews';
import { api } from '../utils/api';
import './university-detail.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

export default function UniversityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  // Lazy-loaded stats for sidebar & overview
  const [tuition, setTuition] = useState(null);
  const [programCount, setProgramCount] = useState(null);
  const [scholarshipCount, setScholarshipCount] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(null);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('campuspost_token')));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('campuspost_token');
    if (token && id) {
      api.get(`/favorites/check/${id}`).then((data) => {
        setIsFavorite(data.isFavorite);
        setFavoriteId(data.favorite_id);
      }).catch(() => {});
    }
  }, [id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('campuspost_token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (isFavorite && favoriteId) {
      try {
        await api.delete(`/favorites/${favoriteId}`);
        setIsFavorite(false);
        setFavoriteId(null);
      } catch (err) {
        alert('Failed to remove favorite. Please try again.');
      }
    } else {
      try {
        const result = await api.post('/favorites', { university_id: parseInt(id) });
        setIsFavorite(true);
        setFavoriteId(result.favorite_id);
      } catch (err) {
        alert('Failed to save favorite: ' + err.message);
      }
    }
  };

  useEffect(() => {
    api.get(`/universities/${id}`)
      .then((data) => {
        setUniversity({
          id: data.university_id,
          name: data.name,
          image: data.logo || FALLBACK_IMAGE,
          location: [data.city, data.country].filter(Boolean).join(', ') || 'Cambodia',
          address: data.address || null,
          ranking: data.ranking || null,
          acceptanceRate: data.acceptance_rate || null,
          description: data.description || 'A premier educational institution dedicated to academic excellence.',
          website: data.website || null,
          phone: data.phone || null,
          email: data.email || null,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load university details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Layout activePage="Universities">
        <div className="detail-loading">
          <div className="detail-spinner" />
          <p>Loading university details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !university) {
    return (
      <Layout activePage="Universities">
        <div className="detail-error">
          <p>{error || 'University not found'}</p>
          <button onClick={() => navigate('/universities')} className="detail-back-btn">
            <ArrowLeft size={18} /> Back to Universities
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="Universities">
      <div className="university-detail-page">
        <div className="detail-top-bar">
          <button onClick={() => navigate('/universities')} className="detail-back-btn">
            <ArrowLeft size={18} /> Back to Universities
          </button>
        </div>

        <div className="detail-hero">
          <img
            src={university.image}
            alt={university.name}
            className="detail-hero-image"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
          <div className="detail-hero-overlay">
            <h1>{university.name}</h1>
          </div>
        </div>

        <div className="detail-container">
          <div className="detail-main">
            <section className="detail-section">
              <h2>Overview</h2>
              <div className="detail-info-grid">
                <div className="detail-info-card">
                  <div className="detail-info-icon detail-icon-blue">
                    <MapPin size={22} />
                  </div>
                  <div className="detail-info-content">
                    <span className="detail-info-label">Location</span>
                    <span className="detail-info-value">{university.location}</span>
                  </div>
                </div>

                <div className="detail-info-card">
                  <div className="detail-info-icon detail-icon-amber">
                    <Star size={22} />
                  </div>
                  <div className="detail-info-content">
                    <span className="detail-info-label">Rating</span>
                    <span className="detail-info-value">
                      {avgRating ? `${avgRating}/5.0` : 'Loading...'}
                    </span>
                  </div>
                </div>

                {university.acceptanceRate && (
                  <div className="detail-info-card">
                    <div className="detail-info-icon detail-icon-green">
                      <Percent size={22} />
                    </div>
                    <div className="detail-info-content">
                      <span className="detail-info-label">Acceptance Rate</span>
                      <span className="detail-info-value">{university.acceptanceRate}%</span>
                    </div>
                  </div>
                )}

                {university.ranking && (
                  <div className="detail-info-card">
                    <div className="detail-info-icon detail-icon-purple">
                      <Award size={22} />
                    </div>
                    <div className="detail-info-content">
                      <span className="detail-info-label">Ranking</span>
                      <span className="detail-info-value">#{university.ranking}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="detail-section">
              <h2>About the University</h2>
              <p className="detail-description">{university.description}</p>
              {university.address && (
                <div className="detail-address-row">
                  <MapPin size={16} />
                  <span>{university.address}</span>
                </div>
              )}
            </section>

            <LazyPrograms
              universityId={id}
              onData={({ tuition: t, count }) => {
                setTuition(t);
                setProgramCount(count);
              }}
            />

            <LazyScholarships
              universityId={id}
              onData={({ count }) => setScholarshipCount(count)}
            />

            <LazyReviews
              universityId={id}
              isLoggedIn={isLoggedIn}
              onData={({ avgRating: a, count }) => {
                setAvgRating(a);
                setReviewCount(count);
              }}
            />

            <section className="detail-section">
              <h2>Contact Information</h2>
              <div className="detail-contact-grid">
                {university.email && (
                  <a href={`mailto:${university.email}`} className="detail-contact-item">
                    <div className="detail-contact-icon detail-icon-blue">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="detail-contact-label">Email</span>
                      <span className="detail-contact-value">{university.email}</span>
                    </div>
                  </a>
                )}
                {university.phone && (
                  <a href={`tel:${university.phone}`} className="detail-contact-item">
                    <div className="detail-contact-icon detail-icon-green">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="detail-contact-label">Phone</span>
                      <span className="detail-contact-value">{university.phone}</span>
                    </div>
                  </a>
                )}
                {university.website && (
                  <a href={university.website} target="_blank" rel="noopener noreferrer" className="detail-contact-item">
                    <div className="detail-contact-icon detail-icon-purple">
                      <Globe size={18} />
                    </div>
                    <div>
                      <span className="detail-contact-label">Website</span>
                      <span className="detail-contact-value">Visit Website</span>
                    </div>
                  </a>
                )}
                {university.address && (
                  <div className="detail-contact-item">
                    <div className="detail-contact-icon detail-icon-amber">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="detail-contact-label">Address</span>
                      <span className="detail-contact-value">{university.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="detail-sidebar-card detail-sidebar-apply">
              <h3>Apply Now</h3>
              <p>Start your application to {university.name} today.</p>
              <button className="detail-apply-btn" onClick={() => navigate('/application')}>
                Start Your Application
              </button>
            </div>

            <div className="detail-sidebar-card">
              <button
                className={`detail-favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>
            </div>

            <div className="detail-sidebar-card">
              <h3>Key Statistics</h3>
              <ul className="detail-stats-list">
                <li>
                  <span><Star size={14} /> Overall Rating</span>
                  <strong>{avgRating ? `${avgRating}/5.0` : 'Loading...'}</strong>
                </li>
                {university.ranking && (
                  <li>
                    <span><TrendingUp size={14} /> Ranking</span>
                    <strong>#{university.ranking}</strong>
                  </li>
                )}
                <li>
                  <span><Book size={14} /> Programs</span>
                  <strong>{programCount !== null ? `${programCount} Available` : 'Loading...'}</strong>
                </li>
                {university.acceptanceRate && (
                  <li>
                    <span><Percent size={14} /> Acceptance</span>
                    <strong>{university.acceptanceRate}%</strong>
                  </li>
                )}
                {scholarshipCount !== null && scholarshipCount > 0 && (
                  <li>
                    <span><Heart size={14} /> Scholarships</span>
                    <strong>{scholarshipCount} Available</strong>
                  </li>
                )}
              </ul>
            </div>

            <div className="detail-sidebar-card">
              <h3>Questions?</h3>
              <p>Contact us for more information about this university or the application process.</p>
              <button className="detail-contact-btn">Get in Touch</button>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
