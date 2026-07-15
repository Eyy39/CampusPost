import React, { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useLazy, CardSkeleton } from './LazySection';
import { api } from '../utils/api';

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

export default function LazyReviews({ universityId, isLoggedIn, onData }) {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchReviews = () => {
    setLoading(true);
    api.get(`/reviews?university_id=${universityId}`)
      .then((data) => {
        setReviews(data);
        if (onData && data) {
          const avg = data.length
            ? (data.reduce((sum, r) => sum + r.rating, 0) / data.length).toFixed(1)
            : null;
          onData({ avgRating: avg, count: data.length });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [universityId]);

  const handleSubmitReview = async (data) => {
    setReviewLoading(true);
    try {
      await api.post('/reviews', {
        university_id: parseInt(universityId),
        rating: data.rating,
        comment: data.comment,
      });
      fetchReviews();
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="detail-section">
        <h2>Student Reviews</h2>
        <CardSkeleton count={2} />
      </section>
    );
  }

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="detail-section">
      <h2>Student Reviews</h2>

      <div className="detail-reviews-summary">
        <div className="detail-reviews-summary-left">
          {avgRating ? (
            <>
              <span className="detail-reviews-avg-number">{avgRating}</span>
              <div className="detail-reviews-avg-stars">
                <StarRating rating={parseFloat(avgRating)} size={18} />
                <span className="detail-reviews-count">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            </>
          ) : (
            <span className="detail-reviews-no-rating">No reviews yet</span>
          )}
        </div>
      </div>

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

      {reviews && reviews.length > 0 ? (
        <div className="detail-reviews-list">
          {reviews.map((review) => (
            <ReviewCard
              key={review.review_id}
              review={review}
              universityId={universityId}
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
  );
}
