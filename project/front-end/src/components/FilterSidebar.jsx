import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Star } from 'lucide-react';
import './FilterSidebar.css';

export default function FilterSidebar({ onApply }) {
  const [name, setName] = useState('');
  const [tuition, setTuition] = useState(15000);
  const [major, setMajor] = useState('');
  const [minRating, setMinRating] = useState(0);

  const handleApply = (e) => {
    e.preventDefault();
    if (onApply) {
      onApply({ name, tuition, major, minRating });
    }
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <SlidersHorizontal size={18} />
        <h3>Filters</h3>
      </div>

      <form onSubmit={handleApply} className="filter-form">
        <div className="filter-group">
          <label>University Name</label>
          <div className="filter-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Tuition Range (up to)</label>
          <div className="filter-range-display">$0 — ${tuition.toLocaleString()}</div>
          <div className="filter-range-wrapper">
            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              value={tuition}
              onChange={(e) => setTuition(Number(e.target.value))}
              className="filter-range"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Major / Program</label>
          <div className="filter-input-wrapper">
            <select value={major} onChange={(e) => setMajor(e.target.value)}>
              <option value="">All Programs</option>
              <option value="software">Software Engineering</option>
              <option value="data">Data Science</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="artificial intelligence">Artificial Intelligence</option>
              <option value="computer science">Computer Science</option>
              <option value="information technology">Information Technology</option>
              <option value="engineering">Engineering</option>
              <option value="telecommunication">Telecommunications</option>
              <option value="digital">Digital Arts & Media</option>
              <option value="management">Business & Management</option>
            </select>
            <ChevronDown size={16} className="filter-select-icon" />
          </div>
        </div>

        <div className="filter-group">
          <label>Minimum Rating</label>
          <div className="filter-star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`filter-star-btn ${minRating >= star ? 'active' : ''}`}
                onClick={() => setMinRating(minRating === star ? 0 : star)}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
              >
                <Star size={20} fill={minRating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
            {minRating > 0 && (
              <button
                type="button"
                className="filter-star-clear"
                onClick={() => setMinRating(0)}
              >
                Clear
              </button>
            )}
          </div>
          {minRating > 0 && (
            <div className="filter-star-display">{minRating}+ stars</div>
          )}
        </div>

        <button type="submit" className="filter-apply-btn">
          Apply Filters
        </button>
      </form>
    </aside>
  );
}
