import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Star, Book, Award, Globe, Mail, Phone,
  Clock, GraduationCap, TrendingUp, Percent, Calendar, ExternalLink,
  Heart, Sparkles, MessageSquare, Send, ChevronDown, ChevronUp,
} from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import './university-detail.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

function StarRating({ rating, size = 16, interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span className={`detail-stars ${interactive ? 'detail-stars-interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= (hover || rating) ? '#F59E0B' : 'none'}
          stroke={i <= (hover || rating) ? '#F59E0B' : '#D1D5DB'}
          style={interactive ? { cursor: 'pointer' } : undefined}
          onMouseEnter={interactive ? () => setHover(i) : undefined}
          onMouseLeave={interactive ? () => setHover(0) : undefined}
          onClick={interactive ? () => onChange(i) : undefined}
        />
      ))}
    </span>
  );
}

function ReviewForm({ onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }
    setError('');
    onSubmit({ rating, comment: comment.trim() }).then(() => {
      setRating(0);
      setComment('');
    }).catch((err) => {
      setError(err.message || 'Failed to submit review');
    });
  };

  return (
    <form className="detail-review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      <div className="detail-review-form-rating">
        <span className="detail-review-form-label">Your Rating</span>
        <StarRating rating={rating} size={22} interactive onChange={setRating} />
      </div>
      <textarea
        className="detail-review-form-textarea"
        placeholder="Share your experience with this university..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />
      {error && <span className="detail-review-form-error">{error}</span>}
      <button type="submit" className="detail-review-form-submit" disabled={loading}>
        <Send size={16} /> {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

function CommentForm({ onSubmit, loading }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write a comment');
      return;
    }
    setError('');
    onSubmit({ content: content.trim() }).then(() => {
      setContent('');
    }).catch((err) => {
      setError(err.message || 'Failed to post comment');
    });
  };

  return (
    <form className="detail-comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="detail-comment-input"
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => { setContent(e.target.value); setError(''); }}
      />
      <button type="submit" className="detail-comment-submit" disabled={loading}>
        <Send size={14} />
      </button>
      {error && <span className="detail-comment-error">{error}</span>}
    </form>
  );
}

function ReviewCard({ review, universityId, isLoggedIn, onCommentAdded }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(review.Comments || []);
  const [commentLoading, setCommentLoading] = useState(false);

  const handleAddComment = async (data) => {
    setCommentLoading(true);
    try {
      const newComment = await api.post(`/reviews/${review.review_id}/comments`, data);
      setComments([...comments, newComment]);
      if (onCommentAdded) onCommentAdded();
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="detail-review-card">
      <div className="detail-review-header">
        <div className="detail-review-avatar">
          {review.User?.first_name?.[0]}{review.User?.last_name?.[0]}
        </div>
        <div className="detail-review-meta">
          <span className="detail-review-name">
            {review.User?.first_name} {review.User?.last_name}
          </span>
          <span className="detail-review-date">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
          </span>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>
      {review.comment && (
        <p className="detail-review-comment">{review.comment}</p>
      )}
      <div className="detail-review-actions">
        <button
          className="detail-review-toggle-comments"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare size={14} />
          {comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}` : 'Comments'}
          {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      {showComments && (
        <div className="detail-comments-section">
          {comments.length > 0 ? (
            <div className="detail-comments-list">
              {comments.map((c) => (
                <div key={c.comment_id} className="detail-comment-item">
                  <div className="detail-comment-avatar">
                    {c.User?.first_name?.[0]}{c.User?.last_name?.[0]}
                  </div>
                  <div className="detail-comment-body">
                    <div className="detail-comment-header">
                      <span className="detail-comment-name">
                        {c.User?.first_name} {c.User?.last_name}
                      </span>
                      <span className="detail-comment-date">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="detail-comment-text">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="detail-comments-empty">No comments yet. Be the first to comment.</p>
          )}
          {isLoggedIn && (
            <CommentForm onSubmit={handleAddComment} loading={commentLoading} />
          )}
        </div>
      )}
    </div>
  );
}

export default function UniversityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('campuspost_token')));
  }, []);

  const fetchUniversity = () => {
    api.get(`/universities/${id}`)
      .then((data) => {
        const minTuition = data.Majors?.length
          ? Math.min(...data.Majors.map((m) => Number(m.tuition_fee) || 0))
          : 0;
        const maxTuition = data.Majors?.length
          ? Math.max(...data.Majors.map((m) => Number(m.tuition_fee) || 0))
          : 0;
        const reviews = data.Reviews || [];
        const avgRating = reviews.length
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : null;

        setUniversity({
          id: data.university_id,
          name: data.name,
          image: data.logo || FALLBACK_IMAGE,
          location: [data.city, data.country].filter(Boolean).join(', ') || 'Cambodia',
          address: data.address || null,
          ranking: data.ranking || null,
          acceptanceRate: data.acceptance_rate || null,
          rating: avgRating || (data.ranking ? Math.max(1, 6 - data.ranking).toFixed(1) : '4.5'),
          tuition: data.Majors?.length
            ? (minTuition === maxTuition
              ? `$${minTuition.toLocaleString()}/year`
              : `$${minTuition.toLocaleString()}–${maxTuition.toLocaleString()}/year`)
            : 'Contact for details',
          majors: data.Majors || [],
          scholarships: data.Scholarships || [],
          reviews,
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
  };

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  const handleSubmitReview = async (data) => {
    setReviewLoading(true);
    try {
      await api.post('/reviews', {
        university_id: parseInt(id),
        rating: data.rating,
        comment: data.comment,
      });
      fetchUniversity();
    } finally {
      setReviewLoading(false);
    }
  };

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

  const avgRating = university.reviews.length
    ? (university.reviews.reduce((s, r) => s + r.rating, 0) / university.reviews.length).toFixed(1)
    : null;

  return (
    <Layout activePage="Universities">
      <div className="university-detail-page">
        {/* Back Button */}
        <div className="detail-top-bar">
          <button onClick={() => navigate('/universities')} className="detail-back-btn">
            <ArrowLeft size={18} /> Back to Universities
          </button>
        </div>

        {/* Hero Banner */}
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

        {/* Main Content + Sidebar */}
        <div className="detail-container">
          <div className="detail-main">
            {/* Overview */}
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
                    <span className="detail-info-value">{university.rating}/5.0</span>
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

            {/* About */}
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

            {/* Tuition */}
            <section className="detail-section">
              <h2>Tuition Fee</h2>
              <div className="detail-tuition-banner">
                <GraduationCap size={28} />
                <div>
                  <span className="detail-tuition-label">Annual Tuition Range</span>
                  <span className="detail-tuition-range">{university.tuition}</span>
                </div>
              </div>
            </section>

            {/* Programs */}
            {university.majors.length > 0 && (
              <section className="detail-section">
                <h2>Available Programs</h2>
                <div className="detail-majors-grid">
                  {university.majors.map((major) => (
                    <div key={major.major_id} className="detail-major-card">
                      <div className="detail-major-icon">
                        <Book size={20} />
                      </div>
                      <div className="detail-major-content">
                        <h3>{major.major_name}</h3>
                        <div className="detail-major-meta">
                          {major.degree_level && (
                            <span className="detail-badge detail-badge-blue">{major.degree_level}</span>
                          )}
                          {major.duration && (
                            <span className="detail-badge detail-badge-gray">
                              <Clock size={12} /> {major.duration}
                            </span>
                          )}
                        </div>
                        {major.tuition_fee && (
                          <p className="detail-major-tuition">
                            ${Number(major.tuition_fee).toLocaleString()}/year
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Scholarships */}
            {university.scholarships.length > 0 && (
              <section className="detail-section">
                <h2>Scholarships</h2>
                <div className="detail-scholarships-list">
                  {university.scholarships.map((scholarship) => (
                    <div key={scholarship.scholarship_id} className="detail-scholarship-card">
                      <div className="detail-scholarship-header">
                        <div className="detail-scholarship-icon">
                          <Sparkles size={20} />
                        </div>
                        <div className="detail-scholarship-info">
                          <h3>{scholarship.title}</h3>
                          <div className="detail-scholarship-tags">
                            {scholarship.amount !== null && scholarship.amount !== undefined && (
                              <span className="detail-tag detail-tag-green">
                                {Number(scholarship.amount) === 0 ? '100% Coverage' : `$${Number(scholarship.amount).toLocaleString()}`}
                              </span>
                            )}
                            {scholarship.spots && (
                              <span className="detail-tag detail-tag-blue">{scholarship.spots} spots</span>
                            )}
                            {scholarship.deadline && (
                              <span className="detail-tag detail-tag-amber">
                                <Calendar size={12} /> Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {scholarship.description && (
                        <p className="detail-scholarship-desc">{scholarship.description}</p>
                      )}
                      {scholarship.eligibility && (
                        <div className="detail-scholarship-eligibility">
                          <strong>Eligibility:</strong> {scholarship.eligibility}
                        </div>
                      )}
                      {scholarship.registration_url && (
                        <a
                          href={scholarship.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="detail-scholarship-link"
                        >
                          Learn More <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="detail-section">
              <h2>Student Reviews</h2>

              {/* Average Rating Summary */}
              <div className="detail-reviews-summary">
                <div className="detail-reviews-summary-left">
                  {avgRating ? (
                    <>
                      <span className="detail-reviews-avg-number">{avgRating}</span>
                      <div className="detail-reviews-avg-stars">
                        <StarRating rating={parseFloat(avgRating)} size={18} />
                        <span className="detail-reviews-count">
                          Based on {university.reviews.length} review{university.reviews.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="detail-reviews-no-rating">No reviews yet</span>
                  )}
                </div>
              </div>

              {/* Write a Review Form */}
              {isLoggedIn ? (
                <ReviewForm onSubmit={handleSubmitReview} loading={reviewLoading} />
              ) : (
                <div className="detail-review-login-prompt">
                  <p>
                    <Star size={16} />{' '}
                    <a href="/login" className="detail-review-login-link">Log in</a> to write a review.
                  </p>
                </div>
              )}

              {/* Reviews List */}
              {university.reviews.length > 0 ? (
                <div className="detail-reviews-list">
                  {university.reviews.map((review) => (
                    <ReviewCard
                      key={review.review_id}
                      review={review}
                      universityId={id}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>
              ) : (
                <div className="detail-reviews-empty">
                  <MessageSquare size={40} />
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </section>

            {/* Contact */}
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

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="detail-sidebar-card detail-sidebar-apply">
              <h3>Apply Now</h3>
              <p>Start your application to {university.name} today.</p>
              <button className="detail-apply-btn">
                Start Your Application
              </button>
            </div>

            <div className="detail-sidebar-card">
              <h3>Key Statistics</h3>
              <ul className="detail-stats-list">
                <li>
                  <span><Star size={14} /> Overall Rating</span>
                  <strong>{university.rating}/5.0</strong>
                </li>
                {university.ranking && (
                  <li>
                    <span><TrendingUp size={14} /> Ranking</span>
                    <strong>#{university.ranking}</strong>
                  </li>
                )}
                <li>
                  <span><Book size={14} /> Programs</span>
                  <strong>{university.majors.length} Available</strong>
                </li>
                {university.acceptanceRate && (
                  <li>
                    <span><Percent size={14} /> Acceptance</span>
                    <strong>{university.acceptanceRate}%</strong>
                  </li>
                )}
                {university.scholarships.length > 0 && (
                  <li>
                    <span><Heart size={14} /> Scholarships</span>
                    <strong>{university.scholarships.length} Available</strong>
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
