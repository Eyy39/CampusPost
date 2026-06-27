import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react';
import './FilterSidebar.css';

export default function FilterSidebar() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [tuition, setTuition] = useState(15000);
  const [major, setMajor] = useState('');
  const [scholarship, setScholarship] = useState(false);
  const [minRating, setMinRating] = useState(3);

  const handleApply = (e) => {
    e.preventDefault();
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
          <label>Location</label>
          <div className="filter-input-wrapper">
            <MapPin size={16} />
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">All Cambodia</option>
              <option value="phnom-penh">Phnom Penh</option>
              <option value="siem-reap">Siem Reap</option>
              <option value="battambang">Battambang</option>
            </select>
            <ChevronDown size={16} className="filter-select-icon" />
          </div>
        </div>

        <div className="filter-group">
          <label>Tuition Range</label>
          <div className="filter-range-display">$0 — ${tuition.toLocaleString()}</div>
          <div className="filter-range-wrapper">
            <input
              type="range"
              min={0}
              max={25000}
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
              <option value="">IT & Computer Science</option>
              <option value="business">Business</option>
              <option value="engineering">Engineering</option>
              <option value="medicine">Medicine</option>
              <option value="law">Law</option>
            </select>
            <ChevronDown size={16} className="filter-select-icon" />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-checkbox-label">
            <input
              type="checkbox"
              checked={scholarship}
              onChange={(e) => setScholarship(e.target.checked)}
            />
            <span className="filter-checkbox-mark" />
            Scholarship Available
          </label>
        </div>

        <div className="filter-group">
          <label>Minimum Rating</label>
          <div className="filter-rating-labels">
            <span className={minRating >= 3 ? 'active' : ''}>3+ stars</span>
            <span className={minRating >= 4 ? 'active' : ''}>4+ stars</span>
          </div>
          <div className="filter-range-wrapper">
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="filter-range"
            />
          </div>
        </div>

        <button type="submit" className="filter-apply-btn">
          Apply Filters
        </button>
      </form>
    </aside>
  );
}
