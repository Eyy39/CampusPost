import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Heart } from 'lucide-react';
import './UniversityCard.css';

export default function UniversityCard({ university, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();
  const { id, name, image, location, rating, tuition, topMajor, type } = university;

  const badgeColor = type === 'Public University' ? '#F97316' : '#10B981';

  const handleViewDetails = () => {
    navigate(`/universities/${id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <article className="univ-card">
      <div className="univ-card-image">
        <img src={image} alt={name} loading="lazy" />
        <span className="univ-card-badge" style={{ background: badgeColor }}>
          {type}
        </span>
        {onToggleFavorite && (
          <button
            className={`univ-card-favorite ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="univ-card-body">
        <h3 className="univ-card-title">{name}</h3>

        <div className="univ-card-location">
          <MapPin size={15} />
          <span>{location}</span>
        </div>

        <div className="univ-card-rating">
          <Star size={15} fill="#F59E0B" stroke="#F59E0B" />
          <span className="univ-card-rating-value">{rating}</span>
        </div>

        <div className="univ-card-info">
          <div className="univ-card-info-item">
            <span className="univ-card-info-label">TUITION FEE</span>
            <span className="univ-card-info-value">{tuition}</span>
          </div>
          <div className="univ-card-info-divider" />
          <div className="univ-card-info-item">
            <span className="univ-card-info-label">TOP MAJOR</span>
            <span className="univ-card-info-value">{topMajor}</span>
          </div>
        </div>

        <button className="univ-card-btn" onClick={handleViewDetails}>
          View Details
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}
