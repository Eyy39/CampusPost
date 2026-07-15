import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Star,
  MapPin,
} from "lucide-react";
import "./FilterSidebar.css";

export default function FilterSidebar({ onApply, onFilter }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [tuition, setTuition] = useState(25000);
  const [major, setMajor] = useState("");
  const [scholarship, setScholarship] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const handleApply = (e) => {
    e.preventDefault();
    const filters = { name, location, tuition, major, scholarship, minRating };
    if (onFilter) {
      onFilter(filters);
      return;
    }
    if (onApply) {
      onApply(filters);
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
          <label>Location</label>
          <div className="filter-input-wrapper">
            <MapPin size={16} />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Cambodia</option>
              <option value="phnom penh">Phnom Penh</option>
              <option value="siem reap">Siem Reap</option>
              <option value="battambang">Battambang</option>
            </select>
            <ChevronDown size={16} className="filter-select-icon" />
          </div>
          <label>Tuition Range</label>
          <div className="filter-range-display">
            $0 — ${tuition.toLocaleString()}
          </div>
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
              <option value="">All Programs</option>
              <option value="software">Software Engineering</option>
              <option value="data">Data Science</option>
              <option value="business">Business</option>
              <option value="engineering">Engineering</option>
              <option value="it">Information Technology</option>
              <option value="telecommunication">Telecommunications</option>
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
                className={`filter-star-btn ${minRating >= star ? "active" : ""}`}
                onClick={() => setMinRating(minRating === star ? 0 : star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  size={20}
                  fill={minRating >= star ? "currentColor" : "none"}
                />
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
