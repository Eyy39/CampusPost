import React from 'react';
import { Search, MapPin, ArrowRight, GraduationCap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-badge">
            <GraduationCap size={16} />
            Discover Cambodia's Universities
          </div>

          <h1 className="hero-title">
            Find Your Future
            <span className="hero-highlight">University</span>
            in Cambodia
          </h1>

          <p className="hero-description">
            CampusPost helps students discover top Cambodian universities,
            compare programs, and find scholarships — all in one place.
            Start your higher education journey today.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary">
              Search Universities
              <Search size={18} />
            </button>
            <button className="btn btn-outline-primary">
              Explore Scholarships
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="hero-search">
            <div className="hero-search-field">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by university or major..."
              />
            </div>
            <div className="hero-search-field">
              <MapPin size={18} />
              <select defaultValue="">
                <option value="" disabled>All Provinces</option>
                <option value="phnom-penh">Phnom Penh</option>
                <option value="siem-reap">Siem Reap</option>
                <option value="battambang">Battambang</option>
                <option value="kompong-cham">Kompong Cham</option>
                <option value="prey-veng">Prey Veng</option>
                <option value="takeo">Takeo</option>
              </select>
            </div>
            <button className="hero-search-btn">
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Cambodian university campus with students"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
